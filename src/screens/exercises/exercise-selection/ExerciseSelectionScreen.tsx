// src/screens/exercises/exercise-selection/ExerciseSelectionScreenRedesigned.tsx
// מסך בחירת תרגילים מעוצב מחדש עם מערכת AuthTheme

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Import theme
import authTheme from "../../../theme/authTheme";
import { RootStackParamList } from "../../../types/navigation";
import { Exercise } from "../../../types/exercise";
import { useExercises } from "../../../hooks/useExercises";
import { useWorkoutStore } from "../../../stores/workoutStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// קטגוריות שרירים מעודכנות עם צבעים וגרדיאנטים
const muscleCategories = [
  {
    id: "all",
    name: "הכל",
    icon: "body-outline",
    gradient: authTheme.colors.gradients.primary,
  },
  {
    id: "chest",
    name: "חזה",
    icon: "fitness-outline",
    gradient: ["#FF6B6B", "#FF5252"],
  },
  {
    id: "back",
    name: "גב",
    icon: "trending-up-outline",
    gradient: ["#4ECDC4", "#44A08D"],
  },
  {
    id: "legs",
    name: "רגליים",
    icon: "walk-outline",
    gradient: ["#45B7D1", "#2196F3"],
  },
  {
    id: "shoulders",
    name: "כתפיים",
    icon: "hand-left-outline",
    gradient: ["#FFA726", "#FB8C00"],
  },
  {
    id: "arms",
    name: "זרועות",
    icon: "barbell-outline",
    gradient: ["#66BB6A", "#43A047"],
  },
  {
    id: "core",
    name: "ליבה",
    icon: "shield-outline",
    gradient: ["#FFCA28", "#FFB300"],
  },
];

