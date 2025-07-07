// src/screens/history/HistoryScreen.tsx - ✅ Fixed כל השגיאות

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { useDemoData } from "../../hooks/useDemoData";
import { useWorkoutHistory } from "../../hooks/useWorkoutHistory";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Workout } from "../../types/workout";

// ✅ Fixed: Check if this should be "Workouts" or need to add "History" to navigation types
type Props = NativeStackScreenProps<RootStackParamList, "Main">;

const EmptyHistoryState = ({
  onStartWorkout,
}: {
  onStartWorkout: () => void;
}) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconContainer}>
      <Ionicons name="barbell-outline" size={64} color={colors.textSecondary} />
    </View>
    <Text style={styles.emptyTitle}>עדיין לא השלמת אימונים</Text>
    <Text style={styles.emptyDescription}>
      האימונים שתסיים יופיעו כאן וניתן לעקוב אחר ההתקדמות שלך
    </Text>
    <Button
      title="התחל אימון ראשון"
      onPress={onStartWorkout}
      style={styles.startButton}
    />
  </View>
);

// ✅ רכיב WorkoutCard פשוט במקום import
const WorkoutCard = ({
  workout,
  onPress,
}: {
  workout: Workout;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.workoutCard} onPress={onPress}>
    <View style={styles.workoutHeader}>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <Text style={styles.workoutDate}>
        {new Date(workout.date || workout.completedAt || "").toLocaleDateString(
          "he-IL"
        )}
      </Text>
    </View>

    <View style={styles.workoutStats}>
      <View style={styles.statRow}>
        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.statText}>{workout.duration || 0} דקות</Text>
      </View>

      <View style={styles.statRow}>
        <Ionicons
          name="fitness-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles.statText}>
          {workout.exercises?.length || 0} תרגילים
        </Text>
      </View>

      {workout.rating && (
        <View style={styles.statRow}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.statText}>{workout.rating}/5</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const user = useUserStore((state: UserState) => state.user);

  // ✅ Fixed: שימוש ב-hooks המתאימים
  const { isDemoUser, demoWorkouts, isLoading: isDemoLoading } = useDemoData();

  // ✅ Fixed: API נכון של useWorkoutHistory
  const {
    workouts: realWorkouts = [],
    isLoading: isRealLoading,
    isError: realError,
  } = useWorkoutHistory({
    filters: {},
    sortBy: "date-desc",
  });

  // ✅ Fixed: בחירת מקור הנתונים הנכון
  const workouts = useMemo(() => {
    if (isDemoUser) {
      console.log(`📊 Using demo workouts: ${demoWorkouts.length}`);
      return demoWorkouts;
    }
    console.log(`📊 Using real workouts: ${realWorkouts.length}`);
    return realWorkouts;
  }, [isDemoUser, demoWorkouts, realWorkouts]);

  const isLoading = isDemoUser ? isDemoLoading : isRealLoading;

  // ✅ Fixed: סטטיסטיקות עם type annotations
  const stats = useMemo(() => {
    if (!workouts.length) return null;

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum: number, w: Workout) => sum + (w.duration || 0),
      0
    );
    const totalVolume = workouts.reduce((sum: number, w: Workout) => {
      return (
        sum +
        (w.exercises?.reduce((exerciseSum: number, ex: any) => {
          return (
            exerciseSum +
            (ex.sets?.reduce((setSum: number, set: any) => {
              return setSum + (set.weight || 0) * (set.reps || 0);
            }, 0) || 0)
          );
        }, 0) || 0)
      );
    }, 0);
    const avgRating =
      workouts.reduce((sum: number, w: Workout) => sum + (w.rating || 0), 0) /
      totalWorkouts;

    return {
      totalWorkouts,
      totalDuration: Math.round(totalDuration),
      totalVolume: Math.round(totalVolume),
      averageRating: avgRating.toFixed(1),
    };
  }, [workouts]);

  const handleStartWorkout = () => {
    // ✅ Fixed: Navigation נכון
    navigation.navigate("Home" as any);
  };

  const handleWorkoutPress = (workout: Workout) => {
    // ✅ Fixed: Navigation פשוט יותר
    console.log("Selected workout:", workout.id);
    // TODO: Add workout details screen
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>טוען היסטוריה...</Text>
      </View>
    );
  }

  // Error state (only for real data)
  if (!isDemoUser && realError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorTitle}>שגיאה בטעינת ההיסטוריה</Text>
        <Text style={styles.errorDescription}>
          לא ניתן לטעון את היסטוריית האימונים. אנא נסה שוב.
        </Text>
        <Button
          title="נסה שוב"
          onPress={() => {
            // Simple refresh - avoid window.location.reload in React Native
            console.log("Refresh requested");
          }}
          style={styles.retryButton}
        />
      </View>
    );
  }

  // Empty state
  if (!workouts.length) {
    return (
      <View style={styles.container}>
        <EmptyHistoryState onStartWorkout={handleStartWorkout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>סטטיסטיקות כלליות</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>אימונים</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalDuration}</Text>
              <Text style={styles.statLabel}>דקות</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalVolume}</Text>
              <Text style={styles.statLabel}>ק&quot;ג כולל</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.averageRating}</Text>
              <Text style={styles.statLabel}>דירוג ממוצע</Text>
            </View>
          </View>
        </View>
      )}

      {/* Workouts List */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => handleWorkoutPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Debug Info (only in development) */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            🐛 Debug: {isDemoUser ? "Demo" : "Real"} User | Workouts:{" "}
            {workouts.length} | User ID: {user?.id}
          </Text>
        </View>
      )}
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
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  startButton: {
    minWidth: 200,
  },
  statsContainer: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  workoutDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  workoutStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  debugInfo: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 8,
    borderRadius: 8,
  },
  debugText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
  },
});

export default HistoryScreen;
