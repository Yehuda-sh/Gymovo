// src/screens/plans/plans-screen/PlansScreen.tsx
// מסך תוכניות - 3 תוכניות בסיס + תוכנית AI אישית

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
import { getPlansByUserId, deletePlan } from "../../../data/storage";
import { fetchPublicPlansWithFallback } from "../../../services/wgerApi";
import { loadQuizProgress } from "../../../services/quizProgressService";

// Stores & Types
import { useUserStore } from "../../../stores/userStore";
import { useNavigation } from "@react-navigation/native";
import { designSystem } from "../../../theme/designSystem";
import { Plan } from "../../../types/plan";

const PlansScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);

  // State
  const [userPlans, setUserPlans] = useState<Plan[]>([]);
  const [basePlans, setBasePlans] = useState<Plan[]>([]);
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

  // טעינת תוכניות - רק בסיס + AI אישית
  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. טען תוכניות בסיס (3 בלבד)
      const publicData = await fetchPublicPlansWithFallback();
      setBasePlans(publicData);

      // 2. טען רק תוכניות AI של המשתמש (לא תוכניות ידניות)
      if (user?.id) {
        const allUserPlans = await getPlansByUserId(user.id);

        // סנן רק תוכניות שנוצרו ע"י AI (מהשאלון)
        const aiPlans = allUserPlans.filter(
          (plan) =>
            plan.tags?.includes("AI-generated") || plan.creator === "Gymovo AI"
        );

        // בדוק אם המשתמש השלים שאלון
        const quizProgress = await loadQuizProgress(user.id);
        if (quizProgress?.isCompleted && aiPlans.length === 0) {
          // אם השלים שאלון אבל אין תוכנית AI - כנראה נמחקה
          console.log("User completed quiz but no AI plan found");
        }

        setUserPlans(aiPlans);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  // Load plans
  useEffect(() => {
    loadPlans();
    animateEntrance();
  }, [loadPlans, animateEntrance]);

  // סינון תוכניות לפי הגדרות המשתמש
  const filteredPlans = useMemo(() => {
    let plansToShow: Plan[] = [];

    if (selectedFilter === "all") {
      // הצג תוכניות בסיס + תוכנית AI אישית
      plansToShow = [...basePlans, ...userPlans];
    } else if (selectedFilter === "mine") {
      // הצג רק תוכנית AI אישית
      plansToShow = userPlans;
    } else {
      // הצג רק תוכניות בסיס
      plansToShow = basePlans;
    }

    return filterPlansBySearch(plansToShow, searchQuery);
  }, [basePlans, userPlans, selectedFilter, searchQuery]);

  // רענון רשימת התוכניות
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPlans();
  };

  // מחיקת תוכנית - רק תוכניות AI אישיות
  const handleDeletePlan = async (planId: string) => {
    const planToDelete = userPlans.find((p) => p.id === planId);
    if (!planToDelete) {
      Alert.alert("שגיאה", "לא ניתן למחוק תוכניות בסיס");
      return;
    }

    Alert.alert(
      "מחיקת תוכנית AI",
      "האם אתה בטוח? תצטרך למלא שאלון מחדש כדי לקבל תוכנית חדשה",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlan(planId, user?.id || "");
              console.log("AI plan deleted successfully");
              loadPlans();
            } catch (error) {
              console.error("Error deleting plan:", error);
            }
          },
        },
      ]
    );
  };

  // שיתוף תוכנית
  const handleSharePlan = async (plan: Plan) => {
    try {
      await Share.share({
        message: `תוכנית אימון מומלצת: ${plan.name}\n${plan.description || ""}`,
        title: plan.name,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // עבור לעריכת תוכנית
  const handlePlanPress = (plan: Plan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("CreateOrEditPlan", { planId: plan.id });
  };

  // יצירת תוכנית חדשה - הפנה לשאלון
  const handleCreatePlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "יצירת תוכנית מותאמת אישית",
      "תוכניות מותאמות נוצרות על ידי מילוי שאלון קצר. האם תרצה למלא את השאלון?",
      [
        { text: "לא עכשיו", style: "cancel" },
        {
          text: "מלא שאלון",
          onPress: () => {
            navigation.navigate("Quiz", {
              signupData: {
                email: user?.email || "",
                password: "",
                age: user?.age || 25,
                name: user?.name,
              },
            });
          },
        },
      ]
    );
  };

  // רינדור פריט תוכנית
  const renderPlan = ({ item, index }: { item: Plan; index: number }) => {
    const isAIPlan = userPlans.some((p) => p.id === item.id);

    return (
      <PlanCard
        plan={item}
        index={index}
        onPress={() => handlePlanPress(item)}
        onShare={() => handleSharePlan(item)}
        onDelete={isAIPlan ? () => handleDeletePlan(item.id) : undefined}
      />
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E86FF" />
      </View>
    );
  }

  const totalPlans = filteredPlans.length;
  const hasAIPlan = userPlans.length > 0;

  return (
    <View style={styles.container}>
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
          colors={["#2E86FF", "#1968DB"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>תוכניות האימון שלי</Text>
          <Text style={styles.subtitle}>
            {hasAIPlan
              ? `3 תוכניות בסיס + תוכנית AI אישית`
              : `3 תוכניות בסיס זמינות`}
          </Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <FilterTabs selected={selectedFilter} onSelect={setSelectedFilter} />

        <FlatList
          data={filteredPlans}
          renderItem={renderPlan}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[designSystem.colors.primary.main]}
            />
          }
          ListEmptyComponent={<EmptyState onCreatePlan={handleCreatePlan} />}
        />

        {!hasAIPlan && (
          <TouchableOpacity style={styles.fab} onPress={handleCreatePlan}>
            <LinearGradient
              colors={["#2E86FF", "#1968DB"]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "right",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "right",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlansScreen;
