// src/screens/workouts/ExercisesPickerScreen.tsx - מסך בחירת תרגילים משופר עם חיבור מלא ל-wger

import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { useExercises } from "../../hooks/useExercises";
import { usePlanEditorStore } from "../../stores/planEditorStore";
import { colors } from "../../theme/colors";
import { Exercise } from "../../types/exercise";
import { RootStackParamList } from "../../types/navigation";
import { PlanExercise } from "../../types/plan";

type ScreenRouteProp = RouteProp<RootStackParamList, "ExercisesPicker">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// קומפוננט פילטר לפי קבוצת שרירים
const MuscleGroupFilter = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (group: string) => void;
}) => {
  const muscleGroups = [
    { id: "all", name: "הכל", icon: "body" },
    { id: "חזה", name: "חזה", icon: "fitness" },
    { id: "גב", name: "גב", icon: "trending-up" },
    { id: "רגליים", name: "רגליים", icon: "walk" },
    { id: "כתפיים", name: "כתפיים", icon: "hand-left" },
    { id: "זרועות", name: "זרועות", icon: "barbell" },
    { id: "ליבה", name: "ליבה", icon: "shield" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {muscleGroups.map((group) => (
        <TouchableOpacity
          key={group.id}
          style={[
            styles.filterChip,
            selected === group.id && styles.filterChipActive,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(group.id);
          }}
        >
          <Ionicons
            name={group.icon as any}
            size={16}
            color={selected === group.id ? "#fff" : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterChipText,
              selected === group.id && styles.filterChipTextActive,
            ]}
          >
            {group.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// קומפוננט כרטיס תרגיל
const ExerciseCard = ({
  exercise,
  isSelected,
  onToggle,
}: {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.exerciseCard, isSelected && styles.exerciseCardSelected]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseTags}>
          {exercise.targetMuscleGroups?.map((muscle, index) => (
            <View key={index} style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>{muscle}</Text>
            </View>
          ))}
        </View>
        {exercise.equipment && exercise.equipment.length > 0 && (
          <View style={styles.equipmentRow}>
            <Ionicons
              name="barbell-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.equipmentText}>
              {exercise.equipment.join(", ")}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.checkboxContainer}>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// קומפוננט ראשי
const ExercisesPickerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { dayId } = route.params;

  // Store
  const { plan, updateDay } = usePlanEditorStore();

  // API Data
  const {
    exercises: allExercises = [],
    isLoading,
    isError,
    refetch,
  } = useExercises();

  // State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // אתחול תרגילים נבחרים מהיום הנוכחי
  useEffect(() => {
    const currentDay = plan?.days?.find((d) => d.id === dayId);
    if (currentDay?.exercises) {
      const existingIds = new Set(currentDay.exercises.map((ex) => ex.id));
      setSelectedIds(existingIds);
    }
  }, [plan, dayId]);

  // סינון תרגילים
  const filteredExercises = useMemo(() => {
    let filtered = allExercises;

    // סינון לפי קבוצת שרירים
    if (selectedMuscleGroup !== "all") {
      filtered = filtered.filter((ex) =>
        ex.targetMuscleGroups?.includes(selectedMuscleGroup)
      );
    }

    // סינון לפי חיפוש
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchLower) ||
          ex.description?.toLowerCase().includes(searchLower) ||
          ex.targetMuscleGroups?.some((muscle) =>
            muscle.toLowerCase().includes(searchLower)
          )
      );
    }

    return filtered;
  }, [allExercises, selectedMuscleGroup, debouncedSearchTerm]);

  // רענון נתונים מ-wger
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      Toast.success("רשימת התרגילים עודכנה מ-wger");
    } catch {
      Toast.error("שגיאה בעדכון התרגילים");
    } finally {
      setIsRefreshing(false);
    }
  };

  // בחירת/ביטול תרגיל
  const toggleSelect = useCallback((exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  // שמירת הבחירה וחזרה
  const handleSave = useCallback(() => {
    if (!plan) {
      Alert.alert("שגיאה", "לא נמצאו נתוני תוכנית");
      return;
    }

    const currentDay = plan.days?.find((d) => d.id === dayId);
    if (!currentDay) {
      Alert.alert("שגיאה", "לא נמצא יום האימון");
      return;
    }

    // יצירת רשימת תרגילים חדשה
    const selectedExercises: PlanExercise[] = Array.from(selectedIds)
      .map((id) => allExercises.find((ex) => ex.id === id))
      .filter(Boolean)
      .map((exercise) => ({
        id: exercise!.id,
        name: exercise!.name,
        muscleGroup: exercise!.targetMuscleGroups?.[0] || "כללי",
        targetMuscles: exercise!.targetMuscleGroups,
        sets: 3, // ברירת מחדל
        reps: 12, // ברירת מחדל
        restTime: 90, // ברירת מחדל
        equipment: exercise!.equipment,
        instructions: exercise!.instructions,
      }));

    // עדכון היום עם התרגילים החדשים
    const updatedDay = {
      ...currentDay,
      exercises: selectedExercises,
    };

    updateDay(dayId || "", updatedDay);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.success(`נבחרו ${selectedExercises.length} תרגילים`);
    navigation.goBack();
  }, [selectedIds, allExercises, plan, dayId, updateDay, navigation]);

  // ניקוי הבחירה
  const handleClearSelection = () => {
    Alert.alert("ניקוי בחירה", "האם לנקות את כל התרגילים שנבחרו?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "נקה",
        style: "destructive",
        onPress: () => {
          setSelectedIds(new Set());
          Toast.info("הבחירה נוקתה");
        },
      },
    ]);
  };

  // טיפול בשגיאות
  if (isError && !isRefreshing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorTitle}>שגיאה בטעינת התרגילים</Text>
        <Text style={styles.errorMessage}>
          לא הצלחנו לטעון את רשימת התרגילים מ-wger
        </Text>
        <Button
          title="נסה שוב"
          onPress={() => refetch()}
          variant="primary"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark] as any}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>בחר תרגילים</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.refreshButton}
            disabled={isRefreshing}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="חפש תרגיל..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            iconName="search"
            style={styles.searchInput}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredExercises.length} תרגילים זמינים
          </Text>
          <Text style={styles.statsText}>•</Text>
          <Text style={styles.statsText}>{selectedIds.size} תרגילים נבחרו</Text>
        </View>
      </LinearGradient>

      {/* Muscle Group Filter */}
      <MuscleGroupFilter
        selected={selectedMuscleGroup}
        onSelect={setSelectedMuscleGroup}
      />

      {/* Exercise List */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>טוען תרגילים מ-wger...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              isSelected={selectedIds.has(item.id)}
              onToggle={() => toggleSelect(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="search-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>לא נמצאו תרגילים</Text>
              <Text style={styles.emptySubtext}>
                נסה לשנות את הסינון או החיפוש
              </Text>
            </View>
          }
        />
      )}

      {/* Bottom Actions */}
      {selectedIds.size > 0 && (
        <View style={styles.bottomActions}>
          <Button
            title="נקה בחירה"
            onPress={handleClearSelection}
            variant="secondary"
            style={styles.clearButton}
          />
          <Button
            title={`הוסף ${selectedIds.size} תרגילים`}
            onPress={handleSave}
            variant="primary"
            style={styles.saveButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 0,
    color: "#fff",
    borderRadius: 8,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  statsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Filter styles
  filterContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#fff",
  },

  // Exercise card styles
  exerciseCard: {
    flexDirection: "row-reverse",
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + "10",
  },
  exerciseInfo: {
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  exerciseTags: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
  muscleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight + "20",
    borderRadius: 12,
  },
  muscleTagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  equipmentRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  equipmentText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  checkboxContainer: {
    justifyContent: "center",
    paddingLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // Loading & Error states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // List
  listContent: {
    paddingBottom: 100,
  },

  // Bottom actions
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row-reverse",
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  clearButton: {
    flex: 0.4,
  },
  saveButton: {
    flex: 0.6,
  },
});

export default ExercisesPickerScreen;
