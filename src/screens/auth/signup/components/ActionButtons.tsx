// src/screens/auth/signup/components/ActionButtons.tsx - סגנון WelcomeScreen

import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Props interface - זהה לקוד שלך
interface ActionButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

// צבעים מ-WelcomeScreen
const welcomeColors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  glow: "rgba(255, 107, 53, 0.3)",
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNext,
  onBack,
  isLoading = false,
}) => {
  // אנימציות לכפתורים - זהה לWelcomeScreen
  const primaryButtonScale = useRef(new Animated.Value(1)).current;
  const secondaryButtonScale = useRef(new Animated.Value(1)).current;

  // Touch Feedback לכפתור ראשי
  const handlePrimaryPressIn = () => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(primaryButtonScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePrimaryPressOut = () => {
    if (isLoading) return;
    Animated.spring(primaryButtonScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onNext();
    }, 100);
  };

  // Touch Feedback לכפתור משני
  const handleSecondaryPressIn = () => {
    if (isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(secondaryButtonScale, {
      toValue: 0.97,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleSecondaryPressOut = () => {
    if (isLoading) return;
    Animated.spring(secondaryButtonScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onBack();
    }, 100);
  };

  return (
    <View style={styles.actionsSection}>
      {/* כפתור ראשי - זהה ל-WelcomeScreen */}
      <Animated.View style={{ transform: [{ scale: primaryButtonScale }] }}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPressIn={handlePrimaryPressIn}
          onPressOut={handlePrimaryPressOut}
          activeOpacity={1}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[welcomeColors.primary, welcomeColors.secondary]}
            style={styles.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>המשך לשאלון</Text>
                <Ionicons name="arrow-back" size={20} color="#ffffff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* כפתור משני - זהה ל-WelcomeScreen */}
      <Animated.View style={{ transform: [{ scale: secondaryButtonScale }] }}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPressIn={handleSecondaryPressIn}
          onPressOut={handleSecondaryPressOut}
          activeOpacity={1}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>חזור</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* הודעת טעינה */}
      {isLoading && (
        <Text style={styles.loadingMessage}>מעבד את הפרטים שלך... ⚡</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    width: "100%",
    gap: 16,
    paddingVertical: 12,
  },

  // כפתור ראשי - זהה ל-WelcomeScreen
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: welcomeColors.glow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  // כפתור משני - זהה ל-WelcomeScreen
  secondaryButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 0.3,
  },

  loadingMessage: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
});

export default ActionButtons;
