// src/screens/auth/convert-guest/components/ConvertForm.tsx
import React, { memo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConvertFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  error: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onNameChange: (name: string) => void;
  formSlide: Animated.Value;
}

const colors = {
  inputBackground: "rgba(255, 255, 255, 0.1)",
  inputBorder: "rgba(255, 255, 255, 0.2)",
  inputBorderFocused: "#FF6B35",
  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  placeholder: "#64748B",
};

const ConvertForm: React.FC<ConvertFormProps> = memo(
  ({
    email,
    password,
    confirmPassword,
    name,
    error,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onNameChange,
    formSlide,
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    return (
      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: formSlide,
            transform: [
              {
                translateY: formSlide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* שם מלא */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>שם מלא</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "name" && styles.inputWrapperFocused,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="הכנס את שמך המלא"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={onNameChange}
              autoCapitalize="words"
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* אימייל */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>כתובת אימייל</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "email" && styles.inputWrapperFocused,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="הכנס כתובת אימייל"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* סיסמה */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>סיסמה</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "password" && styles.inputWrapperFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="בחר סיסמה חזקה"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* אישור סיסמה */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>אישור סיסמה</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "confirmPassword" && styles.inputWrapperFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="הכנס שוב את הסיסמה"
              placeholderTextColor={colors.placeholder}
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* יתרונות המרה */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>מה תקבל:</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.benefitText}>שמירת כל האימונים שלך</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.benefitText}>גיבוי אוטומטי בענן</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.benefitText}>גישה מכל מכשיר</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
);

ConvertForm.displayName = "ConvertForm";

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.inputBorderFocused,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  benefitsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default ConvertForm;
