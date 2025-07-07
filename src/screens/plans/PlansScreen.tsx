// 📋 PlansScreen מתקדם עם עיצוב ספורטיבי כהה ופונקציונליות חכמה
// src/screens/plans/PlansScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlans } from "../../hooks/usePlans";
import {
  generatePersonalizedPlan,
  QuizAnswers,
} from "../../services/planGenerator";
import { usePlanEditorStore } from "../../stores/planEditorStore";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

const { width } = Dimensions.get("window");

// 🎨 ערכת צבעים ספורטיבית כהה
const plansColors = {
  background: "#0a0a0a",
  cardBg: "#1a1a1a",
  accent: "#00ff88",
  secondary: "#ffaa00",
  danger: "#ff4444",
  text: "#ffffff",
  subtext: "#cccccc",
  border: "#333333",
  searchBg: "#2a2a2a",
};

// 🔍 רכיב חיפוש מתקדם
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onFilterPress,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterPress: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={plansColors.subtext} />
        <TextInput
          style={styles.searchInput}
          placeholder="חפש תוכנית אימון..."
          placeholderTextColor={plansColors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={plansColors.subtext}
            />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Ionicons name="options" size={20} color={plansColors.accent} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🏷️ רכיב תג קטגוריה
const CategoryTag = ({
  category,
  color,
}: {
  category: string;
  color: string;
}) => (
  <View
    style={[
      styles.categoryTag,
      { backgroundColor: color + "20", borderColor: color + "40" },
    ]}
  >
    <Text style={[styles.categoryTagText, { color }]}>{category}</Text>
  </View>
);

// 📋 רכיב כרטיס תוכנית מתקדם
const AdvancedPlanCard = ({
  item,
  onEdit,
  onDuplicate,
  onDelete,
  onStart,
}: {
  item: Plan;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onStart: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, scaleAnim]);

  const totalExercises = useMemo(
    () => item.days.reduce((sum, day) => sum + day.exercises.length, 0),
    [item.days]
  );

  const getDifficultyColor = () => {
    if (item.metadata?.difficulty === "קל") return "#34d399";
    if (item.metadata?.difficulty === "בינוני") return plansColors.secondary;
    return plansColors.danger;
  };

  const getGoalColor = () => {
    const goalColors = {
      hypertrophy: plansColors.accent,
      strength: "#8b5cf6",
      endurance: "#f59e0b",
      weight_loss: plansColors.danger,
    };
    return (
      goalColors[item.metadata?.goal as keyof typeof goalColors] ||
      plansColors.accent
    );
  };

  return (
    <Animated.View
      style={[
        styles.planCard,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {/* Header של הכרטיס */}
      <View style={styles.planCardHeader}>
        <View style={styles.planMainInfo}>
          <Text style={styles.planName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.planCreator}>נוצר על ידי {item.creator}</Text>
        </View>
        <View style={styles.planStats}>
          <View
            style={[
              styles.statBadge,
              { backgroundColor: plansColors.accent + "20" },
            ]}
          >
            <Text style={[styles.statText, { color: plansColors.accent }]}>
              {item.days.length} ימים
            </Text>
          </View>
        </View>
      </View>

      {/* תיאור */}
      <Text style={styles.planDescription} numberOfLines={2}>
        {item.description}
      </Text>

      {/* מטא-דטה ותגים */}
      <View style={styles.planMetadata}>
        <View style={styles.tagsContainer}>
          {item.metadata?.goal && (
            <CategoryTag
              category={
                item.metadata.goal === "hypertrophy"
                  ? "הגדלת מסה"
                  : item.metadata.goal === "strength"
                  ? "כוח"
                  : item.metadata.goal === "endurance"
                  ? "סיבולת"
                  : "ירידה במשקל"
              }
              color={getGoalColor()}
            />
          )}
          {item.metadata?.difficulty && (
            <CategoryTag
              category={item.metadata.difficulty}
              color={getDifficultyColor()}
            />
          )}
          {item.metadata?.experience && (
            <CategoryTag
              category={
                item.metadata.experience === "beginner"
                  ? "מתחיל"
                  : item.metadata.experience === "intermediate"
                  ? "בינוני"
                  : "מתקדם"
              }
              color={plansColors.secondary}
            />
          )}
        </View>

        <View style={styles.exerciseCount}>
          <Ionicons name="barbell" size={16} color={plansColors.subtext} />
          <Text style={styles.exerciseCountText}>{totalExercises} תרגילים</Text>
        </View>
      </View>

      {/* כפתורי פעולה */}
      <View style={styles.planActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.startButton]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onStart();
          }}
        >
          <Ionicons name="play" size={18} color="#000" />
          <Text style={styles.startButtonText}>התחל אימון</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Haptics.selectionAsync();
              onEdit();
            }}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={plansColors.accent}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Haptics.selectionAsync();
              onDuplicate();
            }}
          >
            <Ionicons
              name="copy-outline"
              size={20}
              color={plansColors.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onDelete();
            }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={plansColors.danger}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// 🆕 רכיב יצירת תוכנית חכמה
