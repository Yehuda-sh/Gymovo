// src/screens/profile/guest/components/GuestProfileContent.tsx
// רכיב התוכן עבור מסך פרופיל אורח

import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { GuestProfileContentProps } from "../types";

const GuestProfileContent: React.FC<GuestProfileContentProps> = ({
  title = "רוצה להפוך למקצוען?",
  subtitle = "צור חשבון בחינם כדי לשמור את האימונים, לעקוב אחר ההתקדמות ולקבל גישה לכל הפיצרים.",
}) => {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
});

export default GuestProfileContent;
