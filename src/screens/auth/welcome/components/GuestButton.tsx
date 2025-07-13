// src/screens/auth/welcome/components/GuestButton.tsx - גרסה קומפקטית

import React, { useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { GuestButtonProps } from "../types";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

export const GuestButton: React.FC<GuestButtonProps> = ({ onGuestLogin }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onGuestLogin(), 100);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={16} color="#64748B" />
        </View>
        <Text style={styles.text}>כניסה מהירה ללא הרשמה</Text>
        <Ionicons name="arrow-forward-outline" size={16} color="#64748B" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: isSmallDevice ? 20 : 30,
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "rgba(100, 116, 139, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(100, 116, 139, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
});

export default GuestButton;
