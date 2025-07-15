// src/screens/home/components/QuickStartFAB.tsx
// כפתור צף לאימון מהיר עם מערכת עיצוב מאוחדת

import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, borderRadius, shadows, animation } =
  unifiedDesignSystem;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QuickStartFAB: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // אנימציית כניסה
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: animation.spring.tension,
      friction: animation.spring.friction,
      useNativeDriver: true,
    }).start();

    // אנימציית פעימה
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: animation.duration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: animation.duration.normal,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, pulseAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Main", { screen: "StartWorkout" });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        accessibilityLabel="התחל אימון מהיר"
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.93 }] },
        ]}
      >
        <LinearGradient
          colors={[colors.workoutActive, colors.workoutCompleted]}
          style={styles.buttonInner}
        >
          <Ionicons name="flash" size={28} color="#fff" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: colors.workoutActive,
        shadowOffset: shadows.glow.shadowOffset,
        shadowOpacity: shadows.glow.shadowOpacity,
        shadowRadius: 18, // צל חזק יותר
      },
      android: {
        elevation: 12, // צל חזק יותר
      },
    }),
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff", // מסגרת לבנה דקה
    shadowColor: colors.workoutActive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18, // glow ירוק עדין
    elevation: 16,
  },
  buttonInner: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default QuickStartFAB;
