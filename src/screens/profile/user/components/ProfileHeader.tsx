// src/screens/profile/user/components/ProfileHeader.tsx
// רכיב Header קומפקטי עבור מסך פרופיל משתמש

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../theme/colors";
import { ProfileHeaderProps } from "../types";

// אכיפת RTL
I18nManager.forceRTL(true);

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  getInitials,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* רקע גרדיאנט קומפקטי */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        {/* אווטר קומפקטי */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials}</Text>
          </View>
          {user.isGuest && (
            <View style={styles.guestBadge}>
              <Ionicons name="person-outline" size={8} color="#fff" />
            </View>
          )}
        </View>

        {/* שם משתמש */}
        <Text style={styles.userName}>{user.name || "משתמש"}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        {/* כרטיס סטטיסטיקות קומפקטי */}
        {user.stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="fitness" size={14} color="#ff6b6b" />
              <Text style={styles.statValue}>
                {user.stats.workoutsCount || 0}
              </Text>
              <Text style={styles.statLabel}>אימונים</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="flame" size={14} color="#ffa726" />
              <Text style={styles.statValue}>{user.stats.streakDays || 0}</Text>
              <Text style={styles.statLabel}>ימי רצף</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="barbell" size={14} color="#42a5f5" />
              <Text style={styles.statValue}>
                {Math.round((user.stats.totalWeightLifted || 0) / 1000)}K
              </Text>
              <Text style={styles.statLabel}>קג כולל</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    paddingBottom: 15,
    overflow: "hidden",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
    opacity: 0.9,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 25,
    position: "relative",
    zIndex: 10,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#667eea",
  },
  guestBadge: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffa726",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 15,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 15,
  },
});

export default ProfileHeader;
