// src/screens/exercises/ExerciseSelectionScreen.tsx - מסך בחירת תרגילים משודרג

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  Alert,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Components
import Button from "../../components/common/Button";

// Types & Utils
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Exercise } from "../../types/exercise";
import { useWorkoutStore } from "../../stores/workoutStore";
import { useExercises } from "../../hooks/useExercises";
import { designSystem } from "../../theme/designSystem";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ✅ פונקציית עזר לשקיפות צבעים
const withOpacity = (color: string, opacity: number): string => {
  return (
    color +
    Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")
  );
};

// קטגוריות שרירים עם צבעים וגרדיאנטים
const muscleGroups = [
  {
    id: "all",
    name: "הכל",
    icon: "view-grid",
    color: designSystem.colors.primary.main,
    gradient: designSystem.gradients.primary.colors,
  },
  {
    id: "חזה",
    name: "חזה",
    icon: "shield",
    color: designSystem.colors.accent.purple,
    gradient: [
      designSystem.colors.accent.purple,
      designSystem.colors.accent.pink,
    ],
  },
  {
    id: "גב",
    name: "גב",
    icon: "arrow-expand-vertical",
    color: designSystem.colors.secondary.main,
    gradient: designSystem.gradients.secondary.colors,
  },
  {
    id: "כתפיים",
    name: "כתפיים",
    icon: "body",
    color: designSystem.colors.accent.orange,
    gradient: [designSystem.colors.accent.orange, "#FF6B6B"],
  },
  {
    id: "זרועות",
    name: "זרועות",
    icon: "arm-flex",
    color: "#EC4899",
    gradient: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "רגליים",
    name: "רגליים",
    icon: "human-handsdown",
    color: "#10B981",
    gradient: ["#10B981", "#059669"],
  },
  {
    id: "ליבה",
    name: "ליבה",
    icon: "grid",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#DC2626"],
  },
] as const;

