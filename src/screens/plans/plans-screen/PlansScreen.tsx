// src/screens/plans/plans-screen/PlansScreen.tsx
// מסך תוכניות האימון הראשי - גרסה מודולרית ומורפקטרת

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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Components
import Button from "../../../components/common/Button";

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
  getScreenDimensions,
} from "./index";

// Data & Services
import { getDemoPlanForUser } from "../../../constants/demoUsers";
import { getPlansByUserId, savePlan, deletePlan } from "../../../data/storage";
import { fetchPublicPlansWithFallback } from "../../../services/wgerApi";

// Stores & Types
import { useUserStore } from "../../../stores/userStore";
import { useNavigation } from "@react-navigation/native";
import { designSystem } from "../../../theme/designSystem";
import { Plan } from "../../../types/plan";

const { width } = getScreenDimensions();

// מסך תוכניות אימון ראשי עם רכיבים מודולריים
const PlansScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);

  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [publicPlans, setPublicPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;

  // Load plans
  useEffect(() => {
    loadPlans();
    animateEntrance();
  }, []);

  // הפעלת אנימציית כניסה
  const animateEntrance = () => {
    createEntranceAnimation(fadeAnim, slideAnim, headerScale).start();
  };

  // טעינת תוכניות מכל המקורות
  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load user plans
      if (user?.id) {
        const userPlans = await getPlansByUserId(user.id);

        // Add demo plan if exists
        const demoPlan = getDemoPlanForUser(user.id);
        if (demoPlan) {
          const allUserPlans = [...userPlans];
          const exists = allUserPlans.some((p) => p.id === demoPlan.id);
          if (!exists) {
            allUserPlans.push(demoPlan);
          }
          setPlans(allUserPlans);
        } else {
          setPlans(userPlans);
        }
      }

      // Load public plans (with fallback to demo plans)
      try {
        const publicData = await fetchPublicPlansWithFallback();
        setPublicPlans(publicData);
      } catch (error) {
        console.log("Could not load public plans:", error);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      console.error("Failed to load plans:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  // סינון תוכניות לפי הגדרות המשתמש
  const filteredPlans = useMemo(() => {
    let allPlans: Plan[] = [];

    if (selectedFilter === "all") {
      allPlans = [...plans, ...publicPlans];
    } else if (selectedFilter === "mine") {
      allPlans = plans;
    } else {
      allPlans = publicPlans;
    }

    return filterPlansBySearch(allPlans, searchQuery);
  }, [plans, publicPlans, selectedFilter, searchQuery]);

  // רענון רשימת התוכניות
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPlans();
  };

  // מחיקת תוכנית עם אישור
  const handleDeletePlan = async (planId: string) => {
    Alert.alert("מחיקת תוכנית", "האם אתה בטוח שברצונך למחוק תוכנית זו?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlan(planId, user?.id || "");
            console.log("Plan deleted successfully");
            loadPlans();
          } catch (error) {
            console.error("Error deleting plan:", error);
          }
        },
      },
    ]);
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

  // יצירת תוכנית חדשה
  const handleCreatePlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("CreateOrEditPlan");
  };

  // רינדור פריט תוכנית
  const renderPlan = ({ item, index }: { item: Plan; index: number }) => (
    <PlanCard
      plan={item}
      index={index}
      onPress={() => handlePlanPress(item)}
      onShare={() => handleSharePlan(item)}
      onDelete={
        selectedFilter === "mine" || plans.includes(item)
          ? () => handleDeletePlan(item.id)
          : undefined
      }
    />
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
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* כותרת */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>תוכניות האימון שלי</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPlans.length} תוכניות זמינות
        </Text>
      </Animated.View>

      {/* שורת חיפוש */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="חפש תוכנית אימון..."
      />

      {/* פילטרים */}
      <FilterTabs selected={selectedFilter} onSelect={setSelectedFilter} />

      {/* רשימת תוכניות */}
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlan}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={designSystem.colors.primary.main}
            colors={[designSystem.colors.primary.main]}
          />
        }
        ListEmptyComponent={<EmptyState onCreatePlan={handleCreatePlan} />}
      />

      {/* כפתור יצירה צף */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePlan}>
        <LinearGradient
          colors={designSystem.gradients.primary.colors}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
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
    marginTop: 16,
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 28,
    ...designSystem.shadows.xl,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlansScreen;
