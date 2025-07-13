// src/screens/profile/guest/components/GuestProfileActions.tsx
// רכיב כפתורי הפעולה הראשיים להמרת חשבון

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useWorkoutStore } from "../../../../stores/workoutStore";

interface GuestProfileActionsProps {
  onConvertPress: () => void;
  onSignupPress: () => void;
  slideAnim: Animated.Value;
  pulseAnim: Animated.Value;
}

const GuestProfileActions: React.FC<GuestProfileActionsProps> = ({
  onConvertPress,
  onSignupPress,
  slideAnim,
  pulseAnim,
}) => {
  const workoutsCount = useWorkoutStore((state) => state.workouts.length);

  // אנימציית פעימה לכפתור הראשי
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleConvertPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConvertPress();
  };

  const handleSignupPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSignupPress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: slideAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* כרטיס CTA ראשי - המרת חשבון */}
      <Animated.View
        style={[
          styles.ctaCard,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={handleConvertPress} activeOpacity={0.9}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>🚀 שמור את ההתקדמות שלך</Text>
              <Text style={styles.ctaSubtitle}>
                המר את החשבון שלך בחינם ושמור את כל {workoutsCount} האימונים שלך
              </Text>

              {workoutsCount > 0 && (
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="barbell-outline"
                      size={20}
                      color="rgba(255,255,255,0.8)"
                    />
                    <Text style={styles.statText}>{workoutsCount} אימונים</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color="rgba(255,255,255,0.8)"
                    />
                    <Text style={styles.statText}>יישמרו לתמיד</Text>
                  </View>
                </View>
              )}

              <View style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>המר חשבון עכשיו</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* אפשרות להרשמה רגילה */}
      <View style={styles.alternativeContainer}>
        <Text style={styles.alternativeText}>או</Text>
        <TouchableOpacity
          style={styles.alternativeButton}
          onPress={handleSignupPress}
        >
          <Text style={styles.alternativeButtonText}>
            צור חשבון חדש (ללא שמירת נתונים)
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  ctaCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  ctaGradient: {
    padding: 24,
  },
  ctaContent: {
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  alternativeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  alternativeText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  alternativeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  alternativeButtonText: {
    fontSize: 14,
    color: "#60A5FA",
    textDecorationLine: "underline",
  },
});

export default GuestProfileActions;
