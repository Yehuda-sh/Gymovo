// src/screens/plans/PlansScreen.tsx - ✅ מסך תוכניות מתקדם עם כל הפיצ'רים

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
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
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import Button from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";

// Data & Services
import { getDemoPlanForUser } from "../../constants/demoUsers";
import { getPlansByUserId, savePlan, deletePlan } from "../../data/storage";
import { fetchPublicPlans } from "../../services/wgerApi";

// Stores & Types
import { useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 🎨 צבעים מותאמים
const plansColors = {
  background: colors.background,
  cardBg: colors.surface,
  accent: colors.primary,
  text: colors.text,
  subtext: colors.textSecondary,
  border: colors.border,
  searchBg: colors.inputBackground || "#2a2a2a",
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  tagBg: colors.primary + "20",
};

// 🏷️ רכיב תג
const Tag = ({
  text,
  color = plansColors.accent,
}: {
  text: string;
  color?: string;
}) => (
  <View
    style={[
      styles.tag,
      { backgroundColor: color + "20", borderColor: color + "40" },
    ]}
  >
    <Text style={[styles.tagText, { color }]}>{text}</Text>
  </View>
);

// 🔍 רכיב חיפוש
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "חפש תוכנית...",
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) => {
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.searchContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Ionicons name="search" size={20} color={plansColors.subtext} />
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={plansColors.subtext}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={20} color={plansColors.subtext} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// 🎯 כרטיס תוכנית מתקדם
const PlanCard = ({
  plan,
  onPress,
  onLongPress,
  isActive = false,
}: {
  plan: Plan;
  onPress: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1deg"],
  });

  const getDifficultyColor = () => {
    switch (plan.difficulty) {
      case "beginner":
        return plansColors.success;
      case "intermediate":
        return plansColors.warning;
      case "advanced":
        return plansColors.error;
      default:
        return plansColors.accent;
    }
  };

  const getExerciseCount = () => {
    if (plan.days) {
      return plan.days.reduce((total, day) => total + day.exercises.length, 0);
    }
    if (plan.workouts) {
      return plan.workouts.reduce(
        (total, workout) => total + workout.exercises.length,
        0
      );
    }
    return 0;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
      <TouchableOpacity
        style={[
          styles.planCard,
          isActive && { borderColor: plansColors.accent, borderWidth: 2 },
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{plan.name}</Text>
            {plan.creator && (
              <Text style={styles.planCreator}>יוצר: {plan.creator}</Text>
            )}
          </View>
          {isActive && (
            <View style={styles.activeBadge}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={plansColors.success}
              />
            </View>
          )}
        </View>

        {/* Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
        >
          {plan.difficulty && (
            <Tag
              text={
                plan.difficulty === "beginner"
                  ? "מתחיל"
                  : plan.difficulty === "intermediate"
                  ? "ביניים"
                  : "מתקדם"
              }
              color={getDifficultyColor()}
            />
          )}
          {plan.tags?.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
          {plan.targetMuscleGroups?.slice(0, 2).map((muscle, index) => (
            <Tag
              key={`muscle-${index}`}
              text={muscle}
              color={plansColors.warning}
            />
          ))}
        </ScrollView>

        {/* Description */}
        {plan.description && (
          <Text style={styles.planDescription} numberOfLines={2}>
            {plan.description}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={16} color={plansColors.subtext} />
            <Text style={styles.statText}>
              {plan.durationWeeks || plan.days?.length || 0} שבועות
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="barbell" size={16} color={plansColors.subtext} />
            <Text style={styles.statText}>{getExerciseCount()} תרגילים</Text>
          </View>
          {plan.rating ? (
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{plan.rating}/5</Text>
            </View>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.planActions}>
          <Button
            title="התחל"
            variant="primary"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPress();
            }}
            style={styles.startButton}
          />
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Toast.show("עריכה - בקרוב", "info")}
            >
              <Ionicons name="pencil" size={18} color={plansColors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={async () => {
                try {
                  await Share.share({
                    message: `בדוק את התוכנית "${plan.name}" באפליקציית Gymovo! 💪`,
                  });
                } catch (error) {
                  console.error("Share failed:", error);
                }
              }}
            >
              <Ionicons
                name="share-social"
                size={18}
                color={plansColors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🌟 Empty State מתקדם
const EmptyState = ({ onCreatePlan }: { onCreatePlan: () => void }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית כניסה
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // אנימציית bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.emptyContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Ionicons
          name="fitness-outline"
          size={100}
          color={plansColors.accent}
        />
      </Animated.View>
      <Text style={styles.emptyTitle}>עוד לא יצרת תוכניות</Text>
      <Text style={styles.emptyText}>
        התחל ליצור תוכנית מותאמת אישית או בחר מהתוכניות המומלצות
      </Text>
      <TouchableOpacity style={styles.createButton} onPress={onCreatePlan}>
        <Ionicons name="add-circle" size={24} color="#000" />
        <Text style={styles.createButtonText}>צור תוכנית ראשונה</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🏋️ מסך תוכניות ראשי
const PlansScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);

  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [publicPlans, setPublicPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "mine" | "public"
  >("all");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Load plans
  useEffect(() => {
    loadPlans();
    animateEntrance();
  }, []);

  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

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

      // Load public plans
      try {
        const wgerPlans = await fetchPublicPlans();
        setPublicPlans(wgerPlans);
      } catch (error) {
        console.error("Failed to load public plans:", error);
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      Toast.show("שגיאה בטעינת התוכניות", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  // Filter plans
  const filteredPlans = useMemo(() => {
    let allPlans: Plan[] = [];

    switch (selectedFilter) {
      case "mine":
        allPlans = plans;
        break;
      case "public":
        allPlans = publicPlans;
        break;
      default:
        allPlans = [...plans, ...publicPlans];
    }

    if (!searchQuery) return allPlans;

    return allPlans.filter((plan) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        plan.name.toLowerCase().includes(searchLower) ||
        plan.description?.toLowerCase().includes(searchLower) ||
        plan.creator?.toLowerCase().includes(searchLower) ||
        plan.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        plan.targetMuscleGroups?.some((muscle) =>
          muscle.toLowerCase().includes(searchLower)
        )
      );
    });
  }, [plans, publicPlans, selectedFilter, searchQuery]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPlans();
  };

  const handlePlanPress = (plan: Plan) => {
    navigation.navigate("SelectWorkoutDay", { planId: plan.id });
  };

  const handlePlanLongPress = (plan: Plan) => {
    const isUserPlan = plans.some((p) => p.id === plan.id);

    Alert.alert(
      plan.name,
      "בחר פעולה",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "התחל אימון",
          onPress: () => handlePlanPress(plan),
        },
        ...(isUserPlan
          ? [
              {
                text: "הגדר כפעילה",
                onPress: async () => {
                  const updatedPlan = { ...plan, isActive: true };
                  // עדכן את כל התוכניות האחרות כלא פעילות
                  const updatedPlans = plans.map((p) => ({
                    ...p,
                    isActive: p.id === plan.id,
                  }));

                  if (user?.id) {
                    for (const p of updatedPlans) {
                      await savePlan(user.id, p);
                    }
                    Toast.show("התוכנית הוגדרה כפעילה", "success");
                    loadPlans();
                  }
                },
              },
              {
                text: "שכפל",
                onPress: () => Toast.show("שכפול - בקרוב", "info"),
              },
              {
                text: "מחק",
                style: "destructive" as const,
                onPress: () => {
                  Alert.alert(
                    "מחיקת תוכנית",
                    "האם אתה בטוח שברצונך למחוק את התוכנית?",
                    [
                      { text: "ביטול", style: "cancel" },
                      {
                        text: "מחק",
                        style: "destructive" as const,
                        onPress: async () => {
                          if (user?.id) {
                            await deletePlan(user.id, plan.id);
                            Toast.show("התוכנית נמחקה", "success");
                            loadPlans();
                          }
                        },
                      },
                    ]
                  );
                },
              },
            ]
          : []),
      ],
      { cancelable: true }
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleCreatePlan = () => {
    Toast.show("יצירת תוכנית - בקרוב", "info");
    // TODO: navigation.navigate("CreatePlan") או navigation.navigate("Quiz")
  };

  // Render
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={plansColors.accent} />
        <Text style={styles.loadingText}>טוען תוכניות...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>התוכניות שלי</Text>
            <Text style={styles.subtitle}>
              {filteredPlans.length} תוכניות זמינות
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleCreatePlan}>
            <Ionicons name="add-circle" size={32} color={plansColors.accent} />
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חפש לפי שם, תגית או שריר..."
        />

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {[
            { key: "all", label: "הכל", icon: "apps" },
            { key: "mine", label: "שלי", icon: "person" },
            { key: "public", label: "ציבורי", icon: "globe" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.filterTabActive,
              ]}
              onPress={() => {
                setSelectedFilter(filter.key as typeof selectedFilter);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name={filter.icon as any}
                size={18}
                color={
                  selectedFilter === filter.key
                    ? plansColors.accent
                    : plansColors.subtext
                }
              />
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === filter.key && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans List */}
        <FlatList
          data={filteredPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlanCard
              plan={item}
              onPress={() => handlePlanPress(item)}
              onLongPress={() => handlePlanLongPress(item)}
              isActive={item.isActive}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredPlans.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[plansColors.accent]}
              tintColor={plansColors.accent}
            />
          }
          ListEmptyComponent={
            searchQuery || selectedFilter !== "all" ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={60} color={plansColors.subtext} />
                <Text style={styles.noResultsText}>
                  לא נמצאו תוכניות התואמות את החיפוש
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                  }}
                >
                  <Text style={styles.clearFiltersText}>נקה מסננים</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <EmptyState onCreatePlan={handleCreatePlan} />
            )
          }
        />
      </Animated.View>
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: plansColors.background,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: plansColors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: plansColors.subtext,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: plansColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: plansColors.subtext,
  },
  addButton: {
    padding: 4,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: plansColors.searchBg,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: plansColors.text,
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: plansColors.searchBg,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: plansColors.accent + "20",
    borderWidth: 1,
    borderColor: plansColors.accent + "40",
  },
  filterTabText: {
    fontSize: 14,
    color: plansColors.subtext,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: plansColors.accent,
  },

  // Plan Card
  planCard: {
    backgroundColor: plansColors.cardBg,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: plansColors.border,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: plansColors.text,
    marginBottom: 4,
  },
  planCreator: {
    fontSize: 14,
    color: plansColors.subtext,
  },
  activeBadge: {
    marginLeft: 8,
  },
  tagsContainer: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  planDescription: {
    fontSize: 15,
    color: plansColors.subtext,
    lineHeight: 22,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: plansColors.subtext,
  },
  planActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  startButton: {
    flex: 1,
    marginRight: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: plansColors.searchBg,
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  listContent: {
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: plansColors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: plansColors.subtext,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: plansColors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  // No Results
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    color: plansColors.subtext,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  clearFiltersText: {
    fontSize: 16,
    color: plansColors.accent,
    fontWeight: "600",
  },
});

export default PlansScreen;
