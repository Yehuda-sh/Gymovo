// src/screens/workouts/WorkoutsScreen.tsx - 🎨 Professional Redesign with Modern UI

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";

// Types & Theme
import { colors } from "../../theme/colors";
import { Workout, WorkoutSortBy } from "../../types/workout";
import { RootStackParamList } from "../../types/navigation";

// Hooks & Store
import { useWorkoutStore } from "../../stores/workoutStore";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";

const { width } = Dimensions.get("window");

// Types
export interface WorkoutHistoryFilters {
  dateRange?: "week" | "month" | "3months" | "all";
  planId?: string;
  exerciseType?: string;
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
}

// 🎨 Modern Color Palette
const modernColors = {
  primary: "#007AFF",
  primaryGradient: ["#007AFF", "#0051D5"],
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  danger: "#FF3B30",
  surface: "#F2F2F7",
  cardBg: "#FFFFFF",
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  border: "#E5E5EA",
  shadow: "#000000",
};

// 📊 Stats Card Component
const StatsOverview = ({ stats }: { stats: any }) => {
  const fadeAnim = useAnimatedValue(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={modernColors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsGradient}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="fitness" size={24} color="white" />
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>אימונים</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color="white" />
            <Text style={styles.statValue}>{stats.weeklyWorkouts}</Text>
            <Text style={styles.statLabel}>השבוע</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="white" />
            <Text style={styles.statValue}>
              {Math.round(stats.totalDuration / 60)}h
            </Text>
            <Text style={styles.statLabel}>סה"כ זמן</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.statValue}>
              {stats.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>דירוג ממוצע</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// 🎛️ Filter Pills Component
const FilterPills = ({
  filters,
  onRemoveFilter,
}: {
  filters: WorkoutHistoryFilters;
  onRemoveFilter: (key: keyof WorkoutHistoryFilters) => void;
}) => {
  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case "dateRange":
        const labels = {
          week: "שבוע אחרון",
          month: "חודש אחרון",
          "3months": "3 חודשים",
          all: "הכל",
        };
        return labels[value as keyof typeof labels];
      case "minRating":
        return `דירוג ${value}+`;
      case "minDuration":
        return `מעל ${value} דקות`;
      default:
        return value;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterPillsContainer}
      contentContainerStyle={styles.filterPillsContent}
    >
      {Object.entries(filters).map(([key, value]) => (
        <MotiView
          key={key}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
        >
          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRemoveFilter(key as keyof WorkoutHistoryFilters);
            }}
          >
            <Text style={styles.filterPillText}>
              {getFilterLabel(key, value)}
            </Text>
            <Ionicons
              name="close-circle"
              size={16}
              color={modernColors.primary}
            />
          </TouchableOpacity>
        </MotiView>
      ))}
    </ScrollView>
  );
};

// 🏋️ Workout Card Component with Modern Design
const WorkoutCard = ({
  workout,
  onPress,
  onLongPress,
  index,
}: {
  workout: Workout;
  onPress: () => void;
  onLongPress: () => void;
  index: number;
}) => {
  const scaleAnim = useAnimatedValue(1);
  const rotateAnim = useAnimatedValue(0);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: -2,
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
      Animated.spring(rotateAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}`
      : `${mins} דק'`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString("he-IL");
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
    >
      <Animated.View
        style={[
          {
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [-2, 0],
                  outputRange: ["-2deg", "0deg"],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onLongPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.workoutCard}
        >
          {/* Progress Indicator */}
          <View style={styles.progressIndicator}>
            <LinearGradient
              colors={[modernColors.success, "#00C851"]}
              style={[
                styles.progressBar,
                {
                  width: `${
                    (workout.completedExercises / workout.totalExercises) * 100
                  }%`,
                },
              ]}
            />
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleSection}>
                <Text style={styles.workoutTitle}>{workout.name}</Text>
                <Text style={styles.workoutDate}>
                  {formatDate(workout.date)}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={modernColors.warning} />
                <Text style={styles.ratingText}>{workout.rating || "—"}</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={modernColors.primary}
                />
                <Text style={styles.statChipText}>
                  {formatDuration(workout.duration)}
                </Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons
                  name="barbell-outline"
                  size={16}
                  color={modernColors.primary}
                />
                <Text style={styles.statChipText}>
                  {workout.totalVolume ? `${workout.totalVolume} ק"ג` : "—"}
                </Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons
                  name="flash-outline"
                  size={16}
                  color={modernColors.primary}
                />
                <Text style={styles.statChipText}>
                  {workout.completedExercises}/{workout.totalExercises}
                </Text>
              </View>
            </View>

            {/* Notes Preview */}
            {workout.notes && (
              <Text style={styles.notesPreview} numberOfLines={1}>
                💭 {workout.notes}
              </Text>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={modernColors.textSecondary}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </Animated.View>
    </MotiView>
  );
};

// 🏋️ Empty State Component
const EmptyState = ({ onStartWorkout }: { onStartWorkout: () => void }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring" }}
    style={styles.emptyContainer}
  >
    <View style={styles.emptyIconContainer}>
      <Ionicons name="barbell" size={80} color={modernColors.textSecondary} />
    </View>
    <Text style={styles.emptyTitle}>עדיין אין אימונים</Text>
    <Text style={styles.emptyMessage}>
      התחל את המסע שלך ותתעד את האימון הראשון!
    </Text>
    <TouchableOpacity
      style={styles.startWorkoutButton}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onStartWorkout();
      }}
    >
      <LinearGradient
        colors={modernColors.primaryGradient}
        style={styles.gradientButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.startWorkoutButtonText}>התחל אימון חדש</Text>
      </LinearGradient>
    </TouchableOpacity>
  </MotiView>
);

