// src/screens/auth/signup/components/SignupForm.tsx

import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SignupFormProps, signupColors } from "../types";
import Slider from "@react-native-community/slider";

const colors = signupColors;

const SignupForm: React.FC<SignupFormProps> = ({
  email,
  password,
  age,
  error,
  onEmailChange,
  onPasswordChange,
  onAgeChange,
  formSlide,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const ageNumber = Number(age) >= 16 && Number(age) <= 100 ? Number(age) : 16;

  return (
    <Animated.View
      style={[
        styles.formSection,
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
      {/* Email */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor={colors.inputPlaceholder}
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            accessibilityLabel="כתובת מייל"
            importantForAutofill="yes"
            returnKeyType="next"
          />
        </View>
        <Text style={styles.inputLabel}>כתובת מייל</Text>
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="סיסמה חזקה"
            placeholderTextColor={colors.inputPlaceholder}
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            accessibilityLabel="סיסמה"
            importantForAutofill="yes"
            returnKeyType="next"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            accessibilityLabel={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.inputLabel}>סיסמה (6 תווים לפחות)</Text>
      </View>

      {/* Age as Slider */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>גיל</Text>
        <View style={styles.sliderRow}>
          <Slider
            style={{ flex: 1 }}
            minimumValue={16}
            maximumValue={100}
            value={ageNumber}
            step={1}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.inputBorder}
            thumbTintColor={colors.primary}
            onValueChange={(value) => onAgeChange(String(value))}
            accessibilityLabel="בחר גיל"
          />
          <View style={styles.bubbleContainer}>
            <View style={styles.ageBubble}>
              <Text style={styles.ageValue}>{ageNumber}</Text>
            </View>
          </View>
        </View>
        {/* מרווח בין הסליידר להערה */}
        <View style={{ height: 14 }} />
        <Text style={styles.ageNote}>ניתן להירשם מגיל 16 בלבד</Text>
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 36,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.inputBackground,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    minHeight: 22,
  },
  eyeButton: {
    padding: 4,
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: "right",
    fontWeight: "500",
    marginBottom: 2,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
    position: "relative",
  },
  bubbleContainer: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ageBubble: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 3,
    minWidth: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  ageValue: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
  ageNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center", // הכי חשוב!
    fontWeight: "500",
  },
  errorText: {
    color: colors.errorText,
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
    backgroundColor: colors.errorBackground,
    borderRadius: 6,
    padding: 6,
  },
});

export default SignupForm;
