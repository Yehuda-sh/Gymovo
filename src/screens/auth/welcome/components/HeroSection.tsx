// src/screens/auth/welcome/components/HeroSection.tsx - עם לחיצה על לוגו

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { HeroSectionProps, welcomeColors } from "../types";

// עדכון הטיפוס כדי לכלול את פונקציית הלחיצה
interface HeroSectionWithTapProps extends HeroSectionProps {
  onLogoPress?: () => void;
}

export const HeroSection: React.FC<HeroSectionWithTapProps> = ({
  fadeAnim,
  logoScale,
  titleSlide,
  subtitleSlide,
  onLogoPress,
}) => {
  return (
    <Animated.View style={[styles.heroContainer, { opacity: fadeAnim }]}>
      {/* לוגו עם אפשרות לחיצה */}
      <TouchableOpacity
        onPress={onLogoPress}
        activeOpacity={onLogoPress ? 0.8 : 1}
        disabled={!onLogoPress}
        style={styles.logoContainer}
      >
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {/* לוגו - כרגע אייקון זמני */}
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>

          {/* אפקט זוהר עדין */}
          <View style={styles.logoGlow} />
        </Animated.View>
      </TouchableOpacity>

      {/* כותרת ראשית */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [{ translateY: titleSlide }],
          },
        ]}
      >
        <Text style={styles.title}>Gymovo</Text>
        <View style={styles.accentLine} />
      </Animated.View>

      {/* תת-כותרת */}
      <Animated.View
        style={[
          styles.subtitleContainer,
          {
            transform: [{ translateY: subtitleSlide }],
          },
        ]}
      >
        <Text style={styles.subtitle}>התוכנית האישית שלך לחדר הכושר</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: welcomeColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: welcomeColors.logoGlow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 48,
    color: "#fff",
  },
  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: welcomeColors.logoGlow,
    opacity: 0.1,
    top: -10,
    left: -10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: welcomeColors.text,
    textAlign: "center",
    letterSpacing: -1,
  },
  accentLine: {
    width: 60,
    height: 4,
    backgroundColor: welcomeColors.accentLine,
    borderRadius: 2,
    marginTop: 12,
  },
  subtitleContainer: {
    paddingHorizontal: 40,
  },
  subtitle: {
    fontSize: 18,
    color: welcomeColors.subtitle,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "400",
  },
});

export default HeroSection;
