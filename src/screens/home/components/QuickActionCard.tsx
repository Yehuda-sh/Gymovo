// src/screens/home/components/QuickActionCard.tsx
// כרטיס פעולה מהירה עם איקון וכפתור

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../../../components/ui";
import { CardLayout } from "../../../components/layouts";
import { theme } from "../../../theme";
import { QuickAction } from "../types";

interface QuickActionCardProps {
  action: QuickAction;
}

/**
 * Card component for quick actions with icon and description
 */
const QuickActionCard: React.FC<QuickActionCardProps> = ({ action }) => {
  return (
    <TouchableOpacity
      onPress={action.onPress}
      disabled={action.disabled}
      activeOpacity={0.8}
      style={{ opacity: action.disabled ? 0.5 : 1 }}
    >
      <CardLayout
        style={{
          width: 140,
          alignItems: "center",
          backgroundColor: `${action.color}10`, // 10% opacity
          borderColor: `${action.color}20`, // 20% opacity
          borderWidth: 1,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: theme.borderRadius.full,
            backgroundColor: `${action.color}20`,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <Ionicons name={action.icon as any} size={24} color={action.color} />
        </View>
        <Typography variant="body" align="center">
          {action.title}
        </Typography>
        <Typography
          variant="caption"
          color={theme.colors.textSecondary}
          align="center"
        >
          {action.subtitle}
        </Typography>
      </CardLayout>
    </TouchableOpacity>
  );
};

export default QuickActionCard;
