// src/screens/workouts/WorkoutsScreen.tsx - 🚀 Enhanced Professional Version

import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  RefreshControl,
  StatusBar,
  Platform,
  Alert,
  Share,
} from "react-native";
import { useWorkoutHistory, WorkoutHistoryFilters, WorkoutSortBy } from "../../hooks/useWorkoutHistory";
import { WorkoutCard, WorkoutCardSkeleton } from "../../components/cards/WorkoutCard";
import WorkoutFilterModal from "../../components/modals/WorkoutFilterModal";
import WorkoutStatsDashboard from "../../components/stats/WorkoutStatsDashboard";
import { getCurrentColors } from "../../theme/colors";
import { Workout } from "../../types/workout";

const { width } = Dimensions.get("window");

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
  const colors = getCurrentColors();
  
  const getSortLabel = (sort: WorkoutSortBy) => {
    switch (sort) {
      case 'date-desc': return 'חדש ביותר';
      case 'date-asc': return 'ישן ביותר';
      case 'rating-desc': return 'דירוג גבוה';
      case 'rating-asc': return 'דירוג נמוך';
      case 'duration-desc': return 'אימון ארוך';
      case 'duration-asc': return 'אימון קצר';
      case 'volume-desc': return 'נפח גבוה';
      case 'volume-asc': return 'נפח נמוך';
      default: return 'מיון';
    }
  };

  return (
    <View style={[styles.filterHeader, { backgroundColor: colors.background.primary, borderBottomColor: colors.border.light }]}>
      <View style={styles.filterLeftSection}>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={18} color={colors.text.primary} />
          <Text style={[styles.filterButtonText, { color: colors.text.primary }]}>סינון</Text>
          {activeFilters > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.filterBadgeText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          <Ionicons name="swap-vertical-outline" size={18} color={colors.text.primary} />
          <Text style={[styles.sortButtonText, { color: colors.text.primary }]}>{getSortLabel(currentSort)}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[
          styles.statsButton,
          {
            backgroundColor: showStats ? colors.primary : colors.background.tertiary,
            borderColor: showStats ? colors.primary : colors.border.light,
          }
        ]} 
        onPress={onStatsPress}
      >
        <Ionicons 
          name="analytics-outline" 
          size={18} 
          color={showStats ? colors.text.inverse : colors.text.primary} 
        />
        <Text style={[
          styles.statsButtonText,
          { color: showStats ? colors.text.inverse : colors.text.primary }
        ]}>
          סטטיסטיקות
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// 🎯 Main Component
const WorkoutsScreen = () => {
  const colors = getCurrentColors();
  const [filters, setFilters] = useState<WorkoutHistoryFilters>({});
  const [sortBy, setSortBy] = useState<WorkoutSortBy>('date-desc');
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
    stats 
  } = useWorkoutHistory({
    filters,
    sortBy,
    enableOptimisticUpdates: true,
  });

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(key => 
      filters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [filters]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleWorkoutPress = useCallback((workout: Workout) => {
    // Navigate to workout details
    console.log('Navigate to workout:', workout.id);
  }, []);

  const handleWorkoutLongPress = useCallback((workout: Workout) => {
    Alert.alert(
      'פעולות אימון',
      `בחר פעולה עבור "${workout.name}"`,
      [
        {
          text: 'שתף',
          onPress: () => {
            Share.share({
              message: `השלמתי את האימון "${workout.name}" - ${workout.exercises.length} תרגילים!`,
              title: 'Gymovo - שיתוף אימון',
            });
          },
        },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'מחיקת אימון',
              `האם אתה בטוח שברצונך למחוק את האימון "${workout.name}"?`,
              [
                { text: 'ביטול', style: 'cancel' },
                {
                  text: 'מחק',
                  style: 'destructive',
                  onPress: () => deleteWorkout(workout.id),
                },
              ]
            );
          },
        },
        { text: 'ביטול', style: 'cancel' },
      ]
    );
  }, [deleteWorkout]);

  const handleApplyFilters = useCallback((newFilters: WorkoutHistoryFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  }, []);

  const handleSortPress = useCallback(() => {
    const sortOptions: WorkoutSortBy[] = [
      'date-desc', 'date-asc', 'rating-desc', 'duration-desc', 'volume-desc'
    ];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  }, [sortBy]);

  const renderItem = useCallback(({ item, index }: { item: Workout; index: number }) => (
    <WorkoutCard
      workout={item}
      index={index}
      onPress={() => handleWorkoutPress(item)}
      onLongPress={() => handleWorkoutLongPress(item)}
    />
  ), [handleWorkoutPress, handleWorkoutLongPress]);

  const renderSkeleton = useCallback(({ index }: { index: number }) => (
    <WorkoutCardSkeleton index={index} />
  ), []);

  const keyExtractor = useCallback((item: Workout) => item.id, []);

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        
        {/* Header */}
        <View style={[styles.headerContainer, { backgroundColor: colors.background.primary, borderBottomColor: colors.border.light }]}>
          <Text style={[styles.header, { color: colors.text.primary }]}>היסטוריית אימונים</Text>
        </View>

        {/* Filter Header */}
        <FilterSortHeader
          onFilterPress={() => setShowFilterModal(true)}
          onSortPress={handleSortPress}
          onStatsPress={() => setShowStats(!showStats)}
          activeFilters={activeFiltersCount}
          currentSort={sortBy}
          showStats={showStats}
        />

        {/* Loading Skeletons */}
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
      <View style={[styles.errorContainer, { backgroundColor: colors.background.primary }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <Ionicons name="warning-outline" size={48} color={colors.error} />
        <Text style={[styles.errorTitle, { color: colors.text.primary }]}>אירעה שגיאה</Text>
        <Text style={[styles.errorMessage, { color: colors.text.secondary }]}>
          לא הצלחנו לטעון את היסטוריית האימונים שלך.
        </Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={handleRefresh}>
          <Text style={[styles.retryButtonText, { color: colors.text.inverse }]}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.background.primary, borderBottomColor: colors.border.light }]}>
        <Text style={[styles.header, { color: colors.text.primary }]}>היסטוריית אימונים</Text>
        {stats && (
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
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

      {/* Stats Dashboard */}
      {showStats && stats && (
        <WorkoutStatsDashboard 
          stats={stats} 
          workouts={workouts}
        />
      )}

      {/* Workouts List */}
      {!showStats && (
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
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="barbell-outline" size={64} color={colors.text.tertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>עדיין לא השלמת אימונים</Text>
              <Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
                האימונים שתסיים יופיעו כאן ותוכל לעקוב אחר ההתקדמות שלך
              </Text>
              <TouchableOpacity style={[styles.startWorkoutButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.startWorkoutButtonText, { color: colors.text.inverse }]}>התחל אימון ראשון</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <WorkoutFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Loading Overlay */}
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingContent, { backgroundColor: colors.background.modal }]}>
            <View style={[styles.loadingSpinner, { borderColor: colors.primary }]} />
            <Text style={[styles.loadingText, { color: colors.text.primary }]}>מוחק אימון...</Text>
          </View>
        </View>
      )}
    </View>
  );
};ל אימון ראשון</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Loading Overlay */}
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={enhancedColors.primary} />
          <Text style={styles.loadingText}>מוחק...</Text>
        </View>
      )}
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: enhancedColors.background.secondary,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: enhancedColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: enhancedColors.border.light,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: enhancedColors.text.primary,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: enhancedColors.text.secondary,
    textAlign: 'right',
    marginTop: 4,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: enhancedColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: enhancedColors.border.light,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: enhancedColors.background.tertiary,
    borderRadius: 8,
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: enhancedColors.text.primary,
  },
  filterBadge: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: enhancedColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: enhancedColors.text.primary,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: enhancedColors.background.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: enhancedColors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: enhancedColors.border.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: enhancedColors.text.primary,
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  timeAgo: {
    fontSize: 12,
    color: enhancedColors.text.tertiary,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 14,
    color: enhancedColors.text.secondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: enhancedColors.text.secondary,
    marginLeft: 4,
  },
  notesPreview: {
    fontSize: 13,
    color: enhancedColors.text.secondary,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 18,
    textAlign: 'right',
  },
  musclesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  muscleTag: {
    backgroundColor: enhancedColors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    marginBottom: 4,
  },
  muscleText: {
    fontSize: 10,
    color: enhancedColors.text.secondary,
    fontWeight: '500',
  },
  moreMuscles: {
    fontSize: 10,
    color: enhancedColors.text.tertiary,
    marginLeft: 6,
  },
  cardArrow: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -10,
  },
  // Skeleton Styles
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: enhancedColors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: enhancedColors.border.light,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: enhancedColors.border.medium,
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
    alignSelf: 'flex-end',
  },
  skeletonDate: {
    height: 14,
    backgroundColor: enhancedColors.border.medium,
    borderRadius: 4,
    marginBottom: 12,
    width: '40%',
    alignSelf: 'flex-end',
  },
  skeletonStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skeletonStat: {
    height: 12,
    backgroundColor: enhancedColors.border.medium,
    borderRadius: 4,
    width: 60,
    marginLeft: 12,
  },
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: enhancedColors.background.primary,
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: enhancedColors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: enhancedColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: enhancedColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: enhancedColors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: enhancedColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startWorkoutButton: {
    backgroundColor: enhancedColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: enhancedColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 4,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  statsButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
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
    fontWeight: '600',
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startWorkoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    borderWidth: 3,
    borderRadius: 12,
    borderTopColor: 'transparent',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WorkoutsScreen;