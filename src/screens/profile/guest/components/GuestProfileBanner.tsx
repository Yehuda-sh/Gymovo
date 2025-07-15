// src/screens/profile/guest/components/GuestProfileBanner.tsx
// באנר התראה אינטראקטיבי למשתמשי אורח

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useUserStore } from "../../../../stores/userStore";
import { useMemo } from "react";

interface GuestProfileBannerProps {
  onPress: () => void;
  animation: Animated.AnimatedValue;
}

const GuestProfileBanner: React.FC<GuestProfileBannerProps> = ({
  onPress,
  animation,
}) => {
  const getGuestExpiryDate = useUserStore((state) => state.getGuestExpiryDate);

  // חישוב ימים לתפוגה
  const daysUntilExpiry = useMemo(() => {
    const expiryDate = getGuestExpiryDate();
    if (!expiryDate) return 0;

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [getGuestExpiryDate]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getBannerStyle = () => {
    if (daysUntilExpiry <= 3) {
      return {
        colors: ["#DC2626", "#B91C1C"],
        icon: "warning",
        text: `סכנה! נותרו רק ${daysUntilExpiry} ימים`,
      };
    } else if (daysUntilExpiry <= 7) {
      return {
        colors: ["#F59E0B", "#D97706"],
        icon: "alert-circle",
        text: `נותרו ${daysUntilExpiry} ימים לשמירת הנתונים`,
      };
    } else {
      return {
        colors: ["#3B82F6", "#2563EB"],
        icon: "information-circle",
        text: `משתמש אורח - ${daysUntilExpiry} ימים נותרו`,
      };
    }
  };

  const { colors, icon, text } = getBannerStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: animation }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.banner}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={colors as [ColorValue, ColorValue, ...ColorValue[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Ionicons name={icon as any} size={20} color="white" />
          <Text style={styles.text}>{text}</Text>
          <Ionicons name="chevron-forward" size={16} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  banner: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginHorizontal: 12,
    textAlign: "center",
  },
});

export default GuestProfileBanner;
