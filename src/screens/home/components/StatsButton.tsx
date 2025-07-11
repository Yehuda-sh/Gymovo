// src/screens/home/components/StatsButton.tsx
// כפתור סטטיסטיקות עם RTL אמיתי - פריסה ישראלית נכונה

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { DashboardData } from "../types";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";
import WeeklyStats from "./WeeklyStats";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface StatsButtonProps {
  dashboardData: DashboardData | null;
}

/**
 * Stats button with proper RTL layout - Israeli app style
 */
const StatsButton: React.FC<StatsButtonProps> = ({ dashboardData }) => {
  const { isSmallDevice, screenPadding } = useResponsiveDimensions();
  const [modalVisible, setModalVisible] = useState(false);

  const stats = dashboardData?.weeklyStats || {
    completedWorkouts: 0,
    totalWeightLifted: 0,
    totalDuration: 0,
    streak: 0,
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(false);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}`
      : `${mins}`;
  };

  const styles = StyleSheet.create({
    // RTL Container - כפתור מוקם בצד ימין
    container: {
      flexDirection: "row", // RTL container
      alignItems: "center",
      justifyContent: "flex-end", // כפתור דבוק לצד ימין
      paddingHorizontal: screenPadding,
      marginBottom: theme.spacing.sm,
    },
    // הכפתור עצמו - פריסה RTL פנימית
    statsButton: {
      flexDirection: "row", // RTL פנימי - אייקון לפני טקסט
      alignItems: "center",
      backgroundColor: "transparent", // רקע שקוף לגרדיאנט
      borderRadius: 16,
      paddingHorizontal: isSmallDevice ? theme.spacing.md : theme.spacing.lg,
      paddingVertical: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      // התאמה לתוכן - לא למלא את כל הרוחב
      minWidth: isSmallDevice ? 140 : 160,
    },
    // אייקון בתחילת הכפתור (צד ימין)
    iconContainer: {
      width: isSmallDevice ? 32 : 36,
      height: isSmallDevice ? 32 : 36,
      borderRadius: isSmallDevice ? 16 : 18,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.sm, // RTL - מרווח מימין (אחרי האייקון)
    },
    // טקסט אחרי האייקון
    textContainer: {
      flex: 1,
      alignItems: "flex-end", // RTL - טקסט מיושר לימין
    },
    mainText: {
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "right", // RTL
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    statsText: {
      fontSize: isSmallDevice ? 11 : 12,
      color: "rgba(255, 255, 255, 0.85)",
      textAlign: "right", // RTL
      fontWeight: "600",
      marginTop: 1,
    },
    // Modal styles (RTL)
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.lg,
      borderRadius: 20,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 25,
      maxHeight: "80%",
      minWidth: "85%",
    },
    modalHeader: {
      flexDirection: "row", // RTL - כותרת מימין, כפתור משמאל
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.colors.text,
      textAlign: "right", // RTL
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
      // כפתור סגירה בצד שמאל (כפתור משני)
    },
  });

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.statsButton}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* אייקון ראשון (צד ימין) - RTL */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="stats-chart"
              size={isSmallDevice ? 16 : 18}
              color="rgba(255, 255, 255, 0.95)"
            />
          </View>

          {/* טקסט אחרי האייקון - RTL */}
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>סטטיסטיקות</Text>
            <Text style={styles.statsText}>
              {stats.completedWorkouts} אימונים •{" "}
              {formatDuration(stats.totalDuration)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal RTL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              {/* כותרת מימין - RTL */}
              <Text style={styles.modalTitle}>הסטטיסטיקות שלך</Text>

              {/* כפתור סגירה משמאל - RTL */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Ionicons name="close" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <WeeklyStats dashboardData={dashboardData} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default StatsButton;
