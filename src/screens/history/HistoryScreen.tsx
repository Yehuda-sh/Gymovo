// src/screens/history/HistoryScreen.tsx - ✅ Fixed לתמיכה בנתוני דמו

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { WorkoutCard } from "../../components/workouts/WorkoutCard";
import { useDemoData } from "../../hooks/useDemoData";
import { useWorkoutHistory } from "../../hooks/useWorkoutHistory";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Workout } from "../../types/workout";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

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

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const user = useUserStore((state: UserState) => state.user);

  // ✅ Fixed: שימוש ב-hooks המתאימים לנתוני דמו ואמיתיים
  const { isDemoUser, demoWorkouts, isLoading: isDemoLoading } = useDemoData();
  const {
    data: realWorkouts = [],
    isLoading: isRealLoading,
    error: realError,
  } = useWorkoutHistory({}, { enabled: !isDemoUser });

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

  // ✅ Fixed: סטטיסטיקות מעודכנות
  const stats = useMemo(() => {
    if (!workouts.length) return null;

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0
    );
    const totalVolume = workouts.reduce((sum, w) => {
      return (
        sum +
        (w.exercises?.reduce((exerciseSum, ex) => {
          return (
            exerciseSum +
            (ex.sets?.reduce((setSum, set) => {
              return setSum + (set.weight || 0) * (set.reps || 0);
            }, 0) || 0)
          );
        }, 0) || 0)
      );
    }, 0);
    const avgRating =
      workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / totalWorkouts;

    return {
      totalWorkouts,
      totalDuration: Math.round(totalDuration),
      totalVolume: Math.round(totalVolume),
      averageRating: avgRating.toFixed(1),
    };
  }, [workouts]);

  const handleStartWorkout = () => {
    navigation.navigate("Plans");
  };

  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate("WorkoutDetails", { workoutId: workout.id });
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
          onPress={() => window.location.reload()}
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
              <Text style={styles.statLabel}>ק"ג כולל</Text>
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
            style={styles.workoutCard}
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
    marginBottom: 12,
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
