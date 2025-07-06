// src/components/common/Input.tsx

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

// Props המאפשרים לרכיב לקבל את כל התכונות של TextInput סטנדרטי, בתוספת יכולות משלנו
type Props = TextInputProps & {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

const Input = ({ label, error, iconName, style, ...restOfProps }: Props) => (
  <View style={styles.container}>
    {/* תווית שמוצגת מעל השדה */}
    {label && <Text style={styles.label}>{label}</Text>}

    {/* קונטיינר המכיל את האייקון ושדה הטקסט */}
    <View style={[styles.inputContainer, error && styles.inputError]}>
      {/* הצגה מותנית של אייקון בצד ימין */}
      {iconName && (
        <Ionicons
          name={iconName}
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[
          styles.input,
          // אם יש אייקון, נוסיף ריווח כדי שהטקסט לא יתנגש בו
          iconName ? styles.inputWithIcon : null,
          style,
        ]}
        placeholderTextColor="#888"
        {...restOfProps}
      />
    </View>

    {/* הצגה מותנית של הודעת שגיאה מתחת לשדה */}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 12 },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: colors.primary,
    textAlign: "right",
  },
  inputContainer: {
    // RTL Support: היפוך כיוון כדי שהאייקון יהיה מימין
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#f7f7fa",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  icon: {
    // RTL Support: ריווח בצד ימין של האייקון
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
    textAlign: "right",
  },
  inputWithIcon: {
    // RTL Support: מחיקת הריווח הימני כשיש אייקון
    paddingRight: 0,
  },
  inputError: { borderColor: "#e00" },
  errorText: { color: "#e00", fontSize: 12, marginTop: 4, textAlign: "right" },
});

export default Input;
