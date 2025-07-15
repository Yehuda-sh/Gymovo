// src/screens/plans/plans-screen/PlansScreen.tsx
// מסך תוכניות - גרסה מתוקנת עם כל השגיאות מטופלות

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

// Local components
import {
  SearchBar,
  FilterTabs,
  PlanCard,
  EmptyState,
  NavigationProp,
  FilterType,
  createEntranceAnimation,
  filterPlansBySearch,
} from "./index";

// Data & Services
import { deletePlan } from "../../../data/storage";
import { fetchPublicPlansWithFallback } from "../../../services/wgerApi";
import { loadQuizProgress } from "../../../services/quizProgressService";

// Stores & Types
import { useUserStore } from "../../../stores/userStore";
import { useNavigation } from "@react-navigation/native";
import { designSystem } from "../../../theme/designSystem";
import { Plan } from "../../../types/plan";
import { colors } from "../../../theme/colors";

// הרחבה זמנית של Plan עד לעדכון הטיפוס הראשי
interface PlanWithAI extends Plan {
  isAiGenerated?: boolean;
}

const PlansScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);

  // State
  const [userPlans, setUserPlans] = useState<PlanWithAI[]>([]);
  const [basePlans, setBasePlans] = useState<PlanWithAI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;

  // הפעלת אנימציית כניסה
  const animateEntrance = useCallback(() => {
    createEntranceAnimation(fadeAnim, slideAnim, headerScale).start();
  }, [fadeAnim, slideAnim, headerScale]);

  // טעינת תוכניות
  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. טען תוכניות בסיס
      const publicData = await fetchPublicPlansWithFallback();
      setBasePlans(publicData as PlanWithAI[]);

      // 2. טען תוכנית AI אישית אם קיימת
      if (user?.id) {
        const quizProgress = await loadQuizProgress(user.id);
        if (quizProgress && quizProgress.isCompleted) {
          // יצירת תוכנית AI מההתקדמות בשאלון
          const aiPlanWithFlag: PlanWithAI = {
            id: `ai-plan-${user.id}`,
            name: "התוכנית האישית שלי",
            description: "תוכנית אימונים מותאמת אישית שנוצרה על ידי AI",
            userId: user.id,
            createdAt: quizProgress.completedAt || new Date().toISOString(),
            updatedAt: quizProgress.lastUpdated || new Date().toISOString(),
            isAiGenerated: true,
            creator: "AI Assistant",
            difficulty: quizProgress.answers.experience || "intermediate",
            targetMuscleGroups: quizProgress.answers.equipment || [],
            days: [], // יתמלא מאוחר יותר בהתאם לתשובות
          };
          setUserPlans([aiPlanWithFlag]);
        }
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את התוכניות");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadPlans();
    animateEntrance();
  }, [loadPlans, animateEntrance]);

  // סינון תוכניות
  const filteredPlans = useMemo(() => {
    let plans: PlanWithAI[] = [];

    switch (selectedFilter) {
      case "mine":
        plans = userPlans;
        break;
      case "recommended":
        plans = basePlans;
        break;
      default:
        plans = [...userPlans, ...basePlans];
    }

    return filterPlansBySearch(plans, searchQuery);
  }, [userPlans, basePlans, selectedFilter, searchQuery]);

  // רענון
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadPlans();
  }, [loadPlans]);

  // מחיקת תוכנית
  const handleDeletePlan = useCallback(
    async (planId: string) => {
      Alert.alert("מחיקת תוכנית", "האם אתה בטוח שברצונך למחוק את התוכנית?", [
        {
          text: "ביטול",
          style: "cancel",
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            try {
              if (user?.id) {
                await deletePlan(user.id, planId);
                setUserPlans((prev) => prev.filter((p) => p.id !== planId));
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }
            } catch (error) {
              console.error("Error deleting plan:", error);
              Alert.alert("שגיאה", "לא ניתן למחוק את התוכנית");
            }
          },
        },
      ]);
    },
    [user?.id]
  );

  // שיתוף תוכנית
  const handleSharePlan = useCallback(async (plan: PlanWithAI) => {
    try {
      const difficultyText = {
        beginner: "מתחילים",
        intermediate: "מתקדמים",
        advanced: "מומחים",
      }[plan.difficulty || "intermediate"];

      const message = `
🏋️ ${plan.name}

${plan.description || ""}

📊 פרטי התוכנית:
• ${plan.days?.length || 0} ימי אימון בשבוע
• רמת קושי: ${difficultyText}
• ${plan.targetMuscleGroups?.join(", ") || "כל הגוף"}

התחל להתאמן עם Gymovo! 💪
      `.trim();

      await Share.share({
        message,
        title: `תוכנית אימונים: ${plan.name}`,
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Error sharing plan:", error);
    }
  }, []);

  // ניווט לתוכנית
  const handlePlanPress = useCallback(
    (plan: PlanWithAI) => {
      // ניווט למסך הנכון בהתאם לסוג התוכנית
      navigation.navigate("CreateOrEditPlan", { planId: plan.id });
    },
    [navigation]
  );

  // רינדור כרטיס תוכנית
  const renderPlanCard = useCallback(
    ({ item, index }: { item: PlanWithAI; index: number }) => {
      const isUserPlan = userPlans.some((p) => p.id === item.id);

      return (
        <PlanCard
          plan={item}
          index={index}
          onPress={() => handlePlanPress(item)}
          onShare={() => handleSharePlan(item)}
          onDelete={isUserPlan ? () => handleDeletePlan(item.id) : undefined}
          isUserPlan={isUserPlan}
        />
      );
    },
    [userPlans, handlePlanPress, handleSharePlan, handleDeletePlan]
  );

  // כותרת עם אנימציה
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ scale: headerScale }],
        },
      ]}
    >
      <LinearGradient
        colors={designSystem.gradients.primary.colors as any}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>תוכניות אימון</Text>
            <Text style={styles.headerSubtitle}>
              {filteredPlans.length} תוכניות זמינות
            </Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("CreateOrEditPlan", {})}
          >
            <Ionicons name="add-circle" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="חפש תוכנית..."
      />

      <FilterTabs
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        counts={{
          all: userPlans.length + basePlans.length,
          mine: userPlans.length,
          recommended: basePlans.length,
        }}
      />
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={designSystem.colors.primary.main}
        />
        <Text style={styles.loadingText}>טוען תוכניות...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPlans}
        renderItem={renderPlanCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            message={
              searchQuery
                ? "לא נמצאו תוכניות התואמות לחיפוש"
                : selectedFilter === "mine"
                ? "עדיין אין לך תוכניות אישיות"
                : "אין תוכניות זמינות כרגע"
            }
            actionText={
              selectedFilter === "mine" ? "צור תוכנית חדשה" : undefined
            }
            onAction={
              selectedFilter === "mine"
                ? () => navigation.navigate("CreateOrEditPlan", {})
                : undefined
            }
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[designSystem.colors.primary.main]}
            tintColor={designSystem.colors.primary.main}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  createButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default PlansScreen;
