// src/screens/profile/ProfileScreen.tsx

import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import Dialog from "../../components/common/Dialog";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";

// מסך הפרופיל הראשי של משתמש רשום
const ProfileScreen = () => {
  // קבלת נתוני המשתמש ופעולת ההתנתקות מה-store
  const user = useUserStore((state: UserState) => state.user);
  const logout = useUserStore((state: UserState) => state.logout);

  // מצב מקומי לניהול נראות דיאלוג המחיקה
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  // פונקציה לטיפול במחיקת חשבון
  const handleDeleteAccount = () => {
    // TODO: בעתיד, כאן תהיה קריאת API לשרת למחיקת המשתמש
    console.log(`Deleting account for user: ${user?.id}`);
    setDeleteModalVisible(false);
    logout(); // התנתקות מהאפליקציה לאחר המחיקה
    Alert.alert("החשבון נמחק בהצלחה");
  };

  // פונקציית עזר להצגת ראשי תיבות באווטאר
  const getInitials = (name?: string) => {
    if (!name) return "G";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* אזור עליון עם פרטי המשתמש */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
        </View>
        <Text style={styles.name}>{user?.name || "משתמש אורח"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* אזור כפתורי פעולה */}
      <View style={styles.actionsContainer}>
        <Button
          title="ערוך פרופיל"
          onPress={() =>
            Alert.alert("בקרוב", "אפשרות עריכת פרופיל תתווסף בעתיד.")
          }
          variant="outline"
        />
        <Button title="התנתק" onPress={logout} variant="primary" />
      </View>

      {/* אזור "סכנה" - פעולות הרסניות */}
      <View style={styles.dangerZone}>
        <Button
          title="מחק חשבון"
          onPress={() => setDeleteModalVisible(true)}
          variant="danger"
        />
      </View>

      {/* דיאלוג אישור מחיקה */}
      <Dialog
        visible={isDeleteModalVisible}
        title="אישור מחיקת חשבון"
        message="האם אתה בטוח שברצונך למחוק את החשבון? כל הנתונים יימחקו לצמיתות."
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        confirmLabel="כן, מחק"
        cancelLabel="לא, בטל"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background || "#f5f5f5",
  },
  profileHeader: { alignItems: "center", marginBottom: 48 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { color: "white", fontSize: 40, fontWeight: "bold" },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  }, // RTL Support
  email: { fontSize: 16, color: "#666", marginTop: 4, textAlign: "center" }, // RTL Support
  actionsContainer: { width: "100%", gap: 8 },
  dangerZone: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 24,
  },
});

export default ProfileScreen;
