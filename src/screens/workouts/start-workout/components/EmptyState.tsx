// src/screens/workouts/start-workout/components/EmptyState.tsx
// רכיב מצב ריק עם אנימציות ועיצוב משופר

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Easing,
} from "react-native";

import { colors, withOpacity } from "../../../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface EmptyStateProps {
  onCreatePlan: () => void;
  onStartQuickWorkout?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onCreatePlan,
  onStartQuickWorkout,
}) => {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for buttons
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

    // Rotate animation for icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Animated Icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { translateY: floatAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        {/* Background circles */}
        <View style={styles.circleContainer}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        {/* Main icon */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="barbell" size={60} color="white" />
        </LinearGradient>
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>אין תוכניות אימון עדיין</Text>
        <Text style={styles.subtitle}>
          צור תוכנית מותאמת אישית או התחל{"\n"}אימון מהיר כדי להתחיל להתאמן
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Primary Button */}
        <Animated.View
          style={[
            styles.primaryButtonContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <TouchableOpacity
            onPress={onCreatePlan}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add-circle" size={24} color="white" />
              <Text style={styles.primaryButtonText}>צור תוכנית חדשה</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary Button */}
        {onStartQuickWorkout && (
          <TouchableOpacity
            onPress={onStartQuickWorkout}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <View style={styles.secondaryContent}>
              <Ionicons name="flash" size={20} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>אימון מהיר</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Decorative elements */}
      <View style={styles.decorativeElements}>
        <Animated.View
          style={[
            styles.dot,
            styles.dot1,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            styles.dot2,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            styles.dot3,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
    position: "relative",
  },
  circleContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.1),
  },
  circle1: {
    width: 120,
    height: 120,
  },
  circle2: {
    width: 160,
    height: 160,
  },
  circle3: {
    width: 200,
    height: 200,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 24,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  primaryButtonContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.3,
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: withOpacity(colors.primary, 0.3),
    backgroundColor: withOpacity(colors.primary, 0.05),
  },
  secondaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  dot: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  dot1: {
    width: 60,
    height: 60,
    top: 80,
    left: 20,
  },
  dot2: {
    width: 40,
    height: 40,
    top: 200,
    right: 30,
  },
  dot3: {
    width: 80,
    height: 80,
    bottom: 100,
    left: -20,
  },
});

export default EmptyState;
