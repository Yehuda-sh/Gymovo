// src/screens/auth/welcome/components/DevPanel.tsx - פאנל פיתוח למפתחים

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DevPanelProps, welcomeColors } from "../types";
import DemoUserCard from "./DemoUserCard";

// פאנל מפתחים המופיע רק בסביבת פיתוח
export const DevPanel: React.FC<DevPanelProps> = ({
  visible,
  demoUsers,
  onDemoLogin,
  onResetData,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.devPanel}>
      <View style={styles.devHeader}>
        <View style={styles.devIndicator} />
        <Text style={styles.devTitle}>DEV MODE</Text>
      </View>

      <Text style={styles.demoSectionTitle}>משתמשי דמו</Text>

      <View style={styles.devActions}>
        {demoUsers.map((user) => (
          <DemoUserCard key={user.id} user={user} onPress={onDemoLogin} />
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={onResetData}>
        <Text style={styles.resetButtonText}>🗑️ נקה את כל הנתונים</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  devPanel: {
    marginTop: 20,
    padding: 16,
    backgroundColor: welcomeColors.devPanel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: welcomeColors.devBorder,
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 8,
  },
  devIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: welcomeColors.devIndicator,
  },
  devTitle: {
    color: welcomeColors.devTitle,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  demoSectionTitle: {
    color: welcomeColors.demoSectionTitle,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  devActions: {
    gap: 0,
  },
  resetButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: welcomeColors.resetButton,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: welcomeColors.resetButtonBorder,
    alignItems: "center",
  },
  resetButtonText: {
    color: welcomeColors.resetButtonText,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default DevPanel;
