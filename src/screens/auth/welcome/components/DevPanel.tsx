// src/screens/auth/welcome/components/DevPanel.tsx - פאנל פיתוח משופר

import React, { memo, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Vibration,
  Platform,
} from "react-native";
import { DevPanelProps, welcomeColors, DemoUserData } from "../types";
import { DemoUserCard } from "./DemoUserCard"; // תיקון: named import

// קומפוננטה עם מיטוב ביצועים
export const DevPanel: React.FC<DevPanelProps> = memo(
  ({ visible, demoUsers, onDemoLogin, onResetData }) => {
    // מצב טעינה לפעולות
    const [isResetting, setIsResetting] = useState(false);
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    // מיון משתמשי דמו לפי רמה
    const sortedUsers = useMemo(() => {
      const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return [...demoUsers].sort((a, b) => {
        const aLevel = levelOrder[a.level as keyof typeof levelOrder] ?? 3;
        const bLevel = levelOrder[b.level as keyof typeof levelOrder] ?? 3;
        return aLevel - bLevel;
      });
    }, [demoUsers]);

    // פונקציה משופרת לכניסה עם משתמש דמו
    const handleDemoLogin = useCallback(
      async (user: DemoUserData) => {
        try {
          setLoadingUserId(user.id);
          // רטט קל לפידבק
          if (Platform.OS !== "web") {
            Vibration.vibrate(10);
          }
          await onDemoLogin(user);
        } catch {
          Alert.alert("שגיאה", "לא ניתן להתחבר עם משתמש זה");
        } finally {
          setLoadingUserId(null);
        }
      },
      [onDemoLogin]
    );

    // פונקציה משופרת לאיפוס נתונים עם אישור
    const handleResetData = useCallback(() => {
      Alert.alert(
        "⚠️ אזהרה",
        "פעולה זו תמחק את כל הנתונים המקומיים. האם אתה בטוח?",
        [
          { text: "ביטול", style: "cancel" },
          {
            text: "מחק הכל",
            style: "destructive",
            onPress: async () => {
              setIsResetting(true);
              try {
                await onResetData();
                Alert.alert("✅ הצלחה", "כל הנתונים נמחקו בהצלחה");
              } catch {
                Alert.alert("שגיאה", "לא ניתן למחוק את הנתונים");
              } finally {
                setIsResetting(false);
              }
            },
          },
        ],
        { cancelable: true }
      );
    }, [onResetData]);

    if (!visible) return null;

    return (
      <View style={styles.devPanel} testID="dev-panel">
        {/* כותרת עם אנימציה */}
        <View style={styles.devHeader}>
          <View style={[styles.devIndicator, styles.pulsingIndicator]} />
          <Text style={styles.devTitle}>DEV MODE</Text>
          <Text style={styles.devVersion}>v2.0</Text>
        </View>

        {/* סטטיסטיקות */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{demoUsers.length}</Text>
            <Text style={styles.statLabel}>משתמשים</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>רמות</Text>
          </View>
        </View>

        <Text style={styles.demoSectionTitle}>בחר משתמש לבדיקה</Text>

        {/* רשימת משתמשים עם גלילה */}
        <ScrollView
          style={styles.usersScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.usersScrollContent}
        >
          {sortedUsers.map((user) => (
            <View key={user.id} style={styles.userCardWrapper}>
              {loadingUserId === user.id && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator
                    size="small"
                    color={welcomeColors.primary}
                  />
                </View>
              )}
              <TouchableOpacity
                disabled={loadingUserId !== null}
                onPress={() => handleDemoLogin(user)}
                activeOpacity={0.7}
              >
                <DemoUserCard
                  user={user}
                  onPress={() => {}} // DemoUserCard מטפל בעיצוב בלבד
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* כפתורי פעולה */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.resetButton,
              isResetting && styles.resetButtonDisabled,
            ]}
            onPress={handleResetData}
            disabled={isResetting}
            activeOpacity={0.7}
          >
            {isResetting ? (
              <ActivityIndicator
                size="small"
                color={welcomeColors.resetButtonText}
              />
            ) : (
              <>
                <Text style={styles.resetIcon}>🗑️</Text>
                <Text style={styles.resetButtonText}>נקה נתונים</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => Alert.alert("מידע", "פאנל זה זמין רק בסביבת פיתוח")}
          >
            <Text style={styles.infoIcon}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

// שם לדיבוג
DevPanel.displayName = "DevPanel";

const styles = StyleSheet.create({
  devPanel: {
    marginTop: 20,
    padding: 16,
    backgroundColor: welcomeColors.devPanel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: welcomeColors.devBorder,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  devIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: welcomeColors.devIndicator,
  },
  pulsingIndicator: {
    // אנימציה בעתיד
  },
  devTitle: {
    color: welcomeColors.devTitle,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  devVersion: {
    color: welcomeColors.textMuted,
    fontSize: 10,
    fontWeight: "500",
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statValue: {
    color: welcomeColors.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: welcomeColors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: welcomeColors.devBorder,
  },
  demoSectionTitle: {
    color: welcomeColors.demoSectionTitle,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  usersScrollView: {
    maxHeight: 280,
  },
  usersScrollContent: {
    paddingBottom: 8,
  },
  userCardWrapper: {
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    zIndex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: welcomeColors.resetButton,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: welcomeColors.resetButtonBorder,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetIcon: {
    fontSize: 14,
  },
  resetButtonText: {
    color: welcomeColors.resetButtonText,
    fontSize: 13,
    fontWeight: "600",
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: welcomeColors.devBorder,
  },
  infoIcon: {
    fontSize: 16,
  },
});

export default DevPanel;
