// src/screens/workouts/WorkoutsScreen.tsx
// מסך היסטוריית אימונים מחולק ומסודר - מציג רשימת אימונים עם סינון, סיווג וסטטיסטיקות

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  StatsOverview,
  FilterPills,
  WorkoutCard,
  EmptyState,
  WorkoutFilterModal,
  WorkoutHistoryFilters,
  WorkoutStats,
  modernColors,
} from "../../components/workout-history";
import { Workout, WorkoutSortBy } from "../../types/workout";
import { RootStackParamList } from "../../types/navigation";
import { useWorkoutStore } from "../../stores/workoutStore";

// הרכיב הראשי למסך היסטוריית אימונים - מנהל state ולוגיקה
const WorkoutsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const workoutStore = useWorkoutStore();

  const [filters, setFilters] = useState<WorkoutHistoryFilters>({});
  const [sortBy, setSortBy] = useState<WorkoutSortBy>("date-desc");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // קבלת אימונים מה-store
  const workouts = workoutStore.workouts || [];
  const isLoading = false; // ניתן להוסיף loading state ל-store
  const isError = false; // ניתן להוסיף error state ל-store

  // חישוב סטטיסטיקות בזמן אמת
  const stats = useMemo((): WorkoutStats => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyWorkouts = workouts.filter(
      (w) => w.date && w.date >= weekAgo
    ).length;
    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0
    );
    const ratingsCount = workouts.filter((w) => w.rating).length;
    const averageRating =
      ratingsCount > 0
        ? workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / ratingsCount
        : 0;

    return {
      totalWorkouts: workouts.length,
      weeklyWorkouts,
      totalDuration,
      averageRating,
    };
  }, [workouts]);

  // סינון ומיון אימונים לפי הגדרות המשתמש
  const filteredWorkouts = useMemo(() => {
    let filtered = [...workouts];

    // החלת סינונים
    if (filters.dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "3months":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }

      if (filters.dateRange !== "all") {
        filtered = filtered.filter((w) => w.date && w.date >= startDate);
      }
    }

    if (filters.minRating) {
      filtered = filtered.filter((w) => (w.rating || 0) >= filters.minRating!);
    }

    if (filters.minDuration) {
      filtered = filtered.filter(
        (w) => w.duration && w.duration >= filters.minDuration!
      );
    }

    // החלת מיון
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.date!.getTime() - a.date!.getTime();
        case "date-asc":
          return a.date!.getTime() - b.date!.getTime();
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "duration-desc":
          return (b.duration || 0) - (a.duration || 0);
        case "duration-asc":
          return (a.duration || 0) - (b.duration || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [workouts, filters, sortBy]);

  // חישוב מספר הסינונים הפעילים
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => filters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [filters]);

  // פונקציה לרענון הרשימה
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // טיפול בלחיצה על אימון - מעבר למסך סיכום
  const handleWorkoutPress = useCallback(
    (workout: Workout) => {
      navigation.navigate("WorkoutSummary", { workoutData: workout });
    },
    [navigation]
  );

  // טיפול בלחיצה ארוכה על אימון - תפריט פעולות
  const handleWorkoutLongPress = useCallback(
    (workout: Workout) => {
      Alert.alert("אפשרויות אימון", "מה תרצה לעשות?", [
        {
          text: "שתף",
          onPress: async () => {
            try {
              await Share.share({
                message: `סיימתי אימון ${workout.name}! 💪\nזמן: ${workout.duration} דקות\nתרגילים: ${workout.completedExercises}/${workout.totalExercises}`,
              });
            } catch (error) {
              console.error(error);
            }
          },
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "מחיקת אימון",
              "האם אתה בטוח שברצונך למחוק את האימון?",
              [
                { text: "ביטול", style: "cancel" },
                {
                  text: "מחק",
                  style: "destructive",
                  onPress: () => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    workoutStore.deleteWorkout(workout.id);
                  },
                },
              ]
            );
          },
        },
        { text: "ביטול", style: "cancel" },
      ]);
    },
    [workoutStore]
  );

  // מעבר למסך התחלת אימון חדש
  const handleStartWorkout = useCallback(() => {
    navigation.navigate("StartWorkout");
  }, [navigation]);

  // החלפת אופן המיון בלחיצה על כפתור המיון
  const handleSortPress = useCallback(() => {
    const sortOptions: WorkoutSortBy[] = [
      "date-desc",
      "date-asc",
      "rating-desc",
      "rating-asc",
      "duration-desc",
      "duration-asc",
    ];

    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [sortBy]);

  // רכיב עבור רינדור כל אימון ברשימה
  const renderWorkout = useCallback(
    ({ item, index }: { item: Workout; index: number }) => (
      <WorkoutCard
        workout={item}
        onPress={() => handleWorkoutPress(item)}
        onLongPress={() => handleWorkoutLongPress(item)}
        index={index}
      />
    ),
    [handleWorkoutPress, handleWorkoutLongPress]
  );

  // פונקציה להמרת סוג המיון לטקסט ידידותי
  const getSortLabel = (sort: WorkoutSortBy) => {
    switch (sort) {
      case "date-desc":
        return "חדש ביותר";
      case "date-asc":
        return "ישן ביותר";
      case "rating-desc":
        return "דירוג גבוה";
      case "rating-asc":
        return "דירוג נמוך";
      case "duration-desc":
        return "ארוך ביותר";
      case "duration-asc":
        return "קצר ביותר";
      default:
        return "מיון";
    }
  };

  // מסך שגיאה במקרה של בעיה בטעינת הנתונים
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={modernColors.danger} />
        <Text style={styles.errorTitle}>אופס!</Text>
        <Text style={styles.errorMessage}>משהו השתבש בטעינת האימונים</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleRefresh();
          }}
        >
          <Text style={styles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* כותרת עם כפתורי פעולה */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>היסטוריית אימונים</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setShowStats(!showStats);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons
              name={showStats ? "stats-chart" : "stats-chart-outline"}
              size={24}
              color={modernColors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* פאנל סטטיסטיקות */}
      {showStats && <StatsOverview stats={stats} />}

      {/* שורת בקרת סינון ומיון */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFiltersCount > 0 && styles.filterButtonActive,
          ]}
          onPress={() => {
            setShowFilterModal(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons
            name="filter"
            size={20}
            color={activeFiltersCount > 0 ? "white" : modernColors.primary}
          />
          <Text
            style={[
              styles.filterButtonText,
              activeFiltersCount > 0 && styles.filterButtonTextActive,
            ]}
          >
            סינון {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
          <Ionicons
            name="swap-vertical"
            size={20}
            color={modernColors.primary}
          />
          <Text style={styles.sortButtonText}>{getSortLabel(sortBy)}</Text>
        </TouchableOpacity>
      </View>

      {/* גלולות הסינונים הפעילים */}
      {activeFiltersCount > 0 && (
        <FilterPills
          filters={filters}
          onRemoveFilter={(key) => {
            const newFilters = { ...filters };
            delete newFilters[key];
            setFilters(newFilters);
          }}
        />
      )}

      {/* רשימת האימונים או מצבי טעינה/ריק */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={modernColors.primary} />
          <Text style={styles.loadingText}>טוען אימונים...</Text>
        </View>
      ) : filteredWorkouts.length === 0 ? (
        <EmptyState onStartWorkout={handleStartWorkout} />
      ) : (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={modernColors.primary}
              colors={[modernColors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* כפתור צף להוספת אימון חדש */}
      {filteredWorkouts.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleStartWorkout();
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={modernColors.primaryGradient as any}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* מודאל סינון מתקדם */}
      <WorkoutFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </View>
  );
};

// סטיילים למסך הראשי - עיצוב נקי ומודרני
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modernColors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: modernColors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: modernColors.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: modernColors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: modernColors.border,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: modernColors.surface,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: modernColors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: modernColors.primary,
  },
  filterButtonTextActive: {
    color: "white",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: modernColors.surface,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: modernColors.primary,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: modernColors.textSecondary,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: modernColors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: modernColors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: modernColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default WorkoutsScreen;
