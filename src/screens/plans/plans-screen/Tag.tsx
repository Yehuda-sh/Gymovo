// src/screens/plans/plans-screen/Tag.tsx
// רכיב תג גמיש עם אייקון ועיצוב מותאם

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { designSystem } from "../../../theme/designSystem";
import { TagProps } from "./utils";

// רכיב תג מעוצב עם אייקון אופציונלי
const Tag: React.FC<TagProps> = ({
  text,
  color = designSystem.colors.primary.main,
  icon,
}) => (
  <View
    style={[
      styles.tag,
      {
        backgroundColor: color + "20",
        borderColor: color + "40",
      },
    ]}
  >
    {icon && <Ionicons name={icon as any} size={12} color={color} />}
    <Text style={[styles.tagText, { color }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 4,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default Tag;
