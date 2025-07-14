// src/screens/auth/welcome/components/HeroSection.tsx - מותאם למובייל

import React, { useEffect, useRef, memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeroSectionProps, welcomeColors } from "../types";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 700;
const isTinyDevice = height < 600;

// Theme colors
const heroColors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  accent: "#FFD23F",
  dark: "#2C1810",
  glow: "rgba(255, 107, 53, 0.3)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.85)",
  textMuted: "rgba(255, 255, 255, 0.7)",
  divider: "rgba(255, 255, 255, 0.2)",
  surface: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.1)",
};

// Animation config
const ANIMATION_CONFIG = {
  breathing: {
    scale: 1.05,
    duration: 2000,
  },
  glow: {
    minOpacity: 0.3,
    maxOpacity: 0.5,
    duration: 1500,
  },
  logoPress: {
    scaleDown: 0.9,
    duration: 100,
    tension: 300,
    friction: 10,
  },
};

// Stats data (could be dynamic in future)
const HERO_STATS = [
  { icon: "trophy", value: "1,247", label: "הישגים" },
  { icon: "flame", value: "מתאמנים", label: "פעילים" },
  { icon: "star", value: "4.9", label: "דירוג" },
];

export const HeroSection: React.FC<HeroSectionProps> = memo(
  ({ fadeAnim, logoScale, titleSlide, subtitleSlide, onLogoPress }) => {
    // Animations
    const breathingScale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(
      new Animated.Value(ANIMATION_CONFIG.glow.minOpacity)
    ).current;
    const statsOpacity = useRef(new Animated.Value(0)).current;

    // Start breathing animation
    useEffect(() => {
      // Breathing animation
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingScale, {
            toValue: ANIMATION_CONFIG.breathing.scale,
            duration: ANIMATION_CONFIG.breathing.duration,
            useNativeDriver: true,
          }),
          Animated.timing(breathingScale, {
            toValue: 1.0,
            duration: ANIMATION_CONFIG.breathing.duration,
            useNativeDriver: true,
          }),
        ])
      );

      // Glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: ANIMATION_CONFIG.glow.maxOpacity,
            duration: ANIMATION_CONFIG.glow.duration,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: ANIMATION_CONFIG.glow.minOpacity,
            duration: ANIMATION_CONFIG.glow.duration,
            useNativeDriver: true,
          }),
        ])
      );

      // Stats fade in
      const statsAnimation = Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      });

      breathingAnimation.start();
      glowAnimation.start();
      statsAnimation.start();

      // Cleanup
      return () => {
        breathingAnimation.stop();
        glowAnimation.stop();
        statsAnimation.stop();
      };
    }, [breathingScale, glowOpacity, statsOpacity]);

    // Handle logo press
    const handleLogoPress = useCallback(() => {
      if (!onLogoPress) return;

      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: ANIMATION_CONFIG.logoPress.scaleDown,
          duration: ANIMATION_CONFIG.logoPress.duration,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: ANIMATION_CONFIG.logoPress.tension,
          friction: ANIMATION_CONFIG.logoPress.friction,
          useNativeDriver: true,
        }),
      ]).start();

      onLogoPress();
    }, [onLogoPress, logoScale]);

    // Render stat item
    const renderStatItem = useCallback(
      (stat: (typeof HERO_STATS)[0], index: number) => (
        <React.Fragment key={stat.icon}>
          <View style={styles.featureItem}>
            <Ionicons
              name={stat.icon as any}
              size={isTinyDevice ? 16 : 20}
              color={heroColors.accent}
            />
            <Text style={styles.featureText}>{stat.value}</Text>
          </View>
          {index < HERO_STATS.length - 1 && (
            <View style={styles.featureDivider} />
          )}
        </React.Fragment>
      ),
      []
    );

    return (
      <Animated.View style={[styles.heroContainer, { opacity: fadeAnim }]}>
        {/* Logo */}
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={onLogoPress ? 0.9 : 1}
          style={styles.logoTouchable}
          disabled={!onLogoPress}
          accessible={true}
          accessibilityLabel="לוגו Gymovo"
          accessibilityHint={
            onLogoPress ? "לחץ 3 פעמים למצב מפתחים" : undefined
          }
        >
          <View style={styles.logoContainer}>
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.logoGlow,
                {
                  opacity: glowOpacity,
                  transform: [{ scale: breathingScale }],
                },
              ]}
            />
            {/* Logo icon */}
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
                size={isTinyDevice ? 36 : isSmallDevice ? 40 : 48}
                color={heroColors.textPrimary}
              />
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            { transform: [{ translateY: titleSlide }] },
          ]}
        >
          <Text style={styles.title}>Gymovo</Text>
          <View style={styles.accentLine} />
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            { transform: [{ translateY: subtitleSlide }] },
          ]}
        >
          <Text style={styles.subtitle}>
            האפליקציה שתעזור לך להגיע לגרסה הטובה ביותר של עצמך
          </Text>
        </Animated.View>

        {/* Features/Stats row */}
        <Animated.View
          style={[
            styles.featuresRow,
            {
              opacity: Animated.multiply(fadeAnim, statsOpacity),
              transform: [{ translateY: subtitleSlide }],
            },
          ]}
        >
          {HERO_STATS.map(renderStatItem)}
        </Animated.View>

        {/* Motivational tag */}
        <Animated.View
          style={[
            styles.tagContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: breathingScale }],
            },
          ]}
        >
          <Text style={styles.tagText}>מוכן לשינוי? ✨</Text>
        </Animated.View>
      </Animated.View>
    );
  }
);

