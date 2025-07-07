// src/screens/exercises/ExerciseSelectionScreen.tsx - מסך בחירת תרגילים

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

// Data
import { exercises } from "../../constants/exercises";

// Types & Utils
import { colors, withOpacity } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Exercise } from "../../types/exercise";
import { useWorkoutStore } from "../../stores/workoutStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// קטגוריות שרירים
const muscleGroups = [
  { id: "all", name: "הכל", icon: "fitness" },
  { id: "chest", name: "חזה", icon: "body" },
  { id: "back", name: "גב", icon: "body" },
  { id: "shoulders", name: "כתפיים", icon: "body" },
  { id: "arms", name: "זרועות", icon: "body" },
  { id: "legs", name: "רגליים", icon: "body" },
  { id: "core", name: "ליבה", icon: "body" },
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

// רכיב כרטיס תרגיל
const ExerciseCard = ({
  exercise,
  isSelected,
  onToggle,
}: {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.exerciseCard, isSelected && styles.selectedExerciseCard]}
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Exercise Info */}
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDescription} numberOfLines={2}>
            {exercise.description || "תרגיל איכותי לחיזוק השרירים"}
          </Text>

          {/* Muscle Groups */}
          <View style={styles.exerciseMuscles}>
            {exercise.targetMuscleGroups?.slice(0, 2).map((muscle, index) => (
              <View key={index} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{muscle}</Text>
              </View>
            ))}
          </View>

          {/* Exercise Meta */}
          <View style={styles.exerciseMeta}>
            <View style={styles.exerciseMetaItem}>
              <Ionicons name="fitness" size={14} color={colors.textSecondary} />
              <Text style={styles.exerciseMetaText}>
                {exercise.difficulty || "בינוני"}
              </Text>
            </View>

            {exercise.equipment && (
              <View style={styles.exerciseMetaItem}>
                <Ionicons
                  name="barbell"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={styles.exerciseMetaText}>
                  {exercise.equipment}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Selection Indicator */}
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

  // State
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // סינון תרגילים
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // סינון לפי קטגוריה
    if (selectedCategory !== "all") {
      filtered = filtered.filter((exercise) =>
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
          exercise.targetMuscleGroups?.some((muscle) =>
            muscle.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

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
  const handleStartCustomWorkout = useCallback(async () => {
    if (selectedExercises.length === 0) {
      Alert.alert("בחר תרגילים", "עליך לבחור לפחות תרגיל אחד");
      return;
    }

    try {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // יצירת אימון מותאם
      await startCustomWorkout(selectedExercises);

      // נווט לאימון פעיל
      navigation.navigate("ActiveWorkout");
    } catch (error) {
      console.error("Failed to start custom workout:", error);
      Alert.alert("שגיאה", "לא ניתן להתחיל את האימון");
    }
  }, [selectedExercises, startCustomWorkout, navigation]);

  // ניקוי בחירה
  const handleClearSelection = useCallback(() => {
    setSelectedExercises([]);
  }, []);

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
        <Text style={styles.headerTitle}>בחר תרגילים</Text>
        {selectedExercises.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSelection}
          >
            <Text style={styles.clearButtonText}>נקה</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="חפש תרגילים..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category Filter */}
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
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            isSelected={selectedExercises.some((e) => e.id === item.id)}
            onToggle={() => toggleExercise(item)}
          />
        )}
        style={styles.exercisesList}
        contentContainerStyle={styles.exercisesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>לא נמצאו תרגילים</Text>
            <Text style={styles.emptyText}>
              נסה לשנות את הקטגוריה או החיפוש
            </Text>
          </View>
        }
      />

      {/* Bottom Action */}
      {selectedExercises.length > 0 && (
        <View style={styles.bottomSection}>
          <Button
            title={`התחל אימון עם ${selectedExercises.length} תרגילים`}
            onPress={handleStartCustomWorkout}
            style={styles.startButton}
            textStyle={styles.startButtonText}
          />
        </View>
      )}
    </View>
  );
};

// 🎨 עיצוב
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
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
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  exerciseMuscles: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
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
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExerciseSelectionScreen;
