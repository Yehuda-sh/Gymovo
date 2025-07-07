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
import { WorkoutHistoryFilters } from "../../hooks/useWorkoutHistory";
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
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= rating ? "star" : "star-outline"}
                size={12}
                color={
                  selectedRating === rating
                    ? "#FFFFFF"
                    : star <= rating
                    ? "#FFD700"
                    : "#C7C7CC"
                }
              />
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// 📅 Simplified Date Range Picker Component (without external dependencies)
const DateRangePicker = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (date?: string) => void;
  onDateToChange: (date?: string) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "בחר תאריך";
    return new Date(dateString).toLocaleDateString("he-IL");
  };

  // Simple date options - last week, last month, last 3 months
  const dateOptions = [
    {
      label: "השבוע האחרון",
      getValue: () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString();
      },
    },
    {
      label: "החודש האחרון",
      getValue: () => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return monthAgo.toISOString();
      },
    },
    {
      label: "3 חודשים אחרונים",
      getValue: () => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return threeMonthsAgo.toISOString();
      },
    },
  ];

  return (
    <View style={styles.dateRangeContainer}>
      <Text
        style={[styles.dateLabel, { color: colors.textSecondary || "#666" }]}
      >
        בחר טווח זמן:
      </Text>

      <View style={styles.dateOptionsContainer}>
        {dateOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateOptionButton,
              {
                backgroundColor: colors.surface || "#F2F2F7",
                borderColor: colors.border || "#E5E5E7",
              },
            ]}
            onPress={() => {
              onDateFromChange(option.getValue());
              onDateToChange(undefined); // Clear end date for simplicity
            }}
          >
            <Text
              style={[styles.dateOptionText, { color: colors.text || "#000" }]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(dateFrom || dateTo) && (
        <View style={styles.selectedDateContainer}>
          <Text
            style={[
              styles.selectedDateText,
              { color: colors.textSecondary || "#666" },
            ]}
          >
            נבחר: {formatDate(dateFrom)} - {formatDate(dateTo) || "עכשיו"}
          </Text>
          <TouchableOpacity
            style={styles.clearDateButton}
            onPress={() => {
              onDateFromChange(undefined);
              onDateToChange(undefined);
            }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.error || "#FF3B30"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// 🏃‍♂️ Simplified Duration Selector Component
const DurationSelector = ({
  minDuration,
  maxDuration,
  onMinDurationChange,
  onMaxDurationChange,
}: {
  minDuration?: number;
  maxDuration?: number;
  onMinDurationChange: (duration?: number) => void;
  onMaxDurationChange: (duration?: number) => void;
}) => {
  const durationRanges = [
    { label: "קצר (עד 30 דק')", min: 0, max: 30 },
    { label: "בינוני (30-60 דק')", min: 30, max: 60 },
    { label: "ארוך (60-90 דק')", min: 60, max: 90 },
    { label: "ארוך מאוד (90+ דק')", min: 90, max: undefined },
  ];

  const currentRange = durationRanges.find(
    (range) => range.min === minDuration && range.max === maxDuration
  );

  return (
    <View style={styles.durationContainer}>
      <Text style={[styles.durationLabel, { color: colors.text || "#000" }]}>
        משך אימון:
      </Text>

      <View style={styles.durationOptionsContainer}>
        {durationRanges.map((range, index) => (
          <FilterTag
            key={index}
            label={range.label}
            active={currentRange === range}
            onPress={() => {
              if (currentRange === range) {
                // Clear selection
                onMinDurationChange(undefined);
                onMaxDurationChange(undefined);
              } else {
                // Set new range
                onMinDurationChange(range.min);
                onMaxDurationChange(range.max);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
};

// 🎯 Main Modal Component
const WorkoutFilterModal: React.FC<WorkoutFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [localFilters, setLocalFilters] =
    useState<WorkoutHistoryFilters>(currentFilters);

  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backgroundOpacity]);

  const updateFilter = useCallback(
    (key: keyof WorkoutHistoryFilters, value: any) => {
      setLocalFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setLocalFilters({});
  }, []);

  const applyFilters = useCallback(() => {
    onApplyFilters(localFilters);
    onClose();
  }, [localFilters, onApplyFilters, onClose]);

  const activeFiltersCount = useMemo(() => {
    return Object.keys(localFilters).filter(
      (key) => localFilters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [localFilters]);

  const difficultyOptions = [
    { value: "beginner", label: "מתחיל" },
    { value: "intermediate", label: "בינוני" },
    { value: "advanced", label: "מתקדם" },
  ];

  const muscleGroups = [
    "חזה",
    "גב",
    "רגליים",
    "כתפיים",
    "זרועות",
    "ליבה",
    "ביצפס",
    "טריצפס",
    "ריבועים",
    "שוקיים",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />

      {/* Background Overlay */}
      <Animated.View style={[styles.overlay, { opacity: backgroundOpacity }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: colors.background || "#FFFFFF",
          },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border || "#E5E5E7" },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text || "#000"} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text
              style={[styles.headerTitle, { color: colors.text || "#000" }]}
            >
              סינון אימונים
            </Text>
            {activeFiltersCount > 0 && (
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.textSecondary || "#666" },
                ]}
              >
                {activeFiltersCount} מסננים פעילים
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={clearAllFilters}
            style={styles.clearButton}
          >
            <Text
              style={[
                styles.clearButtonText,
                { color: colors.error || "#FF3B30" },
              ]}
            >
              נקה הכל
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date Range Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.text || "#000" }]}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.text || "#000"}
              />{" "}
              טווח תאריכים
            </Text>
            <DateRangePicker
              dateFrom={localFilters.dateFrom}
              dateTo={localFilters.dateTo}
              onDateFromChange={(date) => updateFilter("dateFrom", date)}
              onDateToChange={(date) => updateFilter("dateTo", date)}
            />
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.text || "#000" }]}
            >
              <Ionicons
                name="star-outline"
                size={16}
                color={colors.text || "#000"}
              />{" "}
              דירוג
            </Text>
            <RatingSelector
              selectedRating={localFilters.rating}
              onRatingChange={(rating) => updateFilter("rating", rating)}
            />
          </View>

          {/* Difficulty Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.text || "#000" }]}
            >
              <Ionicons
                name="trending-up-outline"
                size={16}
                color={colors.text || "#000"}
              />{" "}
              רמת קושי
            </Text>
            <View style={styles.tagsContainer}>
              {difficultyOptions.map((option) => (
                <FilterTag
                  key={option.value}
                  label={option.label}
                  active={localFilters.difficulty === option.value}
                  onPress={() =>
                    updateFilter(
                      "difficulty",
                      localFilters.difficulty === option.value
                        ? undefined
                        : option.value
                    )
                  }
                />
              ))}
            </View>
          </View>

          {/* Duration Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.text || "#000" }]}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.text || "#000"}
              />{" "}
              משך זמן
            </Text>
            <DurationSelector
              minDuration={localFilters.minDuration}
              maxDuration={localFilters.maxDuration}
              onMinDurationChange={(duration) =>
                updateFilter("minDuration", duration)
              }
              onMaxDurationChange={(duration) =>
                updateFilter("maxDuration", duration)
              }
            />
          </View>

          {/* Muscle Groups Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.text || "#000" }]}
            >
              <Ionicons
                name="body-outline"
                size={16}
                color={colors.text || "#000"}
              />{" "}
              קבוצות שרירים
            </Text>
            <View style={styles.tagsContainer}>
              {muscleGroups.map((muscle) => (
                <FilterTag
                  key={muscle}
                  label={muscle}
                  active={localFilters.muscles?.includes(muscle) || false}
                  onPress={() => {
                    const currentMuscles = localFilters.muscles || [];
                    const newMuscles = currentMuscles.includes(muscle)
                      ? currentMuscles.filter((m) => m !== muscle)
                      : [...currentMuscles, muscle];
                    updateFilter(
                      "muscles",
                      newMuscles.length > 0 ? newMuscles : undefined
                    );
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { borderTopColor: colors.border || "#E5E5E7" },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.applyButton,
              { backgroundColor: colors.primary || "#007AFF" },
            ]}
            onPress={applyFilters}
          >
            <Text style={[styles.applyButtonText, { color: "#FFFFFF" }]}>
              החל מסננים ({activeFiltersCount})
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  clearButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "right",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  filterTagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
  ratingOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  dateRangeContainer: {
    gap: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    marginBottom: 8,
  },
  dateOptionsContainer: {
    gap: 8,
  },
  dateOptionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 14,
  },
  clearDateButton: {
    padding: 4,
  },
  durationContainer: {
    gap: 16,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
  },
  durationOptionsContainer: {
    gap: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WorkoutFilterModal;
