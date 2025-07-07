// src/components/common/Input.tsx - עדכון לטקסט נראה

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

const Input = ({ label, error, iconName, style, ...restOfProps }: Props) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}

    <View style={[styles.inputContainer, error && styles.inputError]}>
      {iconName && (
        <Ionicons
          name={iconName}
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, iconName ? styles.inputWithIcon : null, style]}
        placeholderTextColor="rgba(255, 255, 255, 0.5)" // ברירת מחדל לטקסט placeholder
        {...restOfProps}
      />
    </View>

    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 12 },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)", // שינוי לבן לרקע כהה
    textAlign: "right",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // רקע כהה ברירת מחדל
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    minHeight: 50,
  },
  icon: {
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#ffffff", // טקסט לבן תמיד
    textAlign: "right",
  },
  inputWithIcon: {
    paddingRight: 0,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    fontWeight: "500",
  },
});

export default Input;
