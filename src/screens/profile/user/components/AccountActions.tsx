// src/screens/profile/user/components/AccountActions.tsx
// פעולות חשבון בעיצוב מודרני

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import * as Haptics from "expo-haptics";
import { AccountActionsProps } from "../types";

// צבעים בהשראת העיצוב החדש
const accountColors = {
  cardBackground: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.1)",
  iconDanger: "#ff3366",
  text: "#ffffff",
};

// אכיפת RTL
I18nManager.forceRTL(true);

const AccountActions: React.FC<AccountActionsProps> = ({
  user,
  onLogout,
  onDeleteAccount,
}) => {
  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  return (
    <View style={styles.container}>
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
              color={accountColors.iconDanger}
            />
          </View>
          <Text style={[styles.menuItemText, styles.dangerText]}>
            יציאה מהחשבון
          </Text>
          <Ionicons
            name="chevron-back"
            size={20}
            color={accountColors.iconDanger}
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
                  color={accountColors.iconDanger}
                />
              </View>
              <Text style={[styles.menuItemText, styles.dangerText]}>
                מחיקת חשבון
              </Text>
              <Ionicons
                name="chevron-back"
                size={20}
                color={accountColors.iconDanger}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  menuCard: {
    backgroundColor: accountColors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: accountColors.cardBorder,
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
    color: accountColors.text,
    fontWeight: "500",
  },
  dangerText: {
    color: accountColors.iconDanger,
  },
  menuDivider: {
    height: 1,
    backgroundColor: accountColors.cardBorder,
    marginHorizontal: 16,
  },
});

export default AccountActions;
