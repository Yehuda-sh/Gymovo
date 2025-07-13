// src/screens/profile/guest/components/GuestProfileHeader.tsx
// כותרת פרופיל אורח עם עיצוב תואם למסכי Login/Welcome

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { GuestProfileHeaderProps } from "../types";

const GuestProfileHeader: React.FC<GuestProfileHeaderProps> = ({
  fadeAnim,
  scaleAnim,
}) => {
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // חישוב זמן שנותר (30 יום)
  const daysRemaining = 30;
  const expiryPercentage = (daysRemaining / 30) * 100;

  useEffect(() => {
    // אנימציית זוהר
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // אנימציית סיבוב עדינה
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
      {/* אווטאר עם גרדיאנט וזוהר */}
      <View style={styles.avatarContainer}>
        {/* זוהר מאחורי האווטאר */}
        <Animated.View
          style={[
            styles.avatarGlow,
            {
              opacity: glowAnim,
            },
          ]}
        />

        {/* מסגרת גרדיאנט מסתובבת */}
        <Animated.View
          style={[
            styles.avatarRing,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2", "#667eea"]}
            style={styles.ringGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* אווטאר ראשי */}
        <BlurView intensity={20} style={styles.avatarBlur}>
          <LinearGradient
            colors={["rgba(102, 126, 234, 0.2)", "rgba(118, 75, 162, 0.2)"]}
            style={styles.avatarInner}
          >
            <Ionicons
              name="person"
              size={50}
              color="rgba(255, 255, 255, 0.8)"
            />
          </LinearGradient>
        </BlurView>

        {/* תג אורח */}
        <View style={styles.guestBadge}>
          <LinearGradient
            colors={["#F59E0B", "#DC2626"]}
            style={styles.badgeGradient}
          >
            <Text style={styles.guestBadgeText}>אורח</Text>
          </LinearGradient>
        </View>
      </View>

      {/* כותרת */}
      <Text style={styles.title}>משתמש אורח</Text>

      {/* פרטי סטטוס */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Ionicons name="time-outline" size={16} color="#667eea" />
          <Text style={styles.statusText}>נותרו {daysRemaining} ימים</Text>
        </View>

        {/* בר התקדמות */}
        <View style={styles.expiryBar}>
          <LinearGradient
            colors={
              expiryPercentage > 50
                ? ["#667eea", "#764ba2"]
                : expiryPercentage > 20
                ? ["#F59E0B", "#DC2626"]
                : ["#EF4444", "#DC2626"]
            }
            style={[styles.expiryProgress, { width: `${expiryPercentage}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        {/* הודעת אזהרה */}
        <Text style={styles.warningText}>הנתונים שלך יימחקו בסוף התקופה</Text>
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
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#667eea",
    ...Platform.select({
      ios: {
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  avatarRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  ringGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBlur: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.3)",
    borderRadius: 50,
  },
  guestBadge: {
    position: "absolute",
    bottom: 0,
    right: -5,
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#F59E0B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  badgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  statusContainer: {
    alignItems: "center",
    gap: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  expiryBar: {
    width: 200,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  expiryProgress: {
    height: "100%",
    borderRadius: 3,
  },
  warningText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default GuestProfileHeader;
