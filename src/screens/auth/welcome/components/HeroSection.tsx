// src/screens/auth/welcome/components/HeroSection.tsx - מותאם למובייל

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeroSectionProps, welcomeColors } from "../types";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

// צבעים ישראליים
const newColors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  accent: "#FFD23F",
  dark: "#2C1810",
  glow: "rgba(255, 107, 53, 0.3)",
};

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
  // אנימציית נשימה ללוגו
  const breathingScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // אנימציית נשימה
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathingScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breathingScale, {
          toValue: 1.0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // אנימציית זוהר
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // טיפול בלחיצה על לוגו
  const handleLogoPress = () => {
    if (onLogoPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      onLogoPress();
    }
  };

  return (
    <Animated.View style={[styles.heroContainer, { opacity: fadeAnim }]}>
      {/* לוגו קומפקטי יותר */}
      <TouchableOpacity
        onPress={handleLogoPress}
        activeOpacity={onLogoPress ? 0.9 : 1}
        style={styles.logoTouchable}
        disabled={!onLogoPress}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: breathingScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.logoIcon,
              {
                transform: [{ scale: logoScale }, { scale: breathingScale }],
              },
            ]}
          >
            <Ionicons
              name="barbell"
              size={isSmallDevice ? 40 : 48}
              color="#fff"
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* כותרת קומפקטית */}
      <Animated.View
        style={[
          styles.titleContainer,
          { transform: [{ translateY: titleSlide }] },
        ]}
      >
        <Text style={styles.title}>Gymovo</Text>
        <View style={styles.accentLine} />
      </Animated.View>

      {/* כותרת משנה קצרה יותר */}
      <Animated.View
        style={[
          styles.subtitleContainer,
          { transform: [{ translateY: subtitleSlide }] },
        ]}
      >
        <Text style={styles.subtitle}>
          האפליקציה שתעזור לך לנפץ את הגרסה הטובה ביותר של עצמך
        </Text>
      </Animated.View>

      {/* שורת אייקונים במקום טקסט נוסף */}
      <Animated.View
        style={[
          styles.featuresRow,
          {
            opacity: fadeAnim,
            transform: [{ translateY: subtitleSlide }],
          },
        ]}
      >
        <View style={styles.featureItem}>
          <Ionicons name="trophy" size={20} color={newColors.accent} />
          <Text style={styles.featureText}>1,247</Text>
        </View>
        <View style={styles.featureDivider} />
        <View style={styles.featureItem}>
          <Ionicons name="flame" size={20} color={newColors.accent} />
          <Text style={styles.featureText}>מתאמנים</Text>
        </View>
        <View style={styles.featureDivider} />
        <View style={styles.featureItem}>
          <Ionicons name="star" size={20} color={newColors.accent} />
          <Text style={styles.featureText}>4.9</Text>
        </View>
      </Animated.View>

      {/* תגית מוטיבציה קצרה */}
      <Animated.View
        style={[
          styles.tagContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: breathingScale }],
          },
        ]}
      >
        <Text style={styles.tagText}>מוכן להפוך את עצמך? ✨</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: "center",
    paddingVertical: isSmallDevice ? 20 : 30,
    paddingHorizontal: 20,
  },
  logoTouchable: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  logoContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: isSmallDevice ? 90 : 100,
    height: isSmallDevice ? 90 : 100,
    borderRadius: isSmallDevice ? 45 : 50,
    backgroundColor: newColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: newColors.glow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  logoGlow: {
    position: "absolute",
    width: isSmallDevice ? 110 : 120,
    height: isSmallDevice ? 110 : 120,
    borderRadius: isSmallDevice ? 55 : 60,
    backgroundColor: newColors.accent,
    opacity: 0.3,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: isSmallDevice ? 8 : 12,
  },
  title: {
    fontSize: isSmallDevice ? 40 : 48,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -1,
  },
  accentLine: {
    width: 50,
    height: 3,
    backgroundColor: newColors.secondary,
    borderRadius: 2,
    marginTop: 8,
  },
  subtitleContainer: {
    paddingHorizontal: 30,
    marginBottom: isSmallDevice ? 15 : 20,
  },
  subtitle: {
    fontSize: isSmallDevice ? 15 : 16,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: isSmallDevice ? 22 : 24,
    fontWeight: "400",
  },
  featuresRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isSmallDevice ? 15 : 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 12,
  },
  tagContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tagText: {
    fontSize: 14,
    color: newColors.accent,
    fontWeight: "600",
  },
});

export default HeroSection;
