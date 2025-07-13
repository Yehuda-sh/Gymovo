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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

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
      setBasePlans(publicData.slice(0, 3)); // רק 3 תוכניות בסיס

      // 2. טען תוכניות המשתמש (כולל AI אישית אם יש)
      if (user?.id) {
        const userPlansList = await getPlansByUserId(user.id);
        setUserPlans(userPlansList);
      } else {
        setUserPlans([]);
      }

      // 3. בדוק אם יש תוכנית AI אישית
      const quizProgress = user?.id ? await loadQuizProgress(user.id) : null;
      if (
        quizProgress?.completedAt &&
        !userPlans.some((p) => p.name?.includes("AI"))
      ) {
        // אם השלים שאלון ואין תוכנית AI - הצע ליצור
        Alert.alert(
          "תוכנית AI אישית זמינה! 🎯",
          "השלמת את השאלון! כעת תוכל ליצור תוכנית אימונים אישית מבוססת AI.",
          [
            { text: "אחר כך", style: "cancel" },
            {
              text: "צור תוכנית",
              onPress: () =>
                navigation.navigate("Main", { screen: "CreateOrEditPlan" }),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את התוכניות");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, navigation]);

  // בדיקה אם יש תוכנית AI
  const hasAIPlan = useMemo(() => {
    return userPlans.some(
      (plan) =>
        plan.name?.toLowerCase().includes("ai") || plan.name?.includes("אישית")
    );
  }, [userPlans]);

  // סינון תוכניות
  const filteredPlans = useMemo(() => {
    let allPlans: Plan[] = [];

    switch (selectedFilter) {
      case "mine":
        allPlans = userPlans;
        break;
      case "public":
        allPlans = basePlans;
        break;
      case "all":
      default:
        // תוכניות המשתמש מופיעות ראשונות
        allPlans = [...userPlans, ...basePlans];
        break;
    }

    // החל חיפוש אם יש
    if (searchQuery.trim()) {
      return filterPlansBySearch(allPlans, searchQuery);
    }

    return allPlans;
  }, [userPlans, basePlans, selectedFilter, searchQuery]);

  // טעינה ראשונית
  useEffect(() => {
    loadPlans();
    animateEntrance();
  }, [loadPlans, animateEntrance]);

  // רענון בחזרה למסך
  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, [loadPlans])
  );

  // יצירת תוכנית חדשה
  const handleCreatePlan = useCallback(() => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (hasAIPlan) {
      // אם יש כבר תוכנית AI, צור תוכנית רגילה
      navigation.navigate("Main", { screen: "CreateOrEditPlan" });
    } else {
      // אם אין תוכנית AI, בדוק אם השלים שאלון
      if (user?.id) {
        loadQuizProgress(user.id).then((progress) => {
          if (progress?.completedAt) {
            // השלים שאלון - הצע AI
            Alert.alert(
              "איזו תוכנית תרצה ליצור?",
              "יש לך אפשרות ליצור תוכנית AI אישית או תוכנית רגילה",
              [
                { text: "ביטול", style: "cancel" },
                {
                  text: "תוכנית רגילה",
                  onPress: () =>
                    navigation.navigate("Main", { screen: "CreateOrEditPlan" }),
                },
                {
                  text: "תוכנית AI",
                  onPress: () =>
                    navigation.navigate("Main", { screen: "CreateOrEditPlan" }),
                  style: "default",
                },
              ]
            );
          } else {
            // לא השלים שאלון
            Alert.alert(
              "תוכנית AI אישית",
              "כדי ליצור תוכנית AI אישית, צריך קודם למלא שאלון קצר",
              [
                { text: "אחר כך", style: "cancel" },
                {
                  text: "למלא שאלון",
                  onPress: () =>
                    navigation.navigate("Main", { screen: "Welcome" }),
                },
              ]
            );
          }
        });
      } else {
        // משתמש לא מחובר
        navigation.navigate("Main", { screen: "CreateOrEditPlan" });
      }
    }
  }, [hasAIPlan, navigation, user?.id]);

  // מחיקת תוכנית
  const handleDeletePlan = useCallback(
    async (plan: Plan) => {
      Alert.alert(
        "מחיקת תוכנית",
        `האם אתה בטוח שברצונך למחוק את התוכנית "${plan.name}"?`,
        [
          { text: "ביטול", style: "cancel" },
          {
            text: "מחק",
            style: "destructive",
            onPress: async () => {
              try {
                if (user?.id) {
                  await deletePlan(user.id, plan.id);
                  if (Platform.OS === "ios") {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                  }
                  await loadPlans();
                }
              } catch (error: any) {
                console.error("Error deleting plan:", error);
                Alert.alert("שגיאה", "לא ניתן למחוק את התוכנית");
              }
            },
          },
        ]
      );
    },
    [user?.id, loadPlans]
  );

  // שיתוף תוכנית
  const handleSharePlan = useCallback(async (plan: Plan) => {
    try {
      const message = `
🏋️ תוכנית אימונים: ${plan.name}

📋 תיאור: ${plan.description || "תוכנית אימונים מקצועית"}

📊 פרטים:
• ${plan.days?.length || 0} ימי אימון בשבוע
• רמת קושי: ${plan.difficulty || "מתאימה לכולם"}
• משך: ${plan.days?.length ? `${plan.days.length * 4} שבועות` : "4 שבועות"}

💪 הורד את אפליקציית Gymovo והתחל להתאמן!
      `.trim();

      await Share.share({
        message,
        title: `תוכנית אימונים - ${plan.name}`,
      });

      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error("Error sharing plan:", error);
    }
  }, []);

  // רענון
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadPlans();
  }, [loadPlans]);

  // רינדור תוכנית
  const renderPlan = useCallback(
    ({ item, index }: { item: Plan; index: number }) => {
      return (
        <PlanCard
          plan={item}
          index={index}
          onPress={() =>
            navigation.navigate("Main", { screen: "StartWorkout" })
          }
          onDelete={
            item.userId === user?.id ? () => handleDeletePlan(item) : undefined
          }
          onShare={() => handleSharePlan(item)}
        />
      );
    },
    [navigation, handleDeletePlan, handleSharePlan, user?.id]
  );

  // מסך טעינה
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
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            designSystem.colors.primary.main,
            designSystem.colors.primary.dark,
          ]}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>התוכניות שלי</Text>
          <Text style={styles.subtitle}>
            {hasAIPlan
              ? `${userPlans.length} תוכניות אישיות + ${basePlans.length} תוכניות בסיס`
              : `${basePlans.length} תוכניות בסיס זמינות`}
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
              tintColor={designSystem.colors.primary.main}
            />
          }
          ListEmptyComponent={<EmptyState onCreatePlan={handleCreatePlan} />}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreatePlan}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              designSystem.colors.primary.main,
              designSystem.colors.primary.dark,
            ]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: designSystem.colors.background.primary,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
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