// רכיב קטגוריה בודד
const CategoryChip: React.FC<{
  category: (typeof muscleCategories)[0];
  isSelected: boolean;
  onPress: () => void;
  index: number;
}> = ({ category, isSelected, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [index, scaleAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginRight: 12,
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
      >
        {isSelected ? (
          <LinearGradient
            colors={category.gradient as [string, string]}
            style={styles.categoryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={category.icon as any} size={20} color="white" />
            <Text style={styles.categoryTextSelected}>{category.name}</Text>
          </LinearGradient>
        ) : (
          <>
            <Ionicons
              name={category.icon as any}
              size={20}
              color={authTheme.colors.textMuted}
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// רכיב תרגיל בודד
const ExerciseCard: React.FC<{
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}> = ({ exercise, isSelected, onToggle, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 80,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, slideAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  };

  const getDifficultyColor = () => {
    switch (exercise.difficulty) {
      case "beginner":
        return authTheme.colors.success;
      case "intermediate":
        return authTheme.colors.warning;
      case "advanced":
        return authTheme.colors.error;
      default:
        return authTheme.colors.primary;
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginHorizontal: 20,
        marginBottom: 12,
      }}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <BlurView
          intensity={80}
          tint="dark"
          style={[
            styles.exerciseCard,
            isSelected && styles.exerciseCardSelected,
          ]}
        >
          <View style={styles.exerciseContent}>
            {/* אייקון ומידע */}
            <View style={styles.exerciseInfo}>
              <View style={styles.exerciseIcon}>
                <Ionicons
                  name="barbell-outline"
                  size={24}
                  color={
                    isSelected
                      ? authTheme.colors.primary
                      : authTheme.colors.textMuted
                  }
                />
              </View>

              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>

                {/* תגיות */}
                <View style={styles.exerciseTags}>
                  {/* שריר ראשי */}
                  {exercise.targetMuscleGroups?.[0] && (
                    <View
                      style={[
                        styles.tag,
                        { backgroundColor: authTheme.colors.primary + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          { color: authTheme.colors.primary },
                        ]}
                      >
                        {exercise.targetMuscleGroups[0]}
                      </Text>
                    </View>
                  )}

                  {/* רמת קושי */}
                  {exercise.difficulty && (
                    <View
                      style={[
                        styles.tag,
                        { backgroundColor: getDifficultyColor() + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          { color: getDifficultyColor() },
                        ]}
                      >
                        {exercise.difficulty === "beginner"
                          ? "מתחיל"
                          : exercise.difficulty === "intermediate"
                          ? "בינוני"
                          : "מתקדם"}
                      </Text>
                    </View>
                  )}
                </View>

                {/* תיאור */}
                {exercise.description && (
                  <Text style={styles.exerciseDescription} numberOfLines={2}>
                    {exercise.description}
                  </Text>
                )}
              </View>
            </View>

            {/* אינדיקטור בחירה */}
            <View style={styles.selectionIndicator}>
              {isSelected ? (
                <LinearGradient
                  colors={authTheme.colors.gradients.primary}
                  style={styles.selectedCircle}
                >
                  <Ionicons name="checkmark" size={18} color="white" />
                </LinearGradient>
              ) : (
                <View style={styles.unselectedCircle} />
              )}
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

// המסך הראשי
const ExerciseSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { exercises, isLoading } = useExercises();
  const { startCustomWorkout } = useWorkoutStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-50)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: authTheme.animations.durations.slow,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        ...authTheme.animations.easing.bounce,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        delay: 300,
        ...authTheme.animations.easing.smooth,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, headerSlide, buttonScale]);

  // סינון תרגילים
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    let filtered = exercises;

    // סינון לפי קטגוריה
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (exercise: Exercise) =>
          exercise.category?.toLowerCase() === selectedCategory ||
          exercise.targetMuscleGroups?.some((muscle: string) =>
            muscle.toLowerCase().includes(selectedCategory)
          )
      );
    }

    // סינון לפי חיפוש
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exercise: Exercise) =>
          exercise.name.toLowerCase().includes(query) ||
          exercise.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [exercises, selectedCategory, searchQuery]);

  // בחירת/ביטול תרגיל
  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.id === exercise.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  // התחלת אימון
  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      Alert.alert("שים לב", "יש לבחור לפחות תרגיל אחד");
      return;
    }

    const workoutExercises = selectedExercises.map((exercise) => ({
      exerciseId: exercise.id,
      exercise: exercise,
      sets: [],
    }));

    startCustomWorkout({
      name: "אימון מותאם אישית",
      exercises: workoutExercises,
    } as any);

    navigation.navigate("ActiveWorkout" as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* רקע גרדיאנט */}
      <LinearGradient
        {...authTheme.components.backgroundGradient.props}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: headerSlide }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={authTheme.colors.text}
            />
          </TouchableOpacity>

          <Text style={authTheme.components.title.secondary}>
            בחירת תרגילים
          </Text>

          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
          <BlurView intensity={80} tint="dark" style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={20}
              color={authTheme.colors.textMuted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="חפש תרגיל..."
              placeholderTextColor={authTheme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={authTheme.colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </BlurView>
        </Animated.View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {muscleCategories.map((category, index) => (
            <CategoryChip
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
              index={index}
            />
          ))}
        </ScrollView>

        {/* Selected Counter */}
        {selectedExercises.length > 0 && (
          <Animated.View
            style={[
              styles.selectedCounter,
              {
                opacity: fadeAnim,
                transform: [{ scale: buttonScale }],
              },
            ]}
          >
            <LinearGradient
              colors={authTheme.colors.gradients.success}
              style={styles.selectedCounterGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.selectedCounterText}>
                נבחרו {selectedExercises.length} תרגילים
              </Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Exercises List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={authTheme.colors.primary} />
            <Text style={styles.loadingText}>טוען תרגילים...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ExerciseCard
                exercise={item}
                isSelected={selectedExercises.some((e) => e.id === item.id)}
                onToggle={() => toggleExercise(item)}
                index={index}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={64}
                  color={authTheme.colors.textMuted}
                />
                <Text style={styles.emptyTitle}>לא נמצאו תרגילים</Text>
                <Text style={styles.emptyText}>
                  נסה לשנות את הפילטרים או החיפוש
                </Text>
              </View>
            }
          />
        )}

        {/* Start Button */}
        {selectedExercises.length > 0 && (
          <Animated.View
            style={[
              styles.bottomContainer,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <TouchableOpacity
              style={authTheme.components.button.primary.container}
              onPress={handleStartWorkout}
            >
              <LinearGradient
                {...authTheme.components.button.primary.gradient.props}
                colors={authTheme.components.button.primary.gradient.colors}
                style={authTheme.components.button.primary.gradient.style}
              >
                <View style={styles.startButtonContent}>
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={authTheme.components.button.primary.text}>
                    התחל אימון ({selectedExercises.length})
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: authTheme.colors.surface,
    borderRadius: authTheme.dimensions.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: authTheme.dimensions.fontSize.md,
    color: authTheme.colors.text,
  },
  clearButton: {
    padding: 4,
  },

  // Categories
  categoriesContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: authTheme.dimensions.borderRadius.round,
    backgroundColor: authTheme.colors.surface,
    borderWidth: 1,
    borderColor: authTheme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryChipSelected: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  categoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  categoryText: {
    fontSize: authTheme.dimensions.fontSize.sm,
    color: authTheme.colors.textMuted,
    fontWeight: "600",
  },
  categoryTextSelected: {
    fontSize: authTheme.dimensions.fontSize.sm,
    color: authTheme.colors.text,
    fontWeight: "600",
  },

  // Selected Counter
  selectedCounter: {
    alignItems: "center",
    marginBottom: 16,
  },
  selectedCounterGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: authTheme.dimensions.borderRadius.round,
  },
  selectedCounterText: {
    fontSize: authTheme.dimensions.fontSize.sm,
    color: authTheme.colors.text,
    fontWeight: "600",
  },

  // Exercise Card
  exerciseCard: {
    borderRadius: authTheme.dimensions.borderRadius.lg,
    backgroundColor: authTheme.colors.surface,
    borderWidth: 1,
    borderColor: authTheme.colors.border,
    overflow: "hidden",
  },
  exerciseCardSelected: {
    borderColor: authTheme.colors.primary,
  },
  exerciseContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  exerciseInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: authTheme.dimensions.borderRadius.md,
    backgroundColor: authTheme.colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: authTheme.dimensions.fontSize.md,
    fontWeight: "600",
    color: authTheme.colors.text,
    marginBottom: 4,
  },
  exerciseTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: authTheme.dimensions.borderRadius.sm,
  },
  tagText: {
    fontSize: authTheme.dimensions.fontSize.xs,
    fontWeight: "500",
  },
  exerciseDescription: {
    fontSize: authTheme.dimensions.fontSize.sm,
    color: authTheme.colors.textSecondary,
    lineHeight: 18,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  selectedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: authTheme.colors.border,
  },

  // List
  listContent: {
    paddingBottom: 100,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: authTheme.dimensions.fontSize.md,
    color: authTheme.colors.textSecondary,
  },

  // Empty
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: authTheme.dimensions.fontSize.lg,
    fontWeight: "600",
    color: authTheme.colors.text,
  },
  emptyText: {
    fontSize: authTheme.dimensions.fontSize.sm,
    color: authTheme.colors.textSecondary,
    textAlign: "center",
  },

  // Bottom
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: authTheme.colors.background,
  },
  startButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default ExerciseSelectionScreen;
