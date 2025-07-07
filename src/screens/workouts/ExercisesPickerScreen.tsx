// src/screens/workouts/ExercisesPickerScreen.tsx - ✅ Fixed TypeScript Errors

import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useDebounce } from "../../hooks/useDebounce";
import { useExercises } from "../../hooks/useExercises";
import { usePlanEditorStore } from "../../stores/planEditorStore";
import { colors } from "../../theme/colors";
import { Exercise } from "../../types/exercise";
import { RootStackParamList } from "../../types/navigation";

type ScreenRouteProp = RouteProp<RootStackParamList, "ExercisesPicker">;

const ExercisesPickerScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { planId, dayId } = route.params;

  // ✅ Fixed: Get plan and day data from the plan editor store instead of route params
  const { plan, updateDay } = usePlanEditorStore();

  const { data: allExercises = [], isLoading, isError } = useExercises();

  // ✅ Fixed: Get initially selected exercises from the day in the plan
  const currentDay = plan?.days?.find((d) => d.id === dayId);
  const initiallySelected = currentDay?.exercises || [];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initiallySelected.map((ex: any) => ex.id)) // ✅ Fixed: Added type annotation
  );

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (allExercises) {
      const filtered = allExercises.filter(
        (
          ex: Exercise // ✅ Fixed: Added type annotation
        ) => ex.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [debouncedSearchTerm, allExercises]);

  const toggleSelect = useCallback((exerciseId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  }, []);

  const handleDone = () => {
    if (!currentDay) return;

    const selectedExercises = allExercises.filter((ex: Exercise) =>
      selectedIds.has(ex.id)
    );

    // ✅ Fixed: Convert selected exercises to PlanExercises and update the day
    const updatedDay = {
      ...currentDay,
      exercises: selectedExercises.map((ex: Exercise) => ({
        id: ex.id,
        name: ex.name,
        muscleGroup: ex.category || "", // ✅ Fixed: Use category instead of muscleGroup
        sets: 3, // Default sets
        reps: 10, // Default reps
      })),
    };

    updateDay(dayId, updatedDay);
    navigation.goBack();
  };

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => {
      const isSelected = selectedIds.has(item.id);
      return (
        <TouchableOpacity
          style={[styles.card, isSelected && styles.cardSelected]}
          onPress={() => toggleSelect(item.id)}
        >
          <View>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {/* ✅ Fixed: Use category instead of muscleGroup */}
            {item.category && (
              <Text style={styles.muscleGroup}>{item.category}</Text>
            )}
          </View>
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      );
    },
    [selectedIds, toggleSelect]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>טוען תרגילים...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>שגיאה בטעינת התרגילים</Text>
        <Button title="נסה שוב" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>בחר תרגילים</Text>
        <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
          <Text style={styles.doneText}>סיום</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="חיפוש תרגילים..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          iconName="search-outline"
        />
      </View>

      {/* Selected count */}
      <View style={styles.selectedCountContainer}>
        <Text style={styles.selectedCountText}>
          נבחרו {selectedIds.size} תרגילים
        </Text>
      </View>

      {/* Exercise list */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="fitness-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>
              {searchTerm ? "לא נמצאו תרגילים" : "טוען תרגילים..."}
            </Text>
          </View>
        }
      />

      {/* Footer with action button */}
      <View style={styles.footer}>
        <Button
          title={`הוסף ${selectedIds.size} תרגילים`}
          onPress={handleDone}
          disabled={selectedIds.size === 0}
          style={styles.addButton}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 8,
    minWidth: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    flex: 1,
  },
  doneText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  // Search
  searchContainer: {
    padding: 16,
    backgroundColor: colors.surface,
  },

  // Selected count
  selectedCountContainer: {
    padding: 12,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },

  // List
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  muscleGroup: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    marginVertical: 0,
  },
});

export default ExercisesPickerScreen;