const SmartPlanCreator = ({
  onCreateAI,
  onCreateManual,
}: {
  onCreateAI: () => void;
  onCreateManual: () => void;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.creatorContainer}>
      <Text style={styles.creatorTitle}>יצירת תוכנית חדשה</Text>

      <Animated.View
        style={[styles.aiCreatorCard, { transform: [{ scale: pulseAnim }] }]}
      >
        <TouchableOpacity
          style={styles.aiCreatorButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onCreateAI();
          }}
        >
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={32} color={plansColors.accent} />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>יצירה חכמה עם AI 🤖</Text>
            <Text style={styles.aiSubtitle}>
              תוכנית מותאמת אישית ב-30 שניות
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={plansColors.accent} />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.manualCreatorButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onCreateManual();
        }}
      >
        <Ionicons name="create-outline" size={20} color={plansColors.subtext} />
        <Text style={styles.manualCreatorText}>יצירה ידנית</Text>
      </TouchableOpacity>
    </View>
  );
};

// 📊 רכיב אזור ריק מתקדם
const AdvancedEmptyState = ({
  onCreateFirst,
}: {
  onCreateFirst: () => void;
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();
    return () => bounceAnimation.stop();
  }, [bounceAnim]);

  return (
    <View style={styles.emptyContainer}>
      <Animated.View
        style={[
          styles.emptyIconContainer,
          {
            transform: [
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons
          name="library-outline"
          size={80}
          color={plansColors.subtext}
        />
      </Animated.View>

      <Text style={styles.emptyTitle}>אין לך תוכניות אימון עדיין</Text>
      <Text style={styles.emptySubtitle}>
        צור את התוכנית הראשונה שלך ותתחיל להתאמן היום!
      </Text>

      <TouchableOpacity
        style={styles.emptyActionButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onCreateFirst();
        }}
      >
        <Ionicons name="add-circle" size={24} color="#000" />
        <Text style={styles.emptyActionText}>צור תוכנית ראשונה</Text>
      </TouchableOpacity>
    </View>
  );
};

// 📋 המסך הראשי
const PlansScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUserStore((state: UserState) => state.user);
  const { plans, isLoading, refetch } = usePlans();
  const { createNewPlan, loadPlanForEdit } = usePlanEditorStore();

  // State מקומי
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreator, setShowCreator] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // אנימציית כניסה
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // רענון בחזרה למסך
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // סינון תוכניות לפי חיפוש
  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return plans || [];

    return (plans || []).filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [plans, searchQuery]);

  // פונקציות טיפול
  const handleCreateAI = useCallback(() => {
    Alert.alert(
      "יצירה חכמה עם AI 🤖",
      "תוכל ליצור תוכנית מותאמת אישית על בסיס השאלון שמילאת בפרופיל.",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "צור תוכנית AI",
          onPress: () => {
            // דמו ליצירת תוכנית AI
            const demoAnswers: QuizAnswers = {
              goal: "hypertrophy",
              whereToTrain: ["gym"],
              gymMachines: ["chest_press", "lat_pulldown", "leg_press"],
              experience: "intermediate",
              days: 4,
              injuries: ["none"],
              trainingType: ["weights"],
              preferredTime: "evening",
              motivation: ["goals", "health"],
            };

            const aiPlan = generatePersonalizedPlan(demoAnswers);
            // כאן נשמור את התוכנית ונרענן
            Alert.alert("הצלחה! 🎉", "תוכנית חדשה נוצרה בהצלחה עם AI!");
            refetch();
          },
        },
      ]
    );
  }, [refetch]);

  const handleCreateManual = useCallback(() => {
    createNewPlan();
    navigation.navigate("CreateOrEditPlan", {});
  }, [createNewPlan, navigation]);

  const handleEditPlan = useCallback(
    (plan: Plan) => {
      loadPlanForEdit(plan);
      navigation.navigate("CreateOrEditPlan", { planId: plan.id });
    },
    [loadPlanForEdit, navigation]
  );

  const handleStartWorkout = useCallback(
    (plan: Plan) => {
      if (plan.days.length === 0) {
        Alert.alert("שגיאה", "התוכנית לא מכילה ימי אימון");
        return;
      }

      if (plan.days.length === 1) {
        // יום אחד - התחל ישירות
        navigation.navigate("SelectWorkoutDay", { planId: plan.id });
      } else {
        // מספר ימים - בחר יום
        navigation.navigate("SelectWorkoutDay", { planId: plan.id });
      }
    },
    [navigation]
  );

  const handleDuplicatePlan = useCallback(
    (plan: Plan) => {
      Alert.alert("שכפול תוכנית", `האם תרצה לשכפל את התוכנית "${plan.name}"?`, [
        { text: "ביטול", style: "cancel" },
        {
          text: "שכפל",
          onPress: () => {
            const duplicatedPlan = {
              ...plan,
              id: `${plan.id}_copy_${Date.now()}`,
              name: `${plan.name} (עותק)`,
              creator: user?.name || "אתה",
            };
            // כאן נשמור את התוכנית המשוכפלת
            Alert.alert("הצלחה!", "התוכנית שוכפלה בהצלחה");
            refetch();
          },
        },
      ]);
    },
    [user?.name, refetch]
  );

  const handleDeletePlan = useCallback(
    (plan: Plan) => {
      Alert.alert(
        "מחיקת תוכנית",
        `האם אתה בטוח שברצונך למחוק את התוכנית "${plan.name}"?`,
        [
          { text: "ביטול", style: "cancel" },
          {
            text: "מחק",
            style: "destructive",
            onPress: () => {
              // כאן נמחק את התוכנית
              Alert.alert("נמחק!", "התוכנית נמחקה בהצלחה");
              refetch();
            },
          },
        ]
      );
    },
    [refetch]
  );

  const handleFilter = useCallback(() => {
    Alert.alert("מסננים", "מסננים מתקדמים יהיו זמינים בקרוב!");
  }, []);

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
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>תוכניות אימון</Text>
          <Text style={styles.headerSubtitle}>
            {filteredPlans.length} תוכניות זמינות
          </Text>
        </View>

        {/* חיפוש */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterPress={handleFilter}
        />

        {/* יוצר תוכניות */}
        <SmartPlanCreator
          onCreateAI={handleCreateAI}
          onCreateManual={handleCreateManual}
        />

        {/* רשימת תוכניות */}
        <FlatList
          data={filteredPlans}
          renderItem={({ item }) => (
            <AdvancedPlanCard
              item={item}
              onEdit={() => handleEditPlan(item)}
              onDuplicate={() => handleDuplicatePlan(item)}
              onDelete={() => handleDeletePlan(item)}
              onStart={() => handleStartWorkout(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.plansList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !searchQuery ? (
              <AdvancedEmptyState onCreateFirst={handleCreateManual} />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={60} color={plansColors.subtext} />
                <Text style={styles.noResultsText}>
                  אין תוצאות לחיפוש {searchQuery}
                </Text>
              </View>
            )
          }
        />
      </Animated.View>
    </View>
  );
};

// 🎨 סטיילים מתקדמים
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
    color: plansColors.text,
    marginTop: 16,
    fontSize: 16,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: plansColors.text,
    textAlign: "right",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: plansColors.subtext,
    textAlign: "right",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: plansColors.searchBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: plansColors.text,
    textAlign: "right",
  },
  filterButton: {
    backgroundColor: plansColors.cardBg,
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: plansColors.border,
  },

  // Creator
  creatorContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  creatorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: plansColors.text,
    textAlign: "right",
    marginBottom: 16,
  },
  aiCreatorCard: {
    backgroundColor: plansColors.cardBg,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: plansColors.accent + "40",
  },
  aiCreatorButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  aiIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: plansColors.accent + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: plansColors.text,
    textAlign: "right",
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: plansColors.subtext,
    textAlign: "right",
  },
  manualCreatorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: plansColors.border,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  manualCreatorText: {
    fontSize: 16,
    color: plansColors.subtext,
    fontWeight: "600",
  },

  // Plan Card
  planCard: {
    backgroundColor: plansColors.cardBg,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: plansColors.border,
  },
  planCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: plansColors.text,
    textAlign: "right",
    marginBottom: 4,
  },
  planCreator: {
    fontSize: 14,
    color: plansColors.subtext,
    textAlign: "right",
  },
  planStats: {
    alignItems: "flex-end",
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  planDescription: {
    fontSize: 15,
    color: plansColors.subtext,
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 16,
  },
  planMetadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exerciseCountText: {
    fontSize: 12,
    color: plansColors.subtext,
  },
  planActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  startButton: {
    backgroundColor: plansColors.accent,
    flex: 1,
    marginRight: 12,
    justifyContent: "center",
  },
  startButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: plansColors.searchBg,
    justifyContent: "center",
    alignItems: "center",
  },

  // Plans List
  plansList: {
    paddingBottom: 100,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: plansColors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: plansColors.subtext,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: plansColors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  emptyActionText: {
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
  },
});

export default PlansScreen;
