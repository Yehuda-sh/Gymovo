// src/screens/workouts/WorkoutsScreen.tsx - 🚀 Enhanced Professional Version (Fixed)

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Imports that need to be created or already exist
import { colors } from "../../theme/colors";
import {
  Workout,
  WorkoutHistoryFilters,
  WorkoutSortBy,
} from "../../types/workout";
import { RootStackParamList } from "../../types/navigation";
import WorkoutFilterModal from "../../components/modals/WorkoutFilterModal";

// Mock hook for now - you can replace with real implementation
const useWorkoutHistory = ({
  filters,
  sortBy,
  enableOptimisticUpdates,
}: {
  filters: WorkoutHistoryFilters;
  sortBy: WorkoutSortBy;
  enableOptimisticUpdates: boolean;
}) => {
  // Mock data - replace with real data
  const mockWorkouts: Workout[] = [];

  return {
    workouts: mockWorkouts,
    isLoading: false,
    isError: false,
    refresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    deleteWorkout: async (id: string) => {
      console.log("Delete workout:", id);
    },
    isDeleting: false,
    stats: {
      totalWorkouts: 0,
      weeklyWorkouts: 0,
      totalDuration: 0,
      averageRating: 0,
    },
  };
};

// 🎛️ Filter and Sort Header
const FilterSortHeader = ({
  onFilterPress,
  onSortPress,
  onStatsPress,
  activeFilters,
  currentSort,
  showStats,
}: {
  onFilterPress: () => void;
  onSortPress: () => void;
  onStatsPress: () => void;
  activeFilters: number;
  currentSort: WorkoutSortBy;
  showStats: boolean;
}) => {
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
        return "אימון ארוך";
      case "duration-asc":
        return "אימון קצר";
      case "volume-desc":
        return "נפח גבוה";
      case "volume-asc":
        return "נפח נמוך";
      default:
        return "מיון";
    }
  };

  return (
    <View
      style={[
        styles.filterHeader,
        {
          backgroundColor: colors.background || "#FFFFFF",
          borderBottomColor: colors.border || "#E5E5E7",
        },
      ]}
    >
      <View style={styles.filterLeftSection}>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons
            name="options-outline"
            size={18}
            color={colors.text || "#000"}
          />
          <Text
            style={[styles.filterButtonText, { color: colors.text || "#000" }]}
          >
            סינון
          </Text>
          {activeFilters > 0 && (
            <View
              style={[
                styles.filterBadge,
                { backgroundColor: colors.primary || "#007AFF" },
              ]}
            >
              <Text style={styles.filterBadgeText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          <Ionicons
            name="swap-vertical-outline"
            size={18}
            color={colors.text || "#000"}
          />
          <Text
            style={[styles.sortButtonText, { color: colors.text || "#000" }]}
          >
            {getSortLabel(currentSort)}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.statsButton,
          {
            backgroundColor: showStats
              ? colors.primary || "#007AFF"
              : colors.surface || "#F2F2F7",
            borderColor: showStats
              ? colors.primary || "#007AFF"
              : colors.border || "#E5E5E7",
          },
        ]}
        onPress={onStatsPress}
      >
        <Ionicons
          name="analytics-outline"
          size={18}
          color={showStats ? "#FFFFFF" : colors.text || "#000"}
        />
        <Text
          style={[
            styles.statsButtonText,
            { color: showStats ? "#FFFFFF" : colors.text || "#000" },
          ]}
        >
          סטטיסטיקות
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// 📊 Workout Card Component
const WorkoutCard = ({
  workout,
  index,
  onPress,
  onLongPress,
}: {
  workout: Workout;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "0 דק'";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")} ש'`;
    }
    return `${mins} דק'`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface || "#FFFFFF" }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text || "#000" }]}>
            {workout.name}
          </Text>
          <Text
            style={[styles.cardDate, { color: colors.textSecondary || "#666" }]}
          >
            {formatDate(workout.date || workout.completedAt)}
          </Text>
        </View>

        <View style={styles.cardStats}>
          <View style={styles.stat}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary || "#666"}
            />
            <Text
              style={[
                styles.statText,
                { color: colors.textSecondary || "#666" },
              ]}
            >
              {formatDuration(workout.duration)}
            </Text>
          </View>

          {workout.exercises && (
            <View style={styles.stat}>
              <Ionicons
                name="barbell-outline"
                size={16}
                color={colors.textSecondary || "#666"}
              />
              <Text
                style={[
                  styles.statText,
                  { color: colors.textSecondary || "#666" },
                ]}
              >
                {workout.exercises.length} תרגילים
              </Text>
            </View>
          )}

          {workout.rating && (
            <View style={styles.stat}>
              <Ionicons
                name="star"
                size={16}
                color={colors.primary || "#007AFF"}
              />
              <Text
                style={[
                  styles.statText,
                  { color: colors.textSecondary || "#666" },
                ]}
              >
                {workout.rating}/5
              </Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={colors.primary || "#007AFF"}
      />
    </TouchableOpacity>
  );
};

