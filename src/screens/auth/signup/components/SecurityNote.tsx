// src/screens/auth/signup/components/SecurityNote.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../theme/colors";
import { SecurityNoteProps, signupColors } from "../types";

const SecurityNote: React.FC<SecurityNoteProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.securityNote}>
      <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
      <Text style={styles.securityText}>הנתונים שלך מוגנים בהצפנה מתקדמת</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: signupColors.securityBackground,
    borderColor: signupColors.securityBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  securityText: {
    color: signupColors.securityText,
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default SecurityNote;
