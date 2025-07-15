// src/screens/profile/guest/components/GuestProfileIcon.tsx
// רכיב האייקון עבור מסך פרופיל אורח

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { colors } from "../../../../theme/colors";
interface GuestProfileIconProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
}

const GuestProfileIcon: React.FC<GuestProfileIconProps> = ({
  iconName = "person-circle-outline",
  iconSize = 80,
  iconColor = colors.primary,
}) => {
  return <Ionicons name={iconName as any} size={iconSize} color={iconColor} />;
};

export default GuestProfileIcon;
