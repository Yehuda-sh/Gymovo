// src/screens/exercises/details/components/ExerciseEquipment.tsx
// רכיב ציוד נדרש לתרגיל

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseEquipmentProps } from "../types";

const ExerciseEquipment: React.FC<ExerciseEquipmentProps> = ({ equipment }) => {
  if (!equipment || equipment.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ציוד נדרש</Text>
      <View style={styles.equipmentContainer}>
        {equipment.map((item, index) => (
          <View key={index} style={styles.equipmentTag}>
            <Text style={styles.equipmentText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  equipmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  equipmentTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipmentText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ExerciseEquipment;
