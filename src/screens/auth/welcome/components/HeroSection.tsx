// src/screens/auth/welcome/components/HeroSection.tsx - עם לוגו נושם

import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, I18nManager } from "react-native";
import { HeroSectionProps, welcomeColors } from "../types";
import { rtlText } from "../../../../theme/rtl";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// צבעים ישראליים חדשים
const newColors = {
  primary: "#FF6B35",     // כתום חם ראשי
  secondary: "#F7931E",   // כתום זהוב  
  accent: "#FFD23F",      // צהוב זהב
  dark: "#2C1810",        // חום כהה
  glow: "rgba(255, 107, 53, 0.3)", // זוהר כתום
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
  const breathingScale = React.useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const breathingAnimation = Animated.loop(
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
    );
    
    breathingAnimation.start();
    
    return () => breathingAnimation.stop();
  }, []);

  // טיפול בלחיצה על לוגו
  const handleLogoPress = () => {
    if (onLogoPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // אנימציה קטנה בלחיצה
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
      {/* לוגו עם נשימה ולחיצה */}
      <TouchableOpacity
        onPress={handleLogoPress}
        activeOpacity={onLogoPress ? 0.8 : 1}
        disabled={!onLogoPress}
        style={styles.logoContainer}
      >
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [
                { scale: Animated.multiply(logoScale, breathingScale) }
              ],
            },
          ]}
        >
          {/* לוגו */}
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          
          {/* זוהר כתום */}
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
        <Text style={[styles.title, rtlText]}>Gymovo</Text>
        <View style={styles.accentLine} />
      </Animated.View>

      {/* תת-כותרת עברית טבעית */}
      <Animated.View
        style={[
          styles.subtitleContainer,
          {
            transform: [{ translateY: subtitleSlide }],
          },
        ]}
      >
        <Text style={[styles.subtitle, rtlText]}>
          האפליקציה שתעזור לך להפוך לגרסה הטובה ביותר של עצמך
        </Text>
      </Animated.View>

      {/* משפט מניע */}
      <Animated.View style={[styles.motivationContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.motivationText, rtlText]}>
          מוכן להפתיע את עצמך? ✨
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: newColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: newColors.glow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  logoEmoji: {
    fontSize: 48,
    color: '#fff',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: newColors.accent,
    opacity: 0.15,
    top: -10,
    left: -10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1,
  },
  accentLine: {
    width: 60,
    height: 4,
    backgroundColor: newColors.secondary,
    borderRadius: 2,
    marginTop: 12,
  },
  subtitleContainer: {
    paddingHorizontal: 30,
    width: '100%',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'right',
    lineHeight: 25,
    fontWeight: '400',
    writingDirection: 'rtl',
  },
  motivationContainer: {
    paddingHorizontal: 40,
  },
  motivationText: {
    fontSize: 16,
    color: newColors.accent,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default HeroSection;