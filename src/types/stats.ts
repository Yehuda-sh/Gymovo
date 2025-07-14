// ============================================
// types/stats.ts - Complete and Updated
// ============================================

// Time Period Types
export type TimePeriod = "week" | "month" | "quarter" | "year" | "all-time";
export type ComparisonPeriod = "previous" | "same-last-year";

// Basic Stats
export interface BasicStats {
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalVolume: number; // kg
  totalCalories: number;
  activeDays: number;
  averageWorkoutDuration: number;
  averageVolume: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}

// Muscle Group Stats
export interface MuscleGroupStats {
  muscleGroup: string;
  workoutCount: number;
  totalVolume: number;
  totalSets: number;
  lastWorked: Date;
  frequency: number; // workouts per week
  volumeTrend: number; // percentage change
  recoveryStatus: "ready" | "recovering" | "needs-rest";
  recommendedRestDays: number;
}

// Exercise Stats
export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  category: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  averageWeight: number;
  maxWeight: number;
  maxReps: number;
  lastPerformed: Date;
  frequency: number; // times per month
  personalRecords: {
    oneRepMax?: number;
    maxVolume?: number;
    maxReps?: number;
    bestSet?: {
      weight: number;
      reps: number;
      date: Date;
    };
  };
  progressRate: number; // percentage improvement
  estimatedOneRepMax: number;
}

// Progress Stats
export interface ProgressStats {
  period: TimePeriod;
  startDate: Date;
  endDate: Date;
  metrics: {
    workoutCount: {
      current: number;
      previous: number;
      change: number;
      changePercent: number;
    };
    totalVolume: {
      current: number;
      previous: number;
      change: number;
      changePercent: number;
    };
    averageIntensity: {
      current: number;
      previous: number;
      change: number;
      changePercent: number;
    };
    consistency: {
      current: number; // percentage
      previous: number;
      change: number;
    };
  };
  strengthGains: Array<{
    exerciseId: string;
    exerciseName: string;
    startWeight: number;
    currentWeight: number;
    improvement: number;
    improvementPercent: number;
  }>;
  milestones: Milestone[];
}

// Milestone
export interface Milestone {
  id: string;
  type: "weight" | "reps" | "volume" | "streak" | "total-workouts" | "custom";
  title: string;
  description: string;
  achievedAt: Date;
  value: number;
  unit?: string;
  icon?: string;
  shareWorthy: boolean;
}

// Streak Stats
export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  longestStreakStart: Date;
  longestStreakEnd: Date;
  totalActiveDays: number;
  currentMonth: {
    activeDays: number;
    targetDays: number;
    percentage: number;
  };
  weeklyConsistency: Array<{
    week: string; // ISO week
    workouts: number;
    target: number;
    achieved: boolean;
  }>;
  predictions: {
    nextMilestone: number; // days
    projectedMonthlyWorkouts: number;
  };
}

// Body Metrics Stats
export interface BodyMetricsStats {
  weight: Array<{
    date: Date;
    value: number;
    unit: "kg" | "lbs";
  }>;
  bodyFat?: Array<{
    date: Date;
    value: number; // percentage
  }>;
  measurements?: {
    [key: string]: Array<{
      // chest, arms, waist, etc.
      date: Date;
      value: number;
      unit: "cm" | "inches";
    }>;
  };
  trends: {
    weight: "gaining" | "losing" | "maintaining";
    bodyFat?: "gaining" | "losing" | "maintaining";
    muscle?: "gaining" | "losing" | "maintaining";
  };
  goals: {
    targetWeight?: number;
    targetBodyFat?: number;
    targetDate?: Date;
    progressPercent: number;
  };
}

// Workout Distribution Stats
export interface WorkoutDistributionStats {
  byDayOfWeek: Array<{
    day: number; // 0-6
    count: number;
    percentage: number;
  }>;
  byTimeOfDay: Array<{
    hour: number; // 0-23
    count: number;
    percentage: number;
  }>;
  byDuration: Array<{
    range: string; // "0-30", "30-60", "60-90", "90+"
    count: number;
    percentage: number;
  }>;
  byLocation: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  byMood: Array<{
    mood: string;
    count: number;
    percentage: number;
    averagePerformance: number;
  }>;
}

// Performance Metrics
export interface PerformanceMetrics {
  volumeLoad: number; // total volume * intensity factor
  intensityScore: number; // 0-100
  fatigueLvel: number; // 0-10
  readinessScore: number; // 0-100
  estimatedRecoveryTime: number; // hours
  performanceIndex: number; // composite score
  recommendations: string[];
}

// Comparison Stats
export interface ComparisonStats {
  period: TimePeriod;
  comparisonType: ComparisonPeriod;
  current: {
    workouts: number;
    volume: number;
    duration: number;
    exercises: number;
  };
  previous: {
    workouts: number;
    volume: number;
    duration: number;
    exercises: number;
  };
  percentageChanges: {
    workouts: number;
    volume: number;
    duration: number;
    exercises: number;
  };
  insights: string[];
}

// Achievement Stats
export interface AchievementStats {
  totalAchievements: number;
  recentAchievements: Achievement[];
  categories: {
    strength: number;
    consistency: number;
    volume: number;
    endurance: number;
    variety: number;
  };
  nextAchievements: Array<{
    achievement: Achievement;
    progress: number; // 0-100
    estimatedDate?: Date;
  }>;
  rareAchievements: Achievement[];
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category:
    | "strength"
    | "consistency"
    | "volume"
    | "endurance"
    | "variety"
    | "special";
  icon: string;
  unlockedAt?: Date;
  requirement: {
    type: string;
    value: number;
    current?: number;
  };
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  points: number;
}

// Goal Tracking
export interface Goal {
  id: string;
  type: "weight" | "reps" | "volume" | "frequency" | "body-metric" | "custom";
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  status: "active" | "completed" | "failed" | "paused";
  milestones: Array<{
    value: number;
    reachedAt?: Date;
  }>;
  progressHistory: Array<{
    date: Date;
    value: number;
  }>;
}

// Leaderboard Stats (if social features)
export interface LeaderboardStats {
  userRank: number;
  totalUsers: number;
  percentile: number;
  rankings: {
    volume: number;
    workouts: number;
    streak: number;
    achievements: number;
  };
  nearbyUsers: Array<{
    userId: string;
    username: string;
    avatar?: string;
    score: number;
    difference: number;
  }>;
}

// Muscle Group Frequency (for recovery tracking)
export interface MuscleGroupFrequency {
  muscleGroup: string;
  count: number;
  lastWorked: Date;
  recoveryStatus: "ready" | "recovering" | "needs-rest";
  recommendedNextWorkout: Date;
  optimalFrequency: number; // workouts per week
  currentFrequency: number;
  volumeLastWeek: number;
  intensityScore: number; // 0-100
}

// Export all stats in one interface for easy access
export interface AllStats {
  basic: BasicStats;
  progress: ProgressStats;
  muscleGroups: MuscleGroupStats[];
  exercises: ExerciseStats[];
  streaks: StreakStats;
  bodyMetrics?: BodyMetricsStats;
  distribution: WorkoutDistributionStats;
  performance: PerformanceMetrics;
  achievements: AchievementStats;
  goals: Goal[];
  comparison?: ComparisonStats;
  leaderboard?: LeaderboardStats;
}
