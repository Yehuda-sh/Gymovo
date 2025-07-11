// src/screens/auth/welcome/components/GuestButton.tsx - עם Touch Feedback

import React, { useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GuestButtonProps } from "../types";
import { rtlStyles } from "../../../../theme/rtl";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const newColors = {
  accent: "#FFD23F", // צהוב זהב
};

export const GuestButton: React.FC<GuestButtonProps> = ({ onGuestLogin }) => {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onGuestLogin();
    }, 100);
  };

  return (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <TouchableOpacity
        style={[styles.guestButton, rtlStyles.iconText]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* אייקון לפני הטקסט (צד ימין) */}
        <Ionicons
          name="person-outline"
          size={18}
          color="rgba(255, 255, 255, 0.6)"
          style={styles.icon}
        />

        {/* טקסט כניסה כאורח */}
        <Text style={[styles.guestText, rtlStyles.text]}>כניסה כאורח</Text>

        {/* חץ קטן */}
        <Ionicons
          name="chevron-back" // RTL מתוקן
          size={16}
          color="rgba(255, 255, 255, 0.4)"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  guestButton: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16, // יותר padding
    paddingHorizontal: 20,
    marginTop: 24, // יותר רווח מלמעלה
    gap: 8,
  },
  icon: {
    marginLeft: 4, // ריווח בצד שמאל של האייקון
  },
  guestText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default GuestButton;
