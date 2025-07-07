// src/screens/exercises/ExerciseSelectionScreen.tsx - מסך בחירת תרגילים מתוקן

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
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
} from "react-native";

// Components
import Button from "../../components/common/Button";

// Types & Utils
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Exercise } from "../../types/exercise";
import { useWorkoutStore } from "../../stores/workoutStore";
import { useExercises } from "../../hooks/useExercises";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ✅ פונקציית עזר לשקיפות צבעים
const withOpacity = (color: string, opacity: number): string => {
  // פשוט מחזיר צבע עם שקיפות בסיסית
  return (
    color +
    Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")
  );
};

// קטגוריות שרירים
const muscleGroups = [
  { id: "all", name: "הכל", icon: "fitness-outline" },
  { id: "חזה", name: "חזה", icon: "body-outline" },
  { id: "גב", name: "גב", icon: "body-outline" },
  { id: "כתפיים", name: "כתפיים", icon: "body-outline" },
  { id: "זרועות", name: "זרועות", icon: "body-outline" },
  { id: "רגליים", name: "רגליים", icon: "body-outline" },
  { id: "ליבה", name: "ליבה", icon: "body-outline" },
] as const;

// רכיב פילטר קטגוריות
const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.categoryContainer}
    contentContainerStyle={styles.categoryContent}
  >
    {muscleGroups.map((group) => (
      <TouchableOpacity
        key={group.id}
        style={[
          styles.categoryButton,
          selectedCategory === group.id && styles.activeCategoryButton,
        ]}
        onPress={() => onCategoryChange(group.id)}
      >
        <Ionicons
          name={group.icon as any}
          size={20}
          color={
            selectedCategory === group.id
              ? colors.primary
              : colors.textSecondary
          }
        />
        <Text
          style={[
            styles.categoryText,
            selectedCategory === group.id && styles.activeCategoryText,
          ]}
        >
          {group.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// רכיב תרגיל בודד
const ExerciseItem = ({
  exercise,
  isSelected,
  onToggle,
}: {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: (exercise: Exercise) => void;
}) => {
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    // אנימציה קצרה של לחיצה
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(exercise);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.exerciseCard, isSelected && styles.selectedExerciseCard]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          {exercise.description && (
            <Text style={styles.exerciseDescription} numberOfLines={2}>
              {exercise.description}
            </Text>
          )}

          {/* שרירים מעורבים */}
          {exercise.targetMuscleGroups &&
            exercise.targetMuscleGroups.length > 0 && (
              <View style={styles.exerciseMuscles}>
                {exercise.targetMuscleGroups
                  .slice(0, 3)
                  .map((muscle, index) => (
                    <View key={index} style={styles.muscleTag}>
                      <Text style={styles.muscleTagText}>{muscle}</Text>
                    </View>
                  ))}
                {exercise.targetMuscleGroups.length > 3 && (
                  <Text style={styles.muscleTagText}>
                    +{exercise.targetMuscleGroups.length - 3}
                  </Text>
                )}
              </View>
            )}

          {/* מידע נוסף */}
          <View style={styles.exerciseMeta}>
            <View style={styles.exerciseMetaItem}>
              <Ionicons
                name="barbell-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.exerciseMetaText}>{exercise.category}</Text>
            </View>

            {exercise.difficulty && (
              <View style={styles.exerciseMetaItem}>
                <Ionicons
                  name="star-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={styles.exerciseMetaText}>
                  {exercise.difficulty === "beginner"
                    ? "מתחיל"
                    : exercise.difficulty === "intermediate"
                    ? "בינוני"
                    : "מתקדם"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* אינדיקטור בחירה */}
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primary}
            />
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// המסך הראשי
const ExerciseSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { startCustomWorkout } = useWorkoutStore();

  // שימוש ב-hook לשליפת תרגילים מה-API
  const { data: exercises, isLoading, isError } = useExercises();

  // State
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // התחלת אימון מותאם
  const handleStartCustomWorkout = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert("שגיאה", "נא לבחור לפחות תרגיל אחד");
      return;
    }

    try {
      await startCustomWorkout(selectedExercises);
      navigation.navigate("ActiveWorkout");
    } catch (error) {
      Alert.alert("שגיאה", "לא ניתן היה להתחיל את האימון");
    }
  };

  // מצב טעינה
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען תרגילים...</Text>
      </View>
    );
  }

  // מצב שגיאה
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>שגיאה בטעינת התרגילים</Text>
        <Button title="חזור" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>בחירת תרגילים</Text>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setSelectedExercises([])}
        >
          <Text style={styles.clearButtonText}>נקה</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="חיפוש תרגילים..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Selected Counter */}
      {selectedExercises.length > 0 && (
        <View style={styles.selectedCounter}>
          <Text style={styles.selectedCounterText}>
            נבחרו {selectedExercises.length} תרגילים
          </Text>
        </View>
      )}

      {/* Exercises List */}
      <FlatList
        style={styles.exercisesList}
        contentContainerStyle={styles.exercisesContent}
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseItem
            exercise={item}
            isSelected={selectedExercises.some((e) => e.id === item.id)}
            onToggle={toggleExercise}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>לא נמצאו תרגילים</Text>
            <Text style={styles.emptyText}>
              נסה לשנות את הפילטרים או החיפוש
            </Text>
          </View>
        }
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Button
          title={`התחל אימון (${selectedExercises.length})`}
          onPress={handleStartCustomWorkout}
          disabled={selectedExercises.length === 0}
          style={[
            styles.startButton,
            selectedExercises.length === 0 && { opacity: 0.5 },
          ]}
        />
      </View>
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
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    textAlign: "right",
  },

  // Categories
  categoryContainer: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  activeCategoryButton: {
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: colors.primary,
  },

  // Selected Counter
  selectedCounter: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  selectedCounterText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },

  // Exercises List
  exercisesList: {
    flex: 1,
  },
  exercisesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Exercise Card
  exerciseCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedExerciseCard: {
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.05),
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
    textAlign: "right",
  },
  exerciseMuscles: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  muscleTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderRadius: 4,
  },
  muscleTagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
  exerciseMeta: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  exerciseMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exerciseMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Selection
  selectionIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Bottom Section
  bottomSection: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
  },
});

export default ExerciseSelectionScreen;
