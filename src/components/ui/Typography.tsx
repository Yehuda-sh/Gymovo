// src/components/ui/Typography.tsx
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { theme } from "../../theme";

type TypographyVariant = keyof typeof theme.typography;
type FontWeight = "normal" | "medium" | "semibold" | "bold";

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  weight?: FontWeight;
  uppercase?: boolean;
  underline?: boolean;
  italic?: boolean;
  children: React.ReactNode;
}

const fontWeightMap: Record<FontWeight, TextStyle["fontWeight"]> = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color = theme.colors.text,
  align = "left",
  weight,
  uppercase = false,
  underline = false,
  italic = false,
  style,
  children,
  ...props
}) => {
  const textStyle: TextStyle[] = [
    theme.typography[variant] as TextStyle,
    {
      color,
      textAlign: align,
      textTransform: uppercase ? "uppercase" : "none",
      textDecorationLine: underline ? "underline" : "none",
      fontStyle: italic ? "italic" : "normal",
    },
  ];

  if (weight) {
    textStyle.push({ fontWeight: fontWeightMap[weight] });
  }

  if (style) {
    textStyle.push(style as TextStyle);
  }

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};