// 💀 Skeleton Loading Component
const WorkoutCardSkeleton = ({ index }: { index: number }) => (
  <View style={[styles.card, { backgroundColor: colors.surface || "#FFFFFF" }]}>
    <View style={styles.skeletonTitle} />
    <View style={styles.skeletonDate} />
    <View style={styles.skeletonStats}>
      <View style={styles.skeletonStat} />
      <View style={styles.skeletonStat} />
      <View style={styles.skeletonStat} />
    </View>
  </View>
);

// 🎯 Main Component
const WorkoutsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filters, setFilters] = useState<WorkoutHistoryFilters>({});
  const [sortBy, setSortBy] = useState<WorkoutSortBy>("date-desc");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const {
    workouts,
    isLoading,
    isError,
    refresh,
    deleteWorkout,
    isDeleting,
    stats,
  } = useWorkoutHistory({
    filters,
    sortBy,
    enableOptimisticUpdates: true,
  });

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => filters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [filters]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleWorkoutPress = useCallback((workout: Workout) => {
    console.log("Navigate to workout:", workout.id);
    // TODO: Navigate to workout details
    // navigation.navigate('WorkoutDetails', { workoutId: workout.id });
  }, []);

  const handleWorkoutLongPress = useCallback(
    (workout: Workout) => {
      Alert.alert("פעולות אימון", `בחר פעולה עבור "${workout.name}"`, [
        {
          text: "שתף",
          onPress: () => {
            Share.share({
              message: `השלמתי את האימון "${workout.name}" - ${
                workout.exercises?.length || 0
              } תרגילים!`,
              title: "Gymovo - שיתוף אימון",
            });
          },
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "מחיקת אימון",
              `האם אתה בטוח שברצונך למחוק את האימון "${workout.name}"?`,
              [
                { text: "ביטול", style: "cancel" },
                {
                  text: "מחק",
                  style: "destructive",
                  onPress: () => deleteWorkout(workout.id),
                },
              ]
            );
          },
        },
        { text: "ביטול", style: "cancel" },
      ]);
    },
    [deleteWorkout]
  );

  const handleSortPress = useCallback(() => {
    const sortOptions: WorkoutSortBy[] = [
      "date-desc",
      "date-asc",
      "rating-desc",
      "duration-desc",
      "volume-desc",
    ];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  }, [sortBy]);

  const handleApplyFilters = useCallback(
    (newFilters: WorkoutHistoryFilters) => {
      setFilters(newFilters);
    },
    []
  );

  const handleStartWorkout = useCallback(() => {
    navigation.navigate("StartWorkout");
  }, [navigation]);

  const renderItem = useCallback(
    ({ item, index }: { item: Workout; index: number }) => (
      <WorkoutCard
        workout={item}
        index={index}
        onPress={() => handleWorkoutPress(item)}
        onLongPress={() => handleWorkoutLongPress(item)}
      />
    ),
    [handleWorkoutPress, handleWorkoutLongPress]
  );

  const renderSkeleton = useCallback(
    ({ index }: { index: number }) => <WorkoutCardSkeleton index={index} />,
    []
  );

  const keyExtractor = useCallback((item: Workout) => item.id, []);

  if (isLoading && !refreshing) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background || "#F5F5F5" },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background || "#FFFFFF"}
        />

        <View
          style={[
            styles.headerContainer,
            {
              backgroundColor: colors.background || "#FFFFFF",
              borderBottomColor: colors.border || "#E5E5E7",
            },
          ]}
        >
          <Text style={[styles.header, { color: colors.text || "#000" }]}>
            היסטוריית אימונים
          </Text>
        </View>

        <FilterSortHeader
          onFilterPress={() => setShowFilterModal(true)}
          onSortPress={handleSortPress}
          onStatsPress={() => setShowStats(!showStats)}
          activeFilters={activeFiltersCount}
          currentSort={sortBy}
          showStats={showStats}
        />

        <FlatList
          data={Array(6).fill(null)}
          renderItem={renderSkeleton}
          keyExtractor={(item, index) => `skeleton-${index}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: colors.background || "#FFFFFF" },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background || "#FFFFFF"}
        />
        <Ionicons
          name="warning-outline"
          size={48}
          color={colors.error || "#FF3B30"}
        />
        <Text style={[styles.errorTitle, { color: colors.text || "#000" }]}>
          אירעה שגיאה
        </Text>
        <Text
          style={[
            styles.errorMessage,
            { color: colors.textSecondary || "#666" },
          ]}
        >
          לא הצלחנו לטעון את היסטוריית האימונים שלך.
        </Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: colors.primary || "#007AFF" },
          ]}
          onPress={handleRefresh}
        >
          <Text style={[styles.retryButtonText, { color: "#FFFFFF" }]}>
            נסה שוב
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background || "#F5F5F5" },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background || "#FFFFFF"}
      />

      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.background || "#FFFFFF",
            borderBottomColor: colors.border || "#E5E5E7",
          },
        ]}
      >
        <Text style={[styles.header, { color: colors.text || "#000" }]}>
          היסטוריית אימונים
        </Text>
        {stats && (
          <Text
            style={[
              styles.headerSubtitle,
              { color: colors.textSecondary || "#666" },
            ]}
          >
            {stats.totalWorkouts} אימונים • {stats.weeklyWorkouts} השבוע
          </Text>
        )}
      </View>

      {/* Filter/Sort Header */}
      <FilterSortHeader
        onFilterPress={() => setShowFilterModal(true)}
        onSortPress={handleSortPress}
        onStatsPress={() => setShowStats(!showStats)}
        activeFilters={activeFiltersCount}
        currentSort={sortBy}
        showStats={showStats}
      />

      {/* Workouts List */}
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary || "#007AFF"}
            colors={[colors.primary || "#007AFF"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="barbell-outline"
              size={64}
              color={colors.textSecondary || "#666"}
            />
            <Text style={[styles.emptyTitle, { color: colors.text || "#000" }]}>
              עדיין לא השלמת אימונים
            </Text>
            <Text
              style={[
                styles.emptyMessage,
                { color: colors.textSecondary || "#666" },
              ]}
            >
              התחל את האימון הראשון שלך עכשיו!
            </Text>
            <TouchableOpacity
              style={[
                styles.startWorkoutButton,
                { backgroundColor: colors.primary || "#007AFF" },
              ]}
              onPress={handleStartWorkout}
            >
              <Text
                style={[styles.startWorkoutButtonText, { color: "#FFFFFF" }]}
              >
                התחל אימון
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Loading Overlay (when deleting) */}
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <View
            style={[
              styles.loadingContent,
              { backgroundColor: colors.surface || "#FFFFFF" },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={colors.primary || "#007AFF"}
            />
            <Text
              style={[styles.loadingText, { color: colors.text || "#000" }]}
            >
              מוחק אימון...
            </Text>
          </View>
        </View>
      )}

      {/* Filter Modal */}
      <WorkoutFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "right",
  },
  // Filter Header Styles
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterLeftSection: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statsButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // List and Card Styles
  list: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    textAlign: "right",
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Skeleton Styles
  skeletonTitle: {
    height: 20,
    backgroundColor: "#E5E5E7",
    borderRadius: 4,
    marginBottom: 8,
    width: "70%",
    alignSelf: "flex-end",
  },
  skeletonDate: {
    height: 14,
    backgroundColor: "#E5E5E7",
    borderRadius: 4,
    marginBottom: 12,
    width: "40%",
    alignSelf: "flex-end",
  },
  skeletonStats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  skeletonStat: {
    height: 12,
    backgroundColor: "#E5E5E7",
    borderRadius: 4,
    width: 60,
  },
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  startWorkoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Loading Overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 120,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
});

export default WorkoutsScreen;
