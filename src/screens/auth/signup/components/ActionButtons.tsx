// src/screens/auth/signup/components/ActionButtons.tsx - משופר

import React, { memo, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Pressable,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps, signupColors } from "../types";

// הרחבת הממשק המקורי
interface ExtendedActionButtonsProps extends ActionButtonsProps {
  disabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
}

const HAPTIC_ENABLED = Platform.OS === "ios" || Platform.OS === "android";

const ActionButtons: React.FC<ExtendedActionButtonsProps> = memo(
  ({
    onNext,
    onBack,
    isLoading = false,
    disabled = false,
    nextLabel = "המשך",
    backLabel = "חזור",
    showBack = true,
  }) => {
    // פידבק הפטי משופר
    const triggerHaptic = useCallback(
      (style: Haptics.ImpactFeedbackStyle) => {
        if (HAPTIC_ENABLED && !isLoading) {
          Haptics.impactAsync(style).catch(() => {
            // התעלם משגיאות במכשירים לא תומכים
          });
        }
      },
      [isLoading]
    );

    // טיפול בלחיצות
    const handleNext = useCallback(() => {
      if (!isLoading && !disabled) {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        onNext();
      }
    }, [onNext, isLoading, disabled, triggerHaptic]);

    const handleBack = useCallback(() => {
      if (!isLoading) {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        onBack();
      }
    }, [onBack, isLoading, triggerHaptic]);

    // סגנון דינמי לכפתור ראשי
    const primaryButtonStyle = useMemo((): ViewStyle[] => {
      const styleArray: ViewStyle[] = [styles.primaryButton];
      if (disabled && !isLoading) {
        styleArray.push(styles.disabledButton);
      }
      return styleArray;
    }, [disabled, isLoading]);

    // סגנון גרדיאנט דינמי
    const gradientColors = useMemo((): readonly [string, string] => {
      if (disabled && !isLoading) {
        return [signupColors.textMuted, signupColors.textSecondary];
      }
      return [signupColors.primary, signupColors.secondary];
    }, [disabled, isLoading]);

    return (
      <View style={styles.buttonsSection}>
        {/* כפתור ראשי */}
        <Pressable
          style={({ pressed }) => [
            ...primaryButtonStyle,
            pressed && !disabled && !isLoading && styles.pressedButton,
          ]}
          onPress={handleNext}
          disabled={isLoading || disabled}
          accessibilityLabel={nextLabel}
          accessibilityRole="button"
          accessibilityState={{
            busy: isLoading,
            disabled: isLoading || disabled,
          }}
          accessibilityHint="לחץ כדי להמשיך לשלב הבא"
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size={Platform.OS === "ios" ? "small" : 20}
                  color="#fff"
                  testID="loading-indicator"
                />
                <Text style={styles.loadingText}>אנא המתן...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>{nextLabel}</Text>
            )}
          </LinearGradient>
        </Pressable>

        {/* כפתור חזרה */}
        {showBack && (
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              isLoading && styles.secondaryButtonDisabled,
            ]}
            onPress={handleBack}
            disabled={isLoading}
            activeOpacity={0.7}
            accessibilityLabel={backLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
            accessibilityHint="לחץ כדי לחזור לשלב הקודם"
          >
            <Text
              style={[
                styles.secondaryButtonText,
                isLoading && styles.secondaryButtonTextDisabled,
              ]}
            >
              {backLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

// שם לדיבוג
ActionButtons.displayName = "ActionButtons";

const styles = StyleSheet.create({
  buttonsSection: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 4,
    shadowColor: signupColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    opacity: 0.7,
    elevation: 2,
    shadowOpacity: 0.15,
  },
  pressedButton: {
    transform: [{ scale: 0.98 }],
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.9,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: signupColors.textSecondary,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  secondaryButtonTextDisabled: {
    textDecorationLine: "none",
  },
});

export default ActionButtons;
