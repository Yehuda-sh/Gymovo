// src/screens/profile/user/components/QuickActions.tsx
// רכיב פעולות מהירות

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";
import { QuickActionsProps } from "../types";

const QuickActions: React.FC<QuickActionsProps> = ({
  onSettingsPress,
  onGuidesPress,
  onSupportPress,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>פעולות מהירות</Text>

      <TouchableOpacity style={styles.actionCard} onPress={onSettingsPress}>
        <View style={styles.actionIcon}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>הגדרות</Text>
          <Text style={styles.actionSubtitle}>התאמה אישית ועדיפויות</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={onGuidesPress}>
        <View style={styles.actionIcon}>
          <Ionicons name="book-outline" size={24} color={colors.text} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>מדריכי אימון</Text>
          <Text style={styles.actionSubtitle}>טיפים וטכניקות</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={onSupportPress}>
        <View style={styles.actionIcon}>
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>תמיכה</Text>
          <Text style={styles.actionSubtitle}>שאלות נפוצות ועזרה</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
  },
});

export default QuickActions;
