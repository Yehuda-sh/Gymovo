// src/screens/auth/welcome/components/BackgroundGradient.tsx - רכיב רקע משופר עם גרדיאנט

import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BackgroundGradientProps, welcomeColors } from "../types";

const { width, height } = Dimensions.get("window");

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  visible = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית פעימה עדינה
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* רקע בסיס עם גרדיאנט כהה */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* שכבת glow עדינה */}
      <Animated.View
        style={[
          styles.glowOverlay,
          {
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.05, 0.15],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* אפקט gradient נוסף בפינות */}
      <View style={styles.cornerGradientTop}>
        <LinearGradient
          colors={["rgba(102,126,234,0.1)", "transparent"]}
          style={styles.cornerGradient}
        />
      </View>

      <View style={styles.cornerGradientBottom}>
        <LinearGradient
          colors={["transparent", "rgba(118,75,162,0.1)"]}
          style={styles.cornerGradient}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cornerGradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  cornerGradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  cornerGradient: {
    flex: 1,
  },
});

export default BackgroundGradient;
