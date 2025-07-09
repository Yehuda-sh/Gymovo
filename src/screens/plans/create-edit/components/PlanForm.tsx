// src/screens/plans/create-edit/components/PlanForm.tsx
// טופס עריכת פרטי תוכנית אימון

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Input from "../../../../components/common/Input";
import { colors } from "../../../../theme/colors";
import { Plan } from "../../../../types/plan";

interface PlanFormProps {
  plan: Plan;
  onUpdateDetails: (details: Partial<Plan>) => void;
  validationErrors?: string[];
}

/**
 * Form component for editing plan details (name, description)
 */
const PlanForm: React.FC<PlanFormProps> = ({
  plan,
  onUpdateDetails,
  validationErrors = [],
}) => {
  // 🔍 חיפוש שגיאות ספציפיות
  const getFieldError = (fieldName: string) => {
    return validationErrors.find((error) => error.includes(fieldName));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>שם התוכנית</Text>
      <Input
        value={plan.name}
        onChangeText={(text) => onUpdateDetails({ name: text })}
        placeholder="לדוגמה: תוכנית כוח למתחילים"
        style={getFieldError("name") ? styles.errorInput : undefined}
      />
      {getFieldError("name") && (
        <Text style={styles.errorText}>{getFieldError("name")}</Text>
      )}

      <Text style={styles.label}>תיאור (אופציונלי)</Text>
      <Input
        value={plan.description}
        onChangeText={(text) => onUpdateDetails({ description: text })}
        placeholder="כל פרט שיעזור לך לזכור"
        multiline
        style={[
          styles.descriptionInput,
          getFieldError("description") ? styles.errorInput : undefined,
        ]}
      />
      {getFieldError("description") && (
        <Text style={styles.errorText}>{getFieldError("description")}</Text>
      )}

      <Text style={styles.label}>ימי אימון (גרור כדי לסדר)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    textAlign: "right",
    marginTop: 16,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: "right",
    marginTop: 4,
  },
});

export default PlanForm;
