// src/screens/auth/welcome/components/DemoUserCard.tsx - כרטיס משתמש דמו משופר

import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { DemoUserCardProps, DemoUserData, welcomeColors } from "../types";

// הרחבת הממשק לתמיכה ב-disabled
export interface DemoUserCardPropsExtended extends DemoUserCardProps {
  disabled?: boolean;
}

// הרחבת הטיפוס המקורי לתמיכה ב-avatar
export interface DemoUserDataExtended extends DemoUserData {
  avatar?: string;
}

// מפות תרגום
const LEVEL_TRANSLATIONS: Record<string, string> = {
  beginner: "מתחיל",
  intermediate: "ביניים",
  advanced: "מתקדם",
};

const GOAL_TRANSLATIONS: Record<string, string> = {
  build_muscle: "בניית שריר",
  lose_weight: "ירידה במשקל",
  get_stronger: "חיזוק",
  general_fitness: "כושר כללי",
};

// אייקונים לרמות
const LEVEL_ICONS: Record<string, string> = {
  beginner: "🌱",
  intermediate: "💪",
  advanced: "🔥",
};

// אייקונים למטרות
const GOAL_ICONS: Record<string, string> = {
  build_muscle: "🏋️",
  lose_weight: "⚖️",
  get_stronger: "💯",
  general_fitness: "🎯",
};

// כרטיס משתמש דמו עם מידע מפורט על המשתמש
export const DemoUserCard: React.FC<DemoUserCardPropsExtended> = memo(
  ({ user, onPress, disabled = false }) => {
    // המרת המשתמש לטיפוס מורחב
    const extendedUser = user as DemoUserDataExtended;
    // תרגומים ואייקונים
    const levelText = LEVEL_TRANSLATIONS[user.level] || user.level;
    const goalText = GOAL_TRANSLATIONS[user.goal] || user.goal;
    const levelIcon = LEVEL_ICONS[user.level] || "📊";
    const goalIcon = GOAL_ICONS[user.goal] || "🎯";

    // סגנון דינמי לפי סטטוס
    const containerStyle = useMemo((): ViewStyle[] => {
      const styleArray: ViewStyle[] = [
        styles.devButton,
        { backgroundColor: user.color || "#1F2937" },
      ];

      if (disabled) {
        styleArray.push(styles.disabledButton);
      }

      return styleArray;
    }, [user.color, disabled]);

    // אווטאר ראשי תיבות אם אין תמונה
    const initials = useMemo(() => {
      return user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }, [user.name]);

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => onPress(user)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {/* אווטאר */}
        <View style={styles.avatarContainer}>
          {extendedUser.avatar ? (
            <Text style={styles.avatarEmoji}>{extendedUser.avatar}</Text>
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: user.color },
              ]}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </View>

        {/* פרטים אישיים */}
        <View style={styles.infoContainer}>
          <Text style={styles.demoButtonText} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.demoButtonSubtext} numberOfLines={1}>
            {user.email}
          </Text>
        </View>

        {/* מידע נוסף */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{levelIcon}</Text>
            <Text style={styles.demoButtonDetails}>{levelText}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{goalIcon}</Text>
            <Text style={styles.demoButtonDetails}>{goalText}</Text>
          </View>
        </View>

        {/* תג גיל */}
        {user.age && (
          <View style={styles.ageTag}>
            <Text style={styles.ageText}>{user.age}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

// שם לדיבוג
DemoUserCard.displayName = "DemoUserCard";

const styles = StyleSheet.create({
  devButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 80,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  demoButtonText: {
    color: welcomeColors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  demoButtonSubtext: {
    color: welcomeColors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailIcon: {
    fontSize: 12,
  },
  demoButtonDetails: {
    color: welcomeColors.textMuted,
    fontSize: 11,
    fontWeight: "500",
  },
  detailDivider: {
    width: 1,
    height: 12,
    backgroundColor: welcomeColors.textMuted,
    marginHorizontal: 8,
    opacity: 0.3,
  },
  ageTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ageText: {
    color: welcomeColors.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
});

export default DemoUserCard;
