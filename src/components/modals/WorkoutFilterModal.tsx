// src/components/modals/WorkoutFilterModal.tsx - 🔍 Advanced Filter Modal

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
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
import { getCurrentColors } from "../../theme/colors";

const { width, height } = Dimensions.get("window");

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
  const colors = getCurrentColors();

  return (
    <TouchableOpacity
      style={[
        styles.filterTag,
        {
          backgroundColor: active ? colors.primary : colors.background.tertiary,
          borderColor: active ? colors.primary : colors.border.light,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterTagText,
          { color: active ? colors.text.inverse : colors.text.primary },
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
  const colors = getCurrentColors();

  return (
    <View style={styles.ratingContainer}>
      <TouchableOpacity
        style={[
          styles.ratingOption,
          {
            backgroundColor: !selectedRating
              ? colors.primary
              : colors.background.tertiary,
            borderColor: !selectedRating ? colors.primary : colors.border.light,
          },
        ]}
        onPress={() => onRatingChange(undefined)}
      >
        <Text
          style={[
            styles.ratingText,
            {
              color: !selectedRating
                ? colors.text.inverse
                : colors.text.primary,
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
                  ? colors.primary
                  : colors.background.tertiary,
              borderColor:
                selectedRating === rating
                  ? colors.primary
                  : colors.border.light,
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
                    ? colors.text.inverse
                    : star <= rating
                    ? colors.workout.rating.star
                    : colors.workout.rating.starEmpty
                }
              />
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// 📅 Date Range Picker Component
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
  const colors = getCurrentColors();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "בחר תאריך";
    return new Date(dateString).toLocaleDateString("he-IL");
  };

  return (
    <View style={styles.dateRangeContainer}>
      <View style={styles.datePickerRow}>
        <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>
          מתאריך:
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, { borderColor: colors.border.medium }]}
          onPress={() => setShowFromPicker(true)}
        >
          <Text style={[styles.dateButtonText, { color: colors.text.primary }]}>
            {formatDate(dateFrom)}
          </Text>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
        {dateFrom && (
          <TouchableOpacity
            style={styles.clearDateButton}
            onPress={() => onDateFromChange(undefined)}
          >
            <Ionicons name="close-circle" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.datePickerRow}>
        <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>
          עד תאריך:
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, { borderColor: colors.border.medium }]}
          onPress={() => setShowToPicker(true)}
        >
          <Text style={[styles.dateButtonText, { color: colors.text.primary }]}>
            {formatDate(dateTo)}
          </Text>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
        {dateTo && (
          <TouchableOpacity
            style={styles.clearDateButton}
            onPress={() => onDateToChange(undefined)}
          >
            <Ionicons name="close-circle" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={dateFrom ? new Date(dateFrom) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowFromPicker(false);
            if (selectedDate) {
              onDateFromChange(selectedDate.toISOString());
            }
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={dateTo ? new Date(dateTo) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowToPicker(false);
            if (selectedDate) {
              onDateToChange(selectedDate.toISOString());
            }
          }}
        />
      )}
    </View>
  );
};

// 🏃‍♂️ Duration Slider Component
const DurationSlider = ({
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
  const colors = getCurrentColors();
  const [tempMinDuration, setTempMinDuration] = useState(minDuration || 0);
  const [tempMaxDuration, setTempMaxDuration] = useState(maxDuration || 180);

  return (
    <View style={styles.durationContainer}>
      <View style={styles.durationHeader}>
        <Text style={[styles.durationLabel, { color: colors.text.primary }]}>
          משך אימון (דקות)
        </Text>
        <Text style={[styles.durationValue, { color: colors.text.secondary }]}>
          {tempMinDuration} - {tempMaxDuration} דקות
        </Text>
      </View>

      <View style={styles.slidersContainer}>
        <View style={styles.sliderRow}>
          <Text style={[styles.sliderLabel, { color: colors.text.secondary }]}>
            מינימום:
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={180}
            value={tempMinDuration}
            onValueChange={setTempMinDuration}
            onSlidingComplete={(value) =>
              onMinDurationChange(value > 0 ? Math.round(value) : undefined)
            }
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border.light}
            thumbStyle={{ backgroundColor: colors.primary }}
            step={5}
          />
          <Text style={[styles.sliderValue, { color: colors.text.primary }]}>
            {Math.round(tempMinDuration)}
          </Text>
        </View>

        <View style={styles.sliderRow}>
          <Text style={[styles.sliderLabel, { color: colors.text.secondary }]}>
            מקסימום:
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={180}
            value={tempMaxDuration}
            onValueChange={setTempMaxDuration}
            onSlidingComplete={(value) =>
              onMaxDurationChange(value < 180 ? Math.round(value) : undefined)
            }
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border.light}
            thumbStyle={{ backgroundColor: colors.primary }}
            step={5}
          />
          <Text style={[styles.sliderValue, { color: colors.text.primary }]}>
            {Math.round(tempMaxDuration)}
          </Text>
        </View>
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
  const colors = getCurrentColors();
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
  }, [visible]);

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
            backgroundColor: colors.background.modal,
          },
        ]}
      >
        {/* Header */}
        <View
          style={[styles.header, { borderBottomColor: colors.border.light }]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              סינון אימונים
            </Text>
            {activeFiltersCount > 0 && (
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.text.secondary },
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
            <Text style={[styles.clearButtonText, { color: colors.error }]}>
              נקה הכל
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date Range Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.text.primary}
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
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              <Ionicons
                name="star-outline"
                size={16}
                color={colors.text.primary}
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
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              <Ionicons
                name="trending-up-outline"
                size={16}
                color={colors.text.primary}
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
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.text.primary}
              />{" "}
              משך זמן
            </Text>
            <DurationSlider
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
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              <Ionicons
                name="body-outline"
                size={16}
                color={colors.text.primary}
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
        <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={applyFilters}
          >
            <Text
              style={[styles.applyButtonText, { color: colors.text.inverse }]}
            >
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
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500",
    width: 80,
    textAlign: "right",
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  dateButtonText: {
    fontSize: 14,
  },
  clearDateButton: {
    padding: 4,
  },
  durationContainer: {
    gap: 16,
  },
  durationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  durationValue: {
    fontSize: 14,
  },
  slidersContainer: {
    gap: 16,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderLabel: {
    fontSize: 14,
    width: 80,
    textAlign: "right",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "500",
    width: 40,
    textAlign: "center",
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
