// src/components/settings/SettingsItem.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { colors, withOpacity } from "../../theme/colors";

interface SettingsItemProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  value?: string | number | boolean;
  type: "toggle" | "navigation" | "info" | "picker";
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
  danger?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  icon,
  value,
  type,
  onPress,
  onToggle,
  disabled = false,
  danger = false,
}) => {
  const renderRightElement = () => {
    switch (type) {
      case "toggle":
        return (
          <Switch
            value={value as boolean}
            onValueChange={onToggle}
            disabled={disabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={value ? colors.primaryLight : colors.textMuted}
          />
        );

      case "navigation":
        return (
          <View style={styles.navigationContainer}>
            {value && <Text style={styles.valueText}>{value}</Text>}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </View>
        );

      case "info":
        return value ? <Text style={styles.valueText}>{value}</Text> : null;

      case "picker":
        return (
          <View style={styles.navigationContainer}>
            <Text style={styles.valueText}>{value}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.textSecondary}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const Component =
    type === "toggle" || type === "info" ? View : TouchableOpacity;

  return (
    <Component
      style={[
        styles.container,
        disabled && styles.disabled,
        danger && styles.danger,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <View style={styles.leftContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={danger ? colors.danger : colors.primary}
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              danger && styles.dangerText,
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
          {description && (
            <Text style={[styles.description, disabled && styles.disabledText]}>
              {description}
            </Text>
          )}
        </View>
      </View>

      {renderRightElement()}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.disabled,
  },
  danger: {
    backgroundColor: withOpacity(colors.danger, 0.05),
  },
  dangerText: {
    color: colors.danger,
  },
});