// 🔧 Filter Modal Component
const WorkoutFilterModal = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
}: {
  visible: boolean;
  onClose: () => void;
  filters: WorkoutHistoryFilters;
  onApplyFilters: (filters: WorkoutHistoryFilters) => void;
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <BlurView intensity={100} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={modernColors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>סינון אימונים</Text>
            <TouchableOpacity
              onPress={() => {
                setTempFilters({});
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }}
            >
              <Text style={styles.clearFiltersText}>נקה הכל</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Date Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>תקופת זמן</Text>
              <View style={styles.filterOptions}>
                {["week", "month", "3months", "all"].map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterOption,
                      tempFilters.dateRange === range &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setTempFilters({
                        ...tempFilters,
                        dateRange: range as any,
                      });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.dateRange === range &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {range === "week" && "שבוע"}
                      {range === "month" && "חודש"}
                      {range === "3months" && "3 חודשים"}
                      {range === "all" && "הכל"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>דירוג מינימלי</Text>
              <View style={styles.filterOptions}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.filterOption,
                      tempFilters.minRating === rating &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setTempFilters({ ...tempFilters, minRating: rating });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={styles.ratingOption}>
                      <Ionicons
                        name="star"
                        size={16}
                        color={modernColors.warning}
                      />
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.minRating === rating &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {rating}+
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>משך אימון מינימלי</Text>
              <View style={styles.filterOptions}>
                {[15, 30, 45, 60].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.filterOption,
                      tempFilters.minDuration === duration &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setTempFilters({ ...tempFilters, minDuration: duration });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.minDuration === duration &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {duration} דק'
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onApplyFilters(tempFilters);
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                onClose();
              }}
            >
              <LinearGradient
                colors={modernColors.primaryGradient}
                style={styles.gradientButton}
              >
                <Text style={styles.applyButtonText}>החל סינון</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

// 🎯 Main Component
const WorkoutsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const workoutStore = useWorkoutStore();

  const [filters, setFilters] = useState<WorkoutHistoryFilters>({});
  const [sortBy, setSortBy] = useState<WorkoutSortBy>("date-desc");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Get workouts from store
  const workouts = workoutStore.workouts || [];
  const isLoading = false; // You can add loading state to store
  const isError = false; // You can add error state to store

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyWorkouts = workouts.filter((w) => w.date >= weekAgo).length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
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

  // Filter workouts
  const filteredWorkouts = useMemo(() => {
    let filtered = [...workouts];

    // Apply filters
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
        filtered = filtered.filter((w) => w.date >= startDate);
      }
    }

    if (filters.minRating) {
      filtered = filtered.filter((w) => (w.rating || 0) >= filters.minRating!);
    }

    if (filters.minDuration) {
      filtered = filtered.filter((w) => w.duration >= filters.minDuration!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.date.getTime() - a.date.getTime();
        case "date-asc":
          return a.date.getTime() - b.date.getTime();
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "duration-desc":
          return b.duration - a.duration;
        case "duration-asc":
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workouts, filters, sortBy]);

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => filters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [filters]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Add refresh logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleWorkoutPress = useCallback(
    (workout: Workout) => {
      navigation.navigate("WorkoutSummary", { workoutId: workout.id });
    },
    [navigation]
  );

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

  const handleStartWorkout = useCallback(() => {
    navigation.navigate("StartWorkout");
  }, [navigation]);

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

      {/* Header */}
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

      {/* Stats Overview */}
      {showStats && <StatsOverview stats={stats} />}

      {/* Filter/Sort Bar */}
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

      {/* Active Filters */}
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

      {/* Workouts List */}
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

      {/* FAB - Floating Action Button */}
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
            colors={modernColors.primaryGradient}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <WorkoutFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modernColors.surface,
  },
  // Header
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

  // Stats Overview
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  statsGradient: {
    borderRadius: 16,
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  // Filter Bar
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

  // Filter Pills
  filterPillsContainer: {
    backgroundColor: "white",
    maxHeight: 60,
  },
  filterPillsContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: modernColors.surface,
    gap: 6,
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: modernColors.primary,
  },

  // List
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

  // Workout Card
  workoutCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  progressIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: modernColors.border,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  cardContent: {
    paddingTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: modernColors.textSecondary,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: modernColors.surface,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: modernColors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: modernColors.surface,
    gap: 6,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: modernColors.text,
  },
  notesPreview: {
    fontSize: 12,
    color: modernColors.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
  },
  chevron: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: modernColors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: modernColors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: modernColors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  startWorkoutButton: {
    overflow: "hidden",
    borderRadius: 24,
  },
  gradientButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  // Error State
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: modernColors.primary,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
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

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: modernColors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: modernColors.text,
  },
  clearFiltersText: {
    fontSize: 14,
    color: modernColors.danger,
    fontWeight: "600",
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: modernColors.surface,
    borderWidth: 1,
    borderColor: modernColors.border,
  },
  filterOptionActive: {
    backgroundColor: modernColors.primary,
    borderColor: modernColors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: modernColors.text,
  },
  filterOptionTextActive: {
    color: "white",
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: modernColors.border,
  },
  applyButton: {
    overflow: "hidden",
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});

export default WorkoutsScreen;