// רכיב פילטר קטגוריות משודרג
const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderCategory = (group: (typeof muscleGroups)[0], index: number) => {
    const isSelected = selectedCategory === group.id;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });

      onCategoryChange(group.id);
    };

    return (
      <Animated.View
        key={group.id}
        style={{
          transform: [
            { scale: scaleAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.categoryButton,
            isSelected && styles.activeCategoryButton,
          ]}
        >
          {isSelected ? (
            <LinearGradient
              colors={group.gradient}
              style={styles.categoryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={group.icon as any} size={24} color="#fff" />
              <Text style={[styles.categoryText, styles.activeCategoryText]}>
                {group.name}
              </Text>
            </LinearGradient>
          ) : (
            <>
              <Ionicons
                name={group.icon as any}
                size={24}
                color={group.color}
              />
              <Text style={styles.categoryText}>{group.name}</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {muscleGroups.map((group, index) => renderCategory(group, index))}
      </ScrollView>
    </Animated.View>
  );
};

// רכיב תרגיל משודרג
const ExerciseItem = ({
  exercise,
  isSelected,
  onToggle,
  index,
}: {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  const getDifficultyColor = () => {
    switch (exercise.difficulty) {
      case "beginner":
        return designSystem.colors.secondary.main;
      case "intermediate":
        return designSystem.colors.accent.orange;
      case "advanced":
        return designSystem.colors.semantic.error;
      default:
        return designSystem.colors.primary.main;
    }
  };

  const getDifficultyText = () => {
    switch (exercise.difficulty) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return "";
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.exerciseCard, isSelected && styles.selectedExerciseCard]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseIcon}>
          <Ionicons
            name="dumbbell"
            size={24}
            color={
              isSelected
                ? designSystem.colors.primary.main
                : designSystem.colors.neutral.text.tertiary
            }
          />
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          {exercise.description && (
            <Text style={styles.exerciseDescription} numberOfLines={2}>
              {exercise.description}
            </Text>
          )}

          <View style={styles.exerciseTags}>
            {/* Primary muscle tag */}
            {exercise.targetMuscleGroups?.[0] && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: getDifficultyColor() + "20" },
                ]}
              >
                <Text style={[styles.tagText, { color: getDifficultyColor() }]}>
                  {exercise.targetMuscleGroups[0]}
                </Text>
              </View>
            )}

            {/* Equipment tag */}
            {exercise.equipment && (
              <View style={styles.tag}>
                <Ionicons
                  name="barbell"
                  size={12}
                  color={designSystem.colors.neutral.text.tertiary}
                />
                <Text style={styles.tagText}>{exercise.equipment}</Text>
              </View>
            )}

            {/* Difficulty tag */}
            {exercise.difficulty && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: getDifficultyColor() + "10" },
                ]}
              >
                <Text style={[styles.tagText, { color: getDifficultyColor() }]}>
                  {getDifficultyText()}
                </Text>
              </View>
            )}
          </View>

          {/* Secondary muscles */}
          {exercise.targetMuscleGroups &&
            exercise.targetMuscleGroups.length > 1 && (
              <View style={styles.secondaryMuscles}>
                <Text style={styles.secondaryLabel}>שרירים משניים:</Text>
                <Text style={styles.secondaryText}>
                  {exercise.targetMuscleGroups.slice(1).join(", ")}
                </Text>
              </View>
            )}
        </View>

        {/* Selection indicator with animation */}
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0.98, 1],
                      outputRange: [1.2, 1],
                    }),
                  },
                ],
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={designSystem.colors.primary.main}
              />
            </Animated.View>
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// המסך הראשי משודרג
const ExerciseSelectionScreen = () => {
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

  // התחלת אימון
  const handleStartWorkout = () => {
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
    });

    navigation.navigate("ActiveWorkout");
  };

  const renderExercise = ({
    item,
    index,
  }: {
    item: Exercise;
    index: number;
  }) => (
    <ExerciseItem
      exercise={item}
      isSelected={selectedExercises.some((e) => e.id === item.id)}
      onToggle={() => toggleExercise(item)}
      index={index}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={designSystem.gradients.dark.colors}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View style={{ opacity: fadeAnim }}>
          <Ionicons
            name="barbell"
            size={48}
            color={designSystem.colors.primary.main}
          />
          <Text style={styles.loadingText}>טוען תרגילים...</Text>
        </Animated.View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={designSystem.gradients.dark.colors}
          style={StyleSheet.absoluteFillObject}
        />
        <Ionicons
          name="alert-circle"
          size={48}
          color={designSystem.colors.semantic.error}
        />
        <Text style={styles.errorText}>שגיאה בטעינת התרגילים</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={designSystem.gradients.dark.colors}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>בחירת תרגילים</Text>

        {selectedExercises.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSelectedExercises([])}
          >
            <Text style={styles.clearButtonText}>נקה</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Search with animation */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scale: searchAnim }],
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={designSystem.colors.neutral.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חיפוש תרגילים..."
          placeholderTextColor={designSystem.colors.neutral.text.tertiary}
          style={styles.searchInput}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={designSystem.colors.neutral.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Categories */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Selected Counter */}
      {selectedExercises.length > 0 && (
        <Animated.View style={[styles.selectedCounter, { opacity: fadeAnim }]}>
          <Text style={styles.selectedCounterText}>
            נבחרו {selectedExercises.length} תרגילים
          </Text>
        </Animated.View>
      )}

      {/* Exercises List */}
      {filteredExercises.length > 0 ? (
        <FlatList
          data={filteredExercises}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          style={styles.exercisesList}
          contentContainerStyle={styles.exercisesContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={64}
            color={designSystem.colors.neutral.text.tertiary}
          />
          <Text style={styles.emptyTitle}>לא נמצאו תרגילים</Text>
          <Text style={styles.emptyText}>
            נסה לחפש משהו אחר או לשנות קטגוריה
          </Text>
        </View>
      )}

      {/* Bottom Section with gradient fade */}
      <LinearGradient
        colors={["transparent", designSystem.colors.background.primary]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      <Animated.View
        style={[
          styles.bottomSection,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.startButton,
            selectedExercises.length === 0 && styles.startButtonDisabled,
          ]}
          onPress={handleStartWorkout}
          disabled={selectedExercises.length === 0}
        >
          <LinearGradient
            colors={
              selectedExercises.length > 0
                ? designSystem.gradients.primary.colors
                : [
                    designSystem.colors.neutral.border,
                    designSystem.colors.neutral.border,
                  ]
            }
            style={styles.startButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.startButtonText}>
              התחל אימון ({selectedExercises.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: designSystem.colors.semantic.error,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: designSystem.colors.primary.main,
    fontWeight: "600",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: designSystem.colors.background.card,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: designSystem.borderRadius.input,
    ...designSystem.shadows.sm,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: designSystem.colors.neutral.text.primary,
    textAlign: "right",
  },

  // Categories
  categoryContainer: {
    marginBottom: 16,
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: designSystem.colors.background.card,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
    gap: 8,
    marginRight: 12,
  },
  activeCategoryButton: {
    borderColor: "transparent",
    backgroundColor: "transparent",
    ...designSystem.shadows.md,
  },
  categoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    fontWeight: "600",
  },
  activeCategoryText: {
    color: "#fff",
  },

  // Selected Counter
  selectedCounter: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  selectedCounterText: {
    fontSize: 14,
    color: designSystem.colors.primary.main,
    fontWeight: "600",
  },

  // Exercises List
  exercisesList: {
    flex: 1,
  },
  exercisesContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Exercise Card
  exerciseCard: {
    flexDirection: "row",
    backgroundColor: designSystem.colors.background.card,
    borderRadius: designSystem.borderRadius.card,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    ...designSystem.shadows.sm,
  },
  selectedExerciseCard: {
    borderColor: designSystem.colors.primary.main,
    backgroundColor: withOpacity(designSystem.colors.primary.main, 0.05),
    ...designSystem.shadows.md,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designSystem.colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 4,
    textAlign: "right",
  },
  exerciseDescription: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    lineHeight: 18,
    marginBottom: 8,
    textAlign: "right",
  },
  exerciseTags: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: designSystem.borderRadius.sm,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: designSystem.colors.neutral.text.secondary,
    fontWeight: "500",
  },
  secondaryMuscles: {
    marginTop: 4,
  },
  secondaryLabel: {
    fontSize: 11,
    color: designSystem.colors.neutral.text.tertiary,
    marginBottom: 2,
  },
  secondaryText: {
    fontSize: 12,
    color: designSystem.colors.neutral.text.secondary,
  },

  // Selection
  selectionIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: designSystem.colors.neutral.border,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    textAlign: "center",
  },

  // Bottom Section
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    pointerEvents: "none",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    borderRadius: designSystem.borderRadius.button,
    overflow: "hidden",
    ...designSystem.shadows.lg,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ExerciseSelectionScreen;
