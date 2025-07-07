// src/screens/settings/SettingsScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SettingsItem } from "../../components/settings/SettingsItem";
import { SettingsSection } from "../../components/settings/SettingsSection";
import { clearAllData, getStorageUsage } from "../../data/storage";
import { UserPreferencesService } from "../../services/userPreferences";
import { useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { UserPreferences } from "../../types/settings";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [storageSize, setStorageSize] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const preferencesService = UserPreferencesService.getInstance();

  useEffect(() => {
    loadSettings();

    // מאזין לשינויים בהעדפות
    const unsubscribe = preferencesService.addListener(setPreferences);
    return unsubscribe;
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [prefs, storageInfo] = await Promise.all([
        preferencesService.load(),
        getStorageUsage(),
      ]);

      setPreferences(prefs);
      setStorageSize(storageInfo.size);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = useCallback(
    async <K extends keyof UserPreferences>(
      section: K,
      field: keyof UserPreferences[K],
      value: boolean | string | number
    ) => {
      try {
        await preferencesService.updateField(section, field, value);

        if (preferences?.workout.hapticFeedback) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch (error) {
        console.error("Failed to update preference:", error);
        Alert.alert("שגיאה", "לא ניתן לשמור את ההגדרה. אנא נסה שוב.");
      }
    },
    [preferences, preferencesService]
  );

  const handleLogout = () => {
    Alert.alert("יציאה מהחשבון", "האם אתה בטוח שברצונך לצאת מהחשבון?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "יציאה",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.navigate("Welcome");
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "מחיקת כל הנתונים",
      "פעולה זו תמחק את כל הנתונים שלך ולא ניתן לבטל אותה. האם אתה בטוח?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק הכל",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("הושלם", "כל הנתונים נמחקו בהצלחה");
              navigation.navigate("Welcome");
            } catch (error) {
              Alert.alert("שגיאה", "לא ניתן למחוק את הנתונים");
            }
          },
        },
      ]
    );
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: "בדוק את Gymovo - אפליקציית האימונים הכי טובה! 💪",
        title: "Gymovo - אפליקציית כושר",
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading || !preferences) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען הגדרות...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>הגדרות</Text>
        <Text style={styles.subtitle}>התאם את האפליקציה לצרכים שלך</Text>
      </View>

      {/* פרופיל משתמש */}
      <SettingsSection title="פרופיל" description="מידע אישי והגדרות חשבון">
        <SettingsItem
          icon="person-circle"
          title={user?.name || "משתמש אורח"}
          description={user?.email || "אין מייל"}
          type="info"
        />
      </SettingsSection>

      {/* אימונים */}
      <SettingsSection
        title="אימונים"
        description="הגדרות המשפיעות על חוויית האימון"
      >
        <SettingsItem
          icon="timer"
          title="זמן מנוחה ברירת מחדל"
          value={`${preferences.workout.defaultRestTime} שניות`}
          type="navigation"
          onPress={() => {
            /* TODO: time picker */
          }}
        />

        <SettingsItem
          icon="play"
          title="התחל טיימר אוטומטית"
          description="התחל ספירה לאחורה של מנוחה אוטומטית"
          type="toggle"
          value={preferences.workout.autoStartTimer}
          onToggle={(value) =>
            updatePreference("workout", "autoStartTimer", value)
          }
        />

        <SettingsItem
          icon="volume-high"
          title="צלילי ביפ"
          description="השמע צליל בסוף כל תרגיל"
          type="toggle"
          value={preferences.workout.playBeepSounds}
          onToggle={(value) =>
            updatePreference("workout", "playBeepSounds", value)
          }
        />

        <SettingsItem
          icon="phone-portrait"
          title="רטט"
          description="רטט במהלך האימון ובאפליקציה"
          type="toggle"
          value={preferences.workout.hapticFeedback}
          onToggle={(value) =>
            updatePreference("workout", "hapticFeedback", value)
          }
        />

        <SettingsItem
          icon="barbell"
          title="יחידות משקל"
          value={preferences.workout.units === "kg" ? "קילוגרם" : "פאונד"}
          type="picker"
          onPress={() => {
            const newUnit = preferences.workout.units === "kg" ? "lbs" : "kg";
            updatePreference("workout", "units", newUnit);
          }}
        />
      </SettingsSection>

      {/* התראות */}
      <SettingsSection title="התראות" description="בחר איזה התראות תרצה לקבל">
        <SettingsItem
          icon="notifications"
          title="התראות push"
          description="התראות מהמערכת"
          type="toggle"
          value={preferences.notifications.pushNotifications}
          onToggle={(value) =>
            updatePreference("notifications", "pushNotifications", value)
          }
        />

        <SettingsItem
          icon="alarm"
          title="תזכורות אימון"
          description="התראה לפני אימונים מתוכננים"
          type="toggle"
          value={preferences.notifications.workoutReminders}
          onToggle={(value) =>
            updatePreference("notifications", "workoutReminders", value)
          }
        />
      </SettingsSection>

      {/* פרטיות */}
      <SettingsSection
        title="פרטיות ונתונים"
        description="בקרה על הנתונים והפרטיות שלך"
      >
        <SettingsItem
          icon="analytics"
          title="שתף נתוני שימוש"
          description="עזור לנו לשפר את האפליקציה"
          type="toggle"
          value={preferences.privacy.allowAnalytics}
          onToggle={(value) =>
            updatePreference("privacy", "allowAnalytics", value)
          }
        />

        <SettingsItem
          icon="cloud-upload"
          title="גיבוי אוטומטי"
          description="גבה את הנתונים שלך בענן"
          type="toggle"
          value={preferences.privacy.backupData}
          onToggle={(value) => updatePreference("privacy", "backupData", value)}
        />
      </SettingsSection>

      {/* מידע ותמיכה */}
      <SettingsSection
        title="מידע ותמיכה"
        description="מידע על האפליקציה ועזרה"
      >
        <SettingsItem
          icon="information-circle"
          title="גרסה"
          value="1.0.0"
          type="info"
        />

        <SettingsItem
          icon="server"
          title="שימוש באחסון"
          value={formatBytes(storageSize)}
          type="info"
        />

        <SettingsItem
          icon="share"
          title="שתף את האפליקציה"
          type="navigation"
          onPress={shareApp}
        />

        <SettingsItem
          icon="mail"
          title="צור קשר"
          type="navigation"
          onPress={() => Linking.openURL("mailto:support@gymovo.app")}
        />
      </SettingsSection>

      {/* פעולות מתקדמות */}
      <SettingsSection
        title="פעולות מתקדמות"
        description="פעולות בלתי הפיכות - זהירות!"
      >
        <SettingsItem
          icon="trash"
          title="מחק את כל הנתונים"
          description="מחיקה מלאה של כל המידע"
          type="navigation"
          onPress={handleClearData}
          danger
        />

        {user && (
          <SettingsItem
            icon="log-out"
            title="יציאה מהחשבון"
            type="navigation"
            onPress={handleLogout}
            danger
          />
        )}
      </SettingsSection>

      {/* ריווח תחתון */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SettingsScreen;
