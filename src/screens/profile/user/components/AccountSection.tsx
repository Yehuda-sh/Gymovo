// src/screens/profile/user/components/AccountSection.tsx
// פעולות חשבון - התנתקות ומחיקה

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { profileColors } from "../styles";

interface AccountSectionProps {
  user: any;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({
  user,
  onLogout,
  onDeleteAccount,
}) => {
  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <View style={styles.section}>
      <View style={styles.menuCard}>
        {/* התנתק */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress(onLogout)}
        >
          <View style={[styles.menuItemIcon, styles.dangerIcon]}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={profileColors.iconDanger}
            />
          </View>
          <Text style={[styles.menuItemText, styles.dangerText]}>התנתק</Text>
          <Ionicons
            name="chevron-back"
            size={20}
            color={profileColors.iconDanger}
          />
        </TouchableOpacity>

        {!user.isGuest && (
          <>
            <View style={styles.menuDivider} />

            {/* מחק חשבון */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress(onDeleteAccount)}
            >
              <View style={[styles.menuItemIcon, styles.dangerIcon]}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={profileColors.iconDanger}
                />
              </View>
              <Text style={[styles.menuItemText, styles.dangerText]}>
                מחק חשבון
              </Text>
              <Ionicons
                name="chevron-back"
                size={20}
                color={profileColors.iconDanger}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  menuCard: {
    backgroundColor: profileColors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: profileColors.cardBorder,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 16,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  dangerIcon: {
    backgroundColor: "rgba(255, 51, 102, 0.1)",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: profileColors.text,
    fontWeight: "500",
  },
  dangerText: {
    color: profileColors.iconDanger,
  },
  menuDivider: {
    height: 1,
    backgroundColor: profileColors.cardBorder,
    marginHorizontal: 16,
  },
});

export default AccountSection;
