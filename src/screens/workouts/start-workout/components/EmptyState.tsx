// src/screens/workouts/start-workout/components/EmptyState.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../theme/colors";

interface EmptyStateProps {
  onCreatePlan: () => void;
  onStartQuickWorkout: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreatePlan,
  onStartQuickWorkout,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.iconGradient}
        >
          <Ionicons name="barbell-outline" size={60} color="white" />
        </LinearGradient>
      </View>

      <Text style={styles.title}>אין תוכניות אימון</Text>
      <Text style={styles.subtitle}>
        צור תוכנית אימון מותאמת אישית או התחל אימון חופשי
      </Text>

      <TouchableOpacity style={styles.createButton} onPress={onCreatePlan}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.createButtonGradient}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.createButtonText}>צור תוכנית חדשה</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickWorkoutButton}
        onPress={onStartQuickWorkout}
      >
        <View style={styles.quickWorkoutContent}>
          <Ionicons name="flash-outline" size={22} color={colors.primary} />
          <Text style={styles.quickWorkoutText}>אימון מהיר</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  createButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  quickWorkoutButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    width: "100%",
  },
  quickWorkoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  quickWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
});
