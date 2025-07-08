// src/components/modals/WorkoutFilterModal.tsx - 🔍 Fixed Filter Modal

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WorkoutHistoryFilters } from "../../types/workout"; // שינוי: import מהמקום הנכון
import { colors } from "../../theme/colors";

const { height } = Dimensions.get("window");

interface WorkoutFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: WorkoutHistoryFilters) => void;
  currentFilters: WorkoutHistoryFilters;
}

// 🏷️ Filter Tag Component
const FilterTag = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterTag,
        {
          backgroundColor: active
            ? colors.primary || "#007AFF"
            : colors.surface || "#F2F2F7",
          borderColor: active
            ? colors.primary || "#007AFF"
            : colors.border || "#E5E5E7",
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterTagText,
          { color: active ? "#FFFFFF" : colors.text || "#000" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ⭐ Rating Selector Component
const RatingSelector = ({
  selectedRating,
  onRatingChange,
}: {
  selectedRating?: number;
  onRatingChange: (rating?: number) => void;
}) => {
  return (
    <View style={styles.ratingContainer}>
      <TouchableOpacity
        style={[
          styles.ratingOption,
          {
            backgroundColor: !selectedRating
              ? colors.primary || "#007AFF"
              : colors.surface || "#F2F2F7",
            borderColor: !selectedRating
              ? colors.primary || "#007AFF"
              : colors.border || "#E5E5E7",
          },
        ]}
        onPress={() => onRatingChange(undefined)}
      >
        <Text
          style={[
            styles.ratingText,
            {
              color: !selectedRating ? "#FFFFFF" : colors.text || "#000",
            },
          ]}
        >
          הכל
        </Text>
      </TouchableOpacity>

      {[1, 2, 3, 4, 5].map((rating) => (
        <TouchableOpacity
          key={rating}
          style={[
            styles.ratingOption,
            {
              backgroundColor:
                selectedRating === rating
                  ? colors.primary || "#007AFF"
                  : colors.surface || "#F2F2F7",
              borderColor:
                selectedRating === rating
                  ? colors.primary || "#007AFF"
                  : colors.border || "#E5E5E7",
            },
          ]}
          onPress={() => onRatingChange(rating)}
        >
          <Text
            style={[
              styles.ratingText,
              {
                color:
                  selectedRating === rating ? "#FFFFFF" : colors.text || "#000",
              },
            ]}
          >
            <Ionicons name="star" size={16} /> {rating}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// 📅 Date Range Selector
const DateRangeSelector = ({
  startDate,
  endDate,
  onDateChange,
}: {
  startDate?: string;
  endDate?: string;
  onDateChange: (start?: string, end?: string) => void;
}) => {
  const presets = [
    { label: "השבוע", days: 7 },
    { label: "החודש", days: 30 },
    { label: "3 חודשים", days: 90 },
    { label: "השנה", days: 365 },
  ];

  return (
    <View style={styles.dateRangeContainer}>
      <View style={styles.presetButtons}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.label}
            style={styles.presetButton}
            onPress={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - preset.days);
              onDateChange(start.toISOString(), end.toISOString());
            }}
          >
            <Text style={styles.presetButtonText}>{preset.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// 💪 Muscle Groups Selector
const MuscleGroupsSelector = ({
  selectedMuscles,
  onMusclesChange,
}: {
  selectedMuscles: string[];
  onMusclesChange: (muscles: string[]) => void;
}) => {
  const muscleGroups = [
    { id: "chest", label: "חזה", icon: "💪" },
    { id: "back", label: "גב", icon: "🔙" },
    { id: "shoulders", label: "כתפיים", icon: "🤷" },
    { id: "legs", label: "רגליים", icon: "🦵" },
    { id: "arms", label: "זרועות", icon: "💪" },
    { id: "core", label: "בטן", icon: "🎯" },
  ];

  const toggleMuscle = (muscleId: string) => {
    if (selectedMuscles.includes(muscleId)) {
      onMusclesChange(selectedMuscles.filter((m) => m !== muscleId));
    } else {
      onMusclesChange([...selectedMuscles, muscleId]);
    }
  };

  return (
    <View style={styles.muscleGroupsContainer}>
      {muscleGroups.map((muscle) => (
        <TouchableOpacity
          key={muscle.id}
          style={[
            styles.muscleButton,
            selectedMuscles.includes(muscle.id) && styles.muscleButtonActive,
          ]}
          onPress={() => toggleMuscle(muscle.id)}
        >
          <Text style={styles.muscleIcon}>{muscle.icon}</Text>
          <Text
            style={[
              styles.muscleLabel,
              selectedMuscles.includes(muscle.id) && styles.muscleLabelActive,
            ]}
          >
            {muscle.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// 🎯 Main Filter Modal Component
const WorkoutFilterModal: React.FC<WorkoutFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<WorkoutHistoryFilters>(
    currentFilters || {}
  );

  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleApply = useCallback(() => {
    onApplyFilters(localFilters);
    onClose();
  }, [localFilters, onApplyFilters, onClose]);

  const handleReset = useCallback(() => {
    setLocalFilters({});
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.keys(localFilters).filter(
      (key) => localFilters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [localFilters]);

  const updateFilter = useCallback(
    <K extends keyof WorkoutHistoryFilters>(
      key: K,
      value: WorkoutHistoryFilters[K]
    ) => {
      setLocalFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" />

      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.title}>סינון אימונים</Text>

            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>איפוס</Text>
            </TouchableOpacity>
          </View>

          {/* Filters Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>תקופת זמן</Text>
              <DateRangeSelector
                startDate={localFilters.dateFrom}
                endDate={localFilters.dateTo}
                onDateChange={(start, end) => {
                  updateFilter("dateFrom", start);
                  updateFilter("dateTo", end);
                }}
              />
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>דירוג מינימלי</Text>
              <RatingSelector
                selectedRating={localFilters.rating || localFilters.minRating}
                onRatingChange={(rating) => updateFilter("rating", rating)}
              />
            </View>

            {/* Difficulty */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>רמת קושי</Text>
              <View style={styles.difficultyContainer}>
                {(["beginner", "intermediate", "advanced"] as const).map(
                  (level) => (
                    <FilterTag
                      key={level}
                      label={
                        level === "beginner"
                          ? "מתחיל"
                          : level === "intermediate"
                          ? "ביניים"
                          : "מתקדם"
                      }
                      active={localFilters.difficulty === level}
                      onPress={() =>
                        updateFilter(
                          "difficulty",
                          localFilters.difficulty === level ? undefined : level
                        )
                      }
                    />
                  )
                )}
              </View>
            </View>

            {/* Duration Range */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>משך אימון (דקות)</Text>
              <View style={styles.durationContainer}>
                {[
                  { label: "עד 30", max: 30 },
                  { label: "30-60", min: 30, max: 60 },
                  { label: "60-90", min: 60, max: 90 },
                  { label: "90+", min: 90 },
                ].map((duration) => (
                  <FilterTag
                    key={duration.label}
                    label={duration.label}
                    active={
                      localFilters.minDuration === duration.min &&
                      localFilters.maxDuration === duration.max
                    }
                    onPress={() => {
                      updateFilter("minDuration", duration.min);
                      updateFilter("maxDuration", duration.max);
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Muscle Groups */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>קבוצות שרירים</Text>
              <MuscleGroupsSelector
                selectedMuscles={localFilters.muscles || []}
                onMusclesChange={(muscles: string[]) =>
                  updateFilter(
                    "muscles",
                    muscles.length > 0 ? muscles : undefined
                  )
                }
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>
                החל סינון
                {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  resetButton: {
    padding: 4,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ratingOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateRangeContainer: {
    gap: 12,
  },
  presetButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  presetButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  difficultyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleGroupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleButton: {
    flexDirection: "column",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minWidth: 80,
  },
  muscleButtonActive: {
    backgroundColor: colors.primary,
  },
  muscleIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  muscleLabel: {
    fontSize: 12,
    color: colors.text,
  },
  muscleLabelActive: {
    color: "#FFFFFF",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WorkoutFilterModal;
