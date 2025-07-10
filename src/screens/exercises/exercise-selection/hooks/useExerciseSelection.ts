// src/screens/exercises/exercise-selection/hooks/useExerciseSelection.ts
// לוגיקה מרכזית למסך בחירת תרגילים

import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { Alert, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

// Types & Utils
import { RootStackParamList } from "../../../../types/navigation";
import { Exercise } from "../../../../types/exercise";
import { useWorkoutStore } from "../../../../stores/workoutStore";
import { useExercises } from "../../../../hooks/useExercises";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UseExerciseSelectionReturn {
  // Data
  exercises: Exercise[] | undefined;
  isLoading: boolean;
  isError: boolean;
  filteredExercises: Exercise[];

  // State
  selectedExercises: Exercise[];
  selectedCategory: string;
  searchQuery: string;

  // Animations
  fadeAnim: Animated.Value;
  searchAnim: Animated.Value;

  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleExercise: (exercise: Exercise) => void;
  clearSelection: () => void;
  handleStartWorkout: () => void;

  // Render functions
  renderExercise: ({
    item,
    index,
  }: {
    item: Exercise;
    index: number;
  }) => React.ReactElement;
}

export const useExerciseSelection = (): UseExerciseSelectionReturn => {
  const navigation = useNavigation<NavigationProp>();
  const { startCustomWorkout } = useWorkoutStore();
  const { data: exercises, isLoading, isError } = useExercises();

  // State
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(searchAnim, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // סינון תרגילים
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    let filtered = exercises;

    // סינון לפי קטגוריה
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (exercise) =>
          exercise.category?.includes(selectedCategory) ||
          exercise.targetMuscleGroups?.includes(selectedCategory)
      );
    }

    // סינון לפי חיפוש
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query) ||
          exercise.description?.toLowerCase().includes(query) ||
          exercise.category?.toLowerCase().includes(query) ||
          exercise.targetMuscleGroups?.some((muscle) =>
            muscle.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [exercises, selectedCategory, searchQuery]);

  // בחירת/ביטול תרגיל
  const toggleExercise = useCallback((exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.id === exercise.id);

      if (isSelected) {
        return prev.filter((e) => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // ניקוי כל הבחירות
  const clearSelection = useCallback(() => {
    setSelectedExercises([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // התחלת אימון
  const handleStartWorkout = useCallback(() => {
    if (selectedExercises.length === 0) {
      Alert.alert("שים לב", "יש לבחור לפחות תרגיל אחד");
      return;
    }

    const workoutExercises = selectedExercises.map((exercise) => ({
      exerciseId: exercise.id,
      sets: [],
    }));

    startCustomWorkout({
      name: "אימון מותאם אישית",
      exercises: workoutExercises,
    } as any);

    navigation.navigate("ActiveWorkout");
  }, [selectedExercises, startCustomWorkout, navigation]);

  // פונקציית רינדור לתרגיל בודד
  const renderExercise = useCallback(
    ({ item, index }: { item: Exercise; index: number }) => {
      // יובא מבחוץ - לא ניתן לייבא כאן בגלל circular dependency
      return null as any; // ימולא במסך הראשי
    },
    []
  );

  return {
    // Data
    exercises,
    isLoading,
    isError,
    filteredExercises,

    // State
    selectedExercises,
    selectedCategory,
    searchQuery,

    // Animations
    fadeAnim,
    searchAnim,

    // Actions
    setSelectedCategory,
    setSearchQuery,
    toggleExercise,
    clearSelection,
    handleStartWorkout,

    // Render functions
    renderExercise,
  };
};
