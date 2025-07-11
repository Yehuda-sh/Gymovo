// src/screens/profile/user/components/AccountActions.tsx
// פעולות חשבון קומפקטיות

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../theme/colors";
import { AccountActionsProps } from "../types";

// אכיפת RTL
I18nManager.forceRTL(true);

const AccountActions: React.FC<AccountActionsProps> = ({
  user,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
        <LinearGradient
          colors={["#fd79a8", "#fdcb6e"]}
          style={styles.buttonGradient}
        >
          <Ionicons name="log-out" size={18} color="#fff" />
          <Text style={styles.buttonText}>יציאה מהחשבון</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onDeleteAccount}>
        <View style={styles.deleteButton}>
          <Ionicons name="trash" size={18} color="#ff7675" />
          <Text style={styles.deleteButtonText}>מחיקת חשבון</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  buttonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "right",
  },
  deleteButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "rgba(255, 118, 117, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 118, 117, 0.3)",
  },
  deleteButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#ff7675",
    textAlign: "right",
  },
});

export default AccountActions;
