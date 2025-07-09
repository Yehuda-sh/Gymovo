// src/components/workout-history/WorkoutFilters.tsx
// רכיבי סינון מתקדמים לניהול היסטוריית אימונים עם ממשק נוח וחוויית משתמש מעולה

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WorkoutHistoryFilters, modernColors } from "./types";

// רכיב גלולות הסינון - מציג בצורה ויזואלית את הסינונים הפעילים עם אפשרות הסרה
export const FilterPills = ({
  filters,
  onRemoveFilter,
}: {
  filters: WorkoutHistoryFilters;
  onRemoveFilter: (key: keyof WorkoutHistoryFilters) => void;
}) => {
  // פונקציה לפרמוט תויות הסינון - הופכת ערכים טכניים לטקסט ידידותי למשתמש
  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case "dateRange":
        const labels = {
          week: "שבוע אחרון",
          month: "חודש אחרון",
          "3months": "3 חודשים",
          all: "הכל",
        };
        return labels[value as keyof typeof labels];
      case "minRating":
        return `דירוג ${value}+`;
      case "minDuration":
        return `מעל ${value} דקות`;
      default:
        return value;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterPillsContainer}
      contentContainerStyle={styles.filterPillsContent}
    >
      {Object.entries(filters).map(([key, value]) => (
        <MotiView
          key={key}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
        >
          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRemoveFilter(key as keyof WorkoutHistoryFilters);
            }}
          >
            <Text style={styles.filterPillText}>
              {getFilterLabel(key, value)}
            </Text>
            <Ionicons
              name="close-circle"
              size={16}
              color={modernColors.primary}
            />
          </TouchableOpacity>
        </MotiView>
      ))}
    </ScrollView>
  );
};

// מודאל סינון מתקדם - מאפשר בחירה מורכבת של מספר פרמטרי סינון
export const WorkoutFilterModal = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
}: {
  visible: boolean;
  onClose: () => void;
  filters: WorkoutHistoryFilters;
  onApplyFilters: (filters: WorkoutHistoryFilters) => void;
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <BlurView intensity={100} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={modernColors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>סינון אימונים</Text>
            <TouchableOpacity
              onPress={() => {
                setTempFilters({});
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }}
            >
              <Text style={styles.clearFiltersText}>נקה הכל</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* סינון תקופת זמן */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>תקופת זמן</Text>
              <View style={styles.filterOptions}>
                {["week", "month", "3months", "all"].map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterOption,
                      tempFilters.dateRange === range &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setTempFilters({
                        ...tempFilters,
                        dateRange: range as any,
                      });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.dateRange === range &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {range === "week" && "שבוע"}
                      {range === "month" && "חודש"}
                      {range === "3months" && "3 חודשים"}
                      {range === "all" && "הכל"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* סינון דירוג */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>דירוג מינימלי</Text>
              <View style={styles.filterOptions}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.filterOption,
                      tempFilters.minRating === rating &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setTempFilters({ ...tempFilters, minRating: rating });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={styles.ratingOption}>
                      <Ionicons
                        name="star"
                        size={16}
                        color={modernColors.warning}
                      />
                      <Text
                        style={[
                          styles.filterOptionText,
                          tempFilters.minRating === rating &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {rating}+
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* סינון משך אימון */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>משך אימון מינימלי</Text>
              <View style={styles.filterOptions}>
                {[15, 30, 45, 60].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.filterOption,
                      tempFilters.minDuration === duration &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setTempFilters({ ...tempFilters, minDuration: duration });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.minDuration === duration &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {duration} דקות
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onApplyFilters(tempFilters);
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                onClose();
              }}
            >
              <LinearGradient
                colors={modernColors.primaryGradient as any}
                style={styles.gradientButton}
              >
                <Text style={styles.applyButtonText}>החל סינון</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

// סטיילים לרכיבי הסינון - עיצוב מודרני עם אנימציות ומודאל מעוצב
const styles = StyleSheet.create({
  filterPillsContainer: {
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  filterPillsContent: {
    gap: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: modernColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterPillText: {
    fontSize: 14,
    color: modernColors.primary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: modernColors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: modernColors.text,
  },
  clearFiltersText: {
    fontSize: 16,
    color: modernColors.primary,
    fontWeight: "600",
  },
  modalBody: {
    flex: 1,
    paddingVertical: 20,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: modernColors.border,
    backgroundColor: "white",
  },
  filterOptionActive: {
    backgroundColor: modernColors.primary,
    borderColor: modernColors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: modernColors.text,
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "white",
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: modernColors.border,
  },
  applyButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
