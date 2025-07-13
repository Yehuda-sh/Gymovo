// src/screens/profile/user/components/ProfileHeader.tsx
// כותרת פרופיל קומפקטית

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { profileColors } from "../styles";

interface ProfileHeaderProps {
  user: any;
  insets: any;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  onSettingsPress: () => void;
  onEditPress: () => void;
  onStatsPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  insets,
  fadeAnim,
  slideAnim,
  onSettingsPress,
  onEditPress,
  onStatsPress,
}) => {
  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const getInitials = () => {
    if (!user?.name) return "?";
    const names = user.name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <LinearGradient
      colors={[profileColors.gradientLight, profileColors.gradientAccent]}
      style={[styles.header, { paddingTop: insets.top + 10 }]}
    >
      {/* כפתור הגדרות עם רקע */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => handlePress(onSettingsPress)}
      >
        <View style={styles.settingsButtonBg}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* אווטאר ופרטי משתמש */}
      <Animated.View
        style={[
          styles.profileInfo,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient colors={["#fff", "#f0f0f0"]} style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </LinearGradient>
          {user.isGuest && (
            <View style={styles.guestBadge}>
              <Ionicons name="person-outline" size={10} color="#fff" />
            </View>
          )}
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        {/* כפתור עריכה */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handlePress(onEditPress)}
        >
          <Ionicons name="create-outline" size={14} color="#fff" />
          <Text style={styles.editButtonText}>ערוך פרופיל</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* סטטיסטיקות */}
      <TouchableOpacity
        style={styles.statsContainer}
        onPress={() => handlePress(onStatsPress)}
        activeOpacity={0.8}
      >
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>אימונים</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>השבוע</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>45</Text>
          <Text style={styles.statLabel}>דקות ממוצע</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 10, // הקטנה מ-30
    borderBottomLeftRadius: 10, // הקטנה מ-30
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  settingsButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 10,
  },
  settingsButtonBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  profileInfo: {
    alignItems: "center",
    paddingTop: 5, // הקטנה מ-10
  },
  avatarContainer: {
    marginBottom: 10, // הקטנה מ-15
  },
  avatar: {
    width: 70, // הקטנה מ-100
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 25, // הקטנה מ-36
    fontWeight: "bold",
    color: profileColors.buttonPrimary,
  },
  guestBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20, // הקטנה מ-28
    height: 20,
    borderRadius: 12,
    backgroundColor: profileColors.warning,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 18, // הקטנה מ-24
    fontWeight: "bold",
    color: profileColors.text,
    marginBottom: 2, // הקטנה מ-4
  },
  userEmail: {
    fontSize: 13, // הקטנה מ-14
    color: profileColors.textSecondary,
    marginBottom: 10, // הקטנה מ-12
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 14, // הקטנה מ-16
    paddingVertical: 6, // הקטנה מ-8
    borderRadius: 16, // הקטנה מ-20
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  editButtonText: {
    color: profileColors.text,
    fontSize: 13, // הקטנה מ-14
    marginLeft: 5, // הקטנה מ-6
  },
  statsContainer: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10, // הקטנה מ-20
    paddingHorizontal: 10, // הקטנה מ-20
    paddingVertical: 10, // הקטנה מ-15
    marginHorizontal: 10,
    marginTop: 10, // הקטנה מ-20
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 12, // הקטנה מ-20
    fontWeight: "bold",
    color: profileColors.text,
    marginBottom: 1, // הקטנה מ-2
  },
  statLabel: {
    fontSize: 9, // הקטנה מ-11
    color: profileColors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 20, // הקטנה מ-35
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 10,
  },
});

export default ProfileHeader;
