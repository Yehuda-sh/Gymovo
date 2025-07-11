// src/screens/auth/welcome/components/ActionButtons.tsx - עם Touch Feedback

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
} from "react-native";
import { ActionButtonsProps } from "../types";
import { rtlStyles } from "../../../../theme/rtl";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// צבעים ישראליים
const newColors = {
  primary: "#FF6B35", // כתום חם ראשי
  secondary: "#F7931E", // כתום זהוב
  accent: "#FFD23F", // צהוב זהב
  dark: "#2C1810", // חום כהה
  glow: "rgba(255, 107, 53, 0.3)",
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSignup,
  onLogin,
  buttonsSlide,
  fadeAnim,
}) => {
  // אנימציות לכפתורים
  const primaryButtonScale = useRef(new Animated.Value(1)).current;
  const secondaryButtonScale = useRef(new Animated.Value(1)).current;

  // Touch Feedback לכפתור ראשי
  const handlePrimaryPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(primaryButtonScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePrimaryPressOut = () => {
    Animated.spring(primaryButtonScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    // עיכוב קטן למראה מלוטש
    setTimeout(() => {
      onSignup();
    }, 100);
  };

  // Touch Feedback לכפתור משני
  const handleSecondaryPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(secondaryButtonScale, {
      toValue: 0.97,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleSecondaryPressOut = () => {
    Animated.spring(secondaryButtonScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onLogin();
    }, 100);
  };

  return (
    <Animated.View
      style={[
        styles.buttonsContainer,
        rtlStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: buttonsSlide }],
        },
      ]}
    >
      {/* מונה משתמשים */}
      <View style={styles.socialProofContainer}>
        <Text style={[styles.socialProofText, rtlStyles.text]}>
          כבר 1,247 ישראלים השיגו את המטרות שלהם 🎯
        </Text>
      </View>

      {/* כפתור ראשי עם אנימציה */}
      <Animated.View style={{ transform: [{ scale: primaryButtonScale }] }}>
        <TouchableOpacity
          style={[styles.primaryButton]}
          onPressIn={handlePrimaryPressIn}
          onPressOut={handlePrimaryPressOut}
          activeOpacity={1} // נשלוט באנימציה בעצמנו
        >
          <Text style={[styles.primaryButtonText, rtlStyles.text]}>
            בואו נבנה את התוכנית שלך! 💪
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* כפתור משני עם אנימציה */}
      <Animated.View style={{ transform: [{ scale: secondaryButtonScale }] }}>
        <TouchableOpacity
          style={[styles.secondaryButton]}
          onPressIn={handleSecondaryPressIn}
          onPressOut={handleSecondaryPressOut}
          activeOpacity={1}
        >
          <Text style={[styles.secondaryButtonText, rtlStyles.text]}>
            יש לי חשבון
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* טקסט עזרה - מעל הכפתורים */}
      <View style={styles.helpTextContainer}>
        <Text style={[styles.helpText, rtlStyles.text]}>
          💚 התחל בחינם • אין מחויבות • בטל בכל עת
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16, // פחות padding
    gap: 16,
    width: "100%",
    alignItems: "stretch",
  },
  // Social Proof
  socialProofContainer: {
    marginBottom: 12, // פחות margin
    paddingHorizontal: 12,
  },
  socialProofText: {
    fontSize: 14,
    color: newColors.accent,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  // כפתור ראשי - כתום חם
  primaryButton: {
    backgroundColor: newColors.primary,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: newColors.glow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: newColors.secondary,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  // כפתור משני - עדין וקטן יותר
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12, // קטן יותר
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  secondaryButtonText: {
    fontSize: 14, // קטן יותר
    fontWeight: "500", // פחות בולט
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  // טקסט עזרה - הסרתי לגמרי
  helpTextContainer: {
    display: "none", // מסתיר את הטקסט לגמרי
  },
  helpText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.8,
  },
});

export default ActionButtons;
