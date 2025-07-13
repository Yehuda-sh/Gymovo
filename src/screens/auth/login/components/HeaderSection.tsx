// src/screens/auth/login/components/HeaderSection.tsx - גרסה קומפקטית למובייל

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderSectionProps } from "../types";
import { loginColors } from "../styles/loginStyles";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  // אנימציות נוספות
  const glowAnim = useRef(new Animated.Value(0.15)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // אנימציית Glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.25,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.15,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // אנימציית Pulse עדינה
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
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
  }, []);

  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          transform: [{ translateY: slideAnim }, { scale: headerScale }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* לוגו קומפקטי */}
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoGlow,
            {
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        <View style={styles.logoFrame}>
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            <Ionicons
              name="shield-checkmark"
              size={isSmallDevice ? 36 : 42}
              color="#FFFFFF"
            />
          </Animated.View>
        </View>
      </View>

      {/* כותרת קומפקטית */}
      <Text style={styles.title}>התחברות</Text>
      <Text style={styles.subtitle}>היכנס לחשבון שלך</Text>

      {/* קו דקורטיבי קטן יותר */}
      <LinearGradient
        colors={[loginColors.logoGlow, loginColors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentLine}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: isSmallDevice ? 24 : 36,
  },
  logoContainer: {
    position: "relative",
    marginBottom: isSmallDevice ? 16 : 20,
    width: isSmallDevice ? 80 : 90,
    height: isSmallDevice ? 80 : 90,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: isSmallDevice ? 100 : 110,
    height: isSmallDevice ? 100 : 110,
    borderRadius: isSmallDevice ? 50 : 55,
    backgroundColor: loginColors.primary,
    opacity: 0.2,
  },
  logoFrame: {
    width: isSmallDevice ? 80 : 90,
    height: isSmallDevice ? 80 : 90,
    borderRadius: isSmallDevice ? 28 : 32,
    backgroundColor: loginColors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: loginColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: isSmallDevice ? 32 : 36,
    fontWeight: "800",
    color: loginColors.text,
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-black",
  },
  subtitle: {
    fontSize: isSmallDevice ? 15 : 16,
    color: loginColors.textSecondary,
    textAlign: "center",
    marginBottom: isSmallDevice ? 12 : 16,
    fontWeight: "500",
  },
  accentLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    shadowColor: loginColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default HeaderSection;
