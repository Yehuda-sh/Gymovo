// src/screens/auth/signup/components/SecurityNote.tsx
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  useColorScheme,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SecurityNoteProps, signupColors } from "../types";

const SecurityNote: React.FC<SecurityNoteProps> = React.memo(({ visible }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // אנימציות משופרות עם useCallback
  const startAnimations = useCallback(() => {
    if (!visible) return;

    // אנימציות מקבילות לביצועים טובים יותר
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [visible, fadeAnim, glowAnim]);

  useEffect(() => {
    startAnimations();

    // ניקוי אנימציות
    return () => {
      fadeAnim.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, [startAnimations, fadeAnim, glowAnim]);

  // צבעים דינמיים לפי תמה
  const dynamicColors = useMemo(
    () => ({
      securityBorder: isDark ? "#4a5568" : signupColors.securityBorder,
      primaryGlow: isDark ? "#667eea" : signupColors.primaryGlow,
      securityBackground: isDark
        ? "rgba(26, 32, 44, 0.95)"
        : signupColors.securityBackground,
      securityText: isDark ? "#e2e8f0" : signupColors.securityText,
      success: isDark ? "#48bb78" : signupColors.success,
      info: isDark ? "#63b3ed" : signupColors.info,
    }),
    [isDark]
  );

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel="הנתונים שלך מוגנים בהצפנה מתקדמת"
      accessibilityHint="האפליקציה משתמשת בהצפנה ברמה הגבוהה ביותר"
      accessible={true}
      importantForAccessibility="yes"
    >
      <LinearGradient
        colors={[dynamicColors.securityBorder, dynamicColors.primaryGlow]}
        style={styles.border}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={[
            styles.content,
            { backgroundColor: dynamicColors.securityBackground },
          ]}
        >
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.iconGlow,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.6],
                  }),
                  transform: [
                    {
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={dynamicColors.success}
              style={styles.icon}
            />
          </View>

          <Text style={[styles.text, { color: dynamicColors.securityText }]}>
            הנתונים שלך מוגנים בהצפנה מתקדמת
          </Text>

          <View style={styles.indicators}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ]}
            >
              <Ionicons
                name="lock-closed"
                size={12}
                color={dynamicColors.info}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.indicator,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.6],
                  }),
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={dynamicColors.success}
              />
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

SecurityNote.displayName = "SecurityNote";

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  border: {
    padding: 1.5,
    borderRadius: 14,
  },
  content: {
    borderRadius: 12.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  iconContainer: {
    position: "relative",
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(72, 187, 120, 0.3)",
  },
  icon: {
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  indicators: {
    flexDirection: "row",
    marginLeft: 10,
    gap: 6,
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SecurityNote;
