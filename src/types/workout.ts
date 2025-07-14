// ============================================
// types/workout.ts - Complete and Updated
// ============================================

import { Exercise } from "./exercise";

// Basic Set Types
export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  status: "pending" | "completed" | "skipped";
  actualReps?: number;
  actualWeight?: number;
  notes?: string;
  restTime?: number; // in seconds
  tempo?: string; // e.g., "2-0-2-0"
  difficulty?: "easy" | "medium" | "hard";
  completedAt?: Date;
}

// Exercise within a workout
export interface WorkoutExercise {
  id: string;
  name: string;
  exercise: {
    id: string;
    name: string;
    category: string;
    primaryMuscle?: string;
    secondaryMuscles?: string[];
    equipment?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
  };
  sets: WorkoutSet[];
  notes?: string;
  order?: number;
  supersetWith?: string; // ID of another exercise in superset
  restBetweenSets?: number; // in seconds
  targetRPE?: number; // Rate of Perceived Exertion (1-10)
  actualRPE?: number;
}

// Main Workout Interface
export interface Workout {
  id: string;
  planId: string;
  planName: string;
  dayId: string;
  dayName: string;
  exercises: WorkoutExercise[];
  date: string; // ISO date string
  startTime: string; // ISO datetime string
  endTime?: string; // ISO datetime string
  duration: number; // in minutes
  status: "active" | "completed" | "cancelled" | "paused";
  notes?: string;
  mood?: "great" | "good" | "okay" | "tired" | "bad";
  energyLevel?: number; // 1-10
  location?: "gym" | "home" | "outdoor" | "other";
  totalVolume?: number; // total weight lifted
  totalSets?: number;
  totalReps?: number;
  caloriesBurned?: number;
  personalRecords?: PersonalRecord[];
  photos?: WorkoutPhoto[];
  isQuickWorkout?: boolean;
  completedAt?: string; // ISO datetime string
  rating?: number; // 1-5 כוכבים
}

// Personal Record
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: "1RM" | "volume" | "reps" | "time" | "distance";
  value: number;
  previousValue?: number;
  unit?: string;
  achievedAt: Date;
}

// Workout Photo
export interface WorkoutPhoto {
  id: string;
  uri: string;
  thumbnail?: string;
  caption?: string;
  uploadedAt: Date;
  type: "progress" | "form-check" | "achievement";
}

// Workout Summary for Lists
export interface WorkoutSummary {
  id: string;
  planName: string;
  dayName: string;
  date: Date;
  duration: number;
  exerciseCount: number;
  totalVolume: number;
  status: Workout["status"];
  mood?: Workout["mood"];
  hasPersonalRecords: boolean;
  muscleGroups: string[];
}

// Workout Template (for quick starts)
export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, "id">[];
  estimatedDuration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  targetMuscleGroups: string[];
  equipment: string[];
  createdBy: "system" | "user";
  popularity?: number;
  lastUsed?: Date;
}

// Active Workout State
export interface ActiveWorkoutState {
  workout: Workout | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  restTimer: {
    isActive: boolean;
    timeRemaining: number;
    totalTime: number;
  };
  isPaused: boolean;
  autoRestTimer: boolean;
  soundEnabled: boolean;
}

// Workout Filters
export interface WorkoutFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  planIds?: string[];
  muscleGroups?: string[];
  minDuration?: number;
  maxDuration?: number;
  hasPersonalRecords?: boolean;
  mood?: Workout["mood"][];
  location?: Workout["location"][];
  searchTerm?: string;
}

// Workout Analytics
export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  averageWorkoutsPerWeek: number;
  favoriteExercises: Array<{
    exerciseId: string;
    name: string;
    count: number;
  }>;
  muscleGroupDistribution: Array<{
    muscleGroup: string;
    percentage: number;
    count: number;
  }>;
  progressTrend: "improving" | "maintaining" | "declining";
  consistency: {
    currentStreak: number;
    longestStreak: number;
    missedLastWeek: number;
  };
}

// Workout Suggestion
export interface WorkoutSuggestion {
  planId: string;
  planName: string;
  dayId: string;
  dayName: string;
  reason: string;
  confidence: number; // 0-1
  muscleGroups: string[];
  estimatedDuration: number;
  lastPerformed?: Date;
  recoveryStatus: {
    [muscleGroup: string]: "ready" | "recovering" | "needs-rest";
  };
  alternativeSuggestions?: Array<{
    planId: string;
    dayId: string;
    reason: string;
  }>;
}

// Exercise Performance History
export interface ExerciseHistory {
  exerciseId: string;
  exerciseName: string;
  performances: Array<{
    date: Date;
    sets: Array<{
      weight: number;
      reps: number;
    }>;
    totalVolume: number;
    maxWeight: number;
    totalReps: number;
    notes?: string;
  }>;
  personalBest: {
    weight: number;
    reps: number;
    volume: number;
    date: Date;
  };
  trend: "improving" | "plateau" | "declining";
}
