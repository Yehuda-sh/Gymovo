// src/screens/profile/user/components/AccountActions.tsx
// רכיב כפתורי פעולות חשבון

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";
import { AccountActionsProps } from "../types";

const AccountActions: React.FC<AccountActionsProps> = ({
  user,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <View style={styles.accountSection}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>יציאה מהחשבון</Text>
      </TouchableOpacity>

      {!user.isGuest && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDeleteAccount}>
          <Text style={styles.deleteText}>מחיקת חשבון</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accountSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  deleteText: {
    color: colors.error,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default AccountActions;