HeroSection.displayName = "HeroSection";

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: "center",
    paddingVertical: isTinyDevice ? 16 : isSmallDevice ? 20 : 30,
    paddingHorizontal: 20,
  },
  logoTouchable: {
    marginBottom: isTinyDevice ? 12 : isSmallDevice ? 15 : 20,
  },
  logoContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: isTinyDevice ? 80 : isSmallDevice ? 90 : 100,
    height: isTinyDevice ? 80 : isSmallDevice ? 90 : 100,
    borderRadius: isTinyDevice ? 40 : isSmallDevice ? 45 : 50,
    backgroundColor: heroColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: heroColors.glow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  logoGlow: {
    position: "absolute",
    width: isTinyDevice ? 100 : isSmallDevice ? 110 : 120,
    height: isTinyDevice ? 100 : isSmallDevice ? 110 : 120,
    borderRadius: isTinyDevice ? 50 : isSmallDevice ? 55 : 60,
    backgroundColor: heroColors.accent,
    opacity: 0.3,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: isTinyDevice ? 6 : isSmallDevice ? 8 : 12,
  },
  title: {
    fontSize: isTinyDevice ? 36 : isSmallDevice ? 40 : 48,
    fontWeight: "700",
    color: heroColors.textPrimary,
    textAlign: "center",
    letterSpacing: -1,
  },
  accentLine: {
    width: 50,
    height: 3,
    backgroundColor: heroColors.secondary,
    borderRadius: 2,
    marginTop: isTinyDevice ? 6 : 8,
  },
  subtitleContainer: {
    paddingHorizontal: width > 400 ? 40 : 30,
    marginBottom: isTinyDevice ? 12 : isSmallDevice ? 15 : 20,
  },
  subtitle: {
    fontSize: isTinyDevice ? 14 : isSmallDevice ? 15 : 16,
    color: heroColors.textSecondary,
    textAlign: "center",
    lineHeight: isTinyDevice ? 20 : isSmallDevice ? 22 : 24,
    fontWeight: "400",
  },
  featuresRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTinyDevice ? 12 : isSmallDevice ? 15 : 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    fontSize: isTinyDevice ? 12 : 13,
    color: heroColors.textMuted,
    fontWeight: "500",
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: heroColors.divider,
    marginHorizontal: isTinyDevice ? 8 : 12,
  },
  tagContainer: {
    backgroundColor: heroColors.surface,
    paddingHorizontal: isTinyDevice ? 14 : 16,
    paddingVertical: isTinyDevice ? 6 : 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: heroColors.border,
  },
  tagText: {
    fontSize: isTinyDevice ? 12 : 14,
    color: heroColors.accent,
    fontWeight: "600",
  },
});

export default HeroSection;
