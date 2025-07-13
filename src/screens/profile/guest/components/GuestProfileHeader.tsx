// src/screens/profile/guest/components/GuestProfileHeader.tsx
// רכיב כותרת משופר עם אנימציות ומידע על המשתמש האורח

import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useGuestUser } from "../../../../stores/userStore";
import { colors } from "../../../../theme/colors";

interface GuestProfileHeaderProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

const GuestProfileHeader: React.FC<GuestProfileHeaderProps> = ({
  fadeAnim,
  scaleAnim,
}) => {
  const { daysUntilExpiry, isGuest } = useGuestUser();

  // חישוב כמה ימים המשתמש כבר אורח
  const daysSinceCreation = isGuest ? 0 : 0;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* אווטר עם אנימציה */}
      <View style={styles.avatarContainer}>
        <Animated.View
          style={[
            styles.avatarOuter,
            {
              transform: [
                {
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#374151", "#1F2937"]}
            style={styles.avatarGradient}
          />
        </Animated.View>

        <View style={styles.avatarInner}>
          <Ionicons name="person-outline" size={40} color="#9CA3AF" />
        </View>

        {/* תג אורח */}
        <View style={styles.guestBadge}>
          <Text style={styles.guestBadgeText}>אורח</Text>
        </View>
      </View>

      {/* טקסט ראשי */}
      <Text style={styles.title}>משתמש אורח</Text>

      {/* מידע על הסטטוס */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Ionicons name="time-outline" size={16} color="#9CA3AF" />
          <Text style={styles.statusText}>
            נותרו {daysUntilExpiry} ימים לשמירת הנתונים
          </Text>
        </View>

        {daysSinceCreation > 0 && (
          <View style={styles.statusRow}>
            <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            <Text style={styles.statusText}>
              מתאמן כבר {daysSinceCreation} ימים
            </Text>
          </View>
        )}
      </View>

      {/* פס התקדמות לתפוגה */}
      <View style={styles.expiryBar}>
        <View
          style={[
            styles.expiryProgress,
            {
              width: `${((30 - daysUntilExpiry) / 30) * 100}%`,
              backgroundColor:
                daysUntilExpiry <= 7 ? colors.error : colors.primary,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarOuter: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    top: -5,
    left: -5,
  },
  avatarGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
    opacity: 0.3,
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
  },
  guestBadge: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
  statusContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  expiryBar: {
    width: 200,
    height: 4,
    backgroundColor: "#374151",
    borderRadius: 2,
    overflow: "hidden",
  },
  expiryProgress: {
    height: "100%",
    borderRadius: 2,
  },
});

export default GuestProfileHeader;
