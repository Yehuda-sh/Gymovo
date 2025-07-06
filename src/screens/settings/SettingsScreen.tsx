// src/screens/settings/SettingsScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Button from "../../components/common/Button";
import Dialog from "../../components/common/Dialog";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

// מסך ההגדרות הראשי של האפליקציה
const SettingsScreen = ({ navigation }: Props) => {
  const logout = useUserStore((state: UserState) => state.logout);

  // TODO: בעתיד, להעביר את ניהול ההגדרות ל-store ייעודי עם persist
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [units, setUnits] = useState<"kg" | "lbs">("kg");
  const [isLogoutDialogVisible, setLogoutDialogVisible] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>הגדרות</Text>

      {/* אזור הגדרות כלליות */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>כללי</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>מצב כהה</Text>
          <Switch
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#f4f3f4"}
            onValueChange={() => setIsDarkMode((prev) => !prev)}
            value={isDarkMode}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>יחידות מידה</Text>
          <View style={styles.unitsGroup}>
            <Button
              title="ק״ג"
              onPress={() => setUnits("kg")}
              variant={units === "kg" ? "primary" : "outline"}
              style={styles.unitButton}
            />
            <Button
              title="lbs"
              onPress={() => setUnits("lbs")}
              variant={units === "lbs" ? "primary" : "outline"}
              style={styles.unitButton}
            />
          </View>
        </View>
      </View>

      {/* אזור הגדרות חשבון */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>חשבון</Text>
        <Button
          title="התנתק"
          onPress={() => setLogoutDialogVisible(true)}
          variant="primary"
        />
      </View>

      {/* דיאלוג אישור התנתקות */}
      <Dialog
        visible={isLogoutDialogVisible}
        title="התנתקות"
        message="האם אתה בטוח שברצונך להתנתק?"
        onClose={() => setLogoutDialogVisible(false)}
        onConfirm={logout}
        confirmLabel="כן, התנתק"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },
  contentContainer: { padding: 24 },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "right",
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
    textAlign: "right",
  },
  settingRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLabel: { fontSize: 16, textAlign: "right" },
  unitsGroup: { flexDirection: "row-reverse", gap: 8 },
  unitButton: { width: 60, paddingVertical: 8, marginVertical: 0 },
});

export default SettingsScreen;
