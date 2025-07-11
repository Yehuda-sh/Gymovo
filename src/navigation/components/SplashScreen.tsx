// src/navigation/components/SplashScreen.tsx
// מסך טעינה מתקדם עם אנימציות ומעצב מקצועי

import React from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface SplashScreenProps {
  /**
   * הודעה אופציונלית להציג מתחת לספינר
   */
  message?: string;

  /**
   * האם להציג לוגו של האפליקציה
   */
  showLogo?: boolean;
}

/**
 * מסך טעינה מתקדם עם עיצוב מקצועי
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({
  message = "טוען...",
  showLogo = true,
}) => {
  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💪</Text>
          <Text style={styles.appName}>Gymovo</Text>
        </View>
      )}

      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },

  logo: {
    fontSize: 80,
    marginBottom: 16,
  },

  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },

  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },

  spinner: {
    transform: [{ scale: 1.2 }],
  },

  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default SplashScreen;
