// src/screens/auth/signup/components/HeaderSection.tsx - משופר

import React, { memo, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderSectionProps, signupColors } from "../types";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

const HeaderSection: React.FC<HeaderSectionProps> = memo(
  ({ fadeAnim, slideAnim, headerScale }) => {
    // אנימציות נוספות
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      // אנימציית פעימה עדינה לאייקון
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // אנימציית סיבוב עדינה
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // אנימציית זוהר
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, [pulseAnim, rotateAnim, glowAnim]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "5deg"],
    });

    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: headerScale }, { translateY: slideAnim }],
          },
        ]}
        accessibilityLabel="איזור כותרת הרשמה"
        accessibilityRole="header"
      >
        {/* אייקון עם אפקטים */}
        <Animated.View
          style={[
            styles.logoIcon,
            {
              transform: [{ scale: pulseAnim }, { rotate: spin }],
              shadowOpacity: glowAnim,
            },
          ]}
        >
          <Ionicons
            name="person-add"
            size={isSmallDevice ? 28 : 32}
            color="#fff"
            accessibilityLabel="סמל משתמש חדש"
          />
        </Animated.View>

        {/* כותרת ראשית */}
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="הרשמה"
        >
          הרשמה
        </Text>

        {/* קו דקורטיבי */}
        <View style={styles.accentLineContainer}>
          <View style={[styles.accentLine, styles.accentLineLeft]} />
          <View style={[styles.accentLine, styles.accentLineCenter]} />
          <View style={[styles.accentLine, styles.accentLineRight]} />
        </View>

        {/* תת כותרת */}
        <Text style={styles.subtitle} accessibilityRole="text">
          הצטרף לקהילת המתאמנים הגדולה בישראל
          {"\n"}
          ותתחיל את המסע שלך לכושר מושלם
        </Text>

        {/* תגיות יתרונות */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={signupColors.accent}
            />
            <Text style={styles.tagText}>ללא עלות</Text>
          </View>
          <View style={styles.tag}>
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={signupColors.accent}
            />
            <Text style={styles.tagText}>מאובטח</Text>
          </View>
          <View style={styles.tag}>
            <Ionicons name="flash" size={14} color={signupColors.accent} />
            <Text style={styles.tagText}>מהיר</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
);

// שם לדיבוג
HeaderSection.displayName = "HeaderSection";

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginBottom: isSmallDevice ? 20 : 30,
    paddingHorizontal: 20,
  },
  logoIcon: {
    width: isSmallDevice ? 60 : 68,
    height: isSmallDevice ? 60 : 68,
    borderRadius: isSmallDevice ? 30 : 34,
    backgroundColor: signupColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: signupColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  accentLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  accentLine: {
    height: 3,
    borderRadius: 2,
  },
  accentLineLeft: {
    width: 20,
    backgroundColor: signupColors.primary,
    opacity: 0.6,
  },
  accentLineCenter: {
    width: 40,
    backgroundColor: signupColors.secondary,
  },
  accentLineRight: {
    width: 20,
    backgroundColor: signupColors.primary,
    opacity: 0.6,
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 15,
    color: signupColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.2)",
  },
  tagText: {
    fontSize: 12,
    color: signupColors.accent,
    fontWeight: "600",
  },
});

export default HeaderSection;
