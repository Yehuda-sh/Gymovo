// src/components/common/Input.tsx - שדה קלט מותאם עם אנימציות ותמיכה ב-RTL

import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Animated,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { colors } from "../../theme/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  showPasswordToggle?: boolean;
  variant?: "default" | "outline" | "filled";
  size?: "small" | "medium" | "large";
  helperText?: string;
  required?: boolean;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  showPasswordToggle = false,
  variant = "default",
  size = "medium",
  helperText,
  required = false,
  containerStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, value]);

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          height: 40,
          fontSize: 14,
          paddingHorizontal: 12,
        };
      case "large":
        return {
          height: 56,
          fontSize: 18,
          paddingHorizontal: 20,
        };
      default:
        return {
          height: 48,
          fontSize: 16,
          paddingHorizontal: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const labelStyle = {
    position: "absolute" as const,
    right: I18nManager.isRTL ? undefined : 16,
    left: I18nManager.isRTL ? 16 : undefined,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [sizeStyles.height / 2 - 8, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [sizeStyles.fontSize, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [
        colors.textSecondary,
        error ? colors.error : colors.primary,
      ],
    }),
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      {label && (
        <Animated.Text style={labelStyle}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
            backgroundColor:
              variant === "filled" ? colors.backgroundSecondary : "transparent",
          },
          variant === "outline" && styles.outlineVariant,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={
              error
                ? colors.error
                : isFocused
                ? colors.primary
                : colors.textSecondary
            }
            style={styles.icon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            sizeStyles,
            iconName && styles.inputWithIcon,
            showPasswordToggle && styles.inputWithToggle,
            { textAlign: I18nManager.isRTL ? "right" : "left" },
          ]}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  outlineVariant: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: "System",
  },
  inputWithIcon: {
    paddingLeft: I18nManager.isRTL ? 16 : 40,
    paddingRight: I18nManager.isRTL ? 40 : 16,
  },
  inputWithToggle: {
    paddingRight: I18nManager.isRTL ? 16 : 40,
    paddingLeft: I18nManager.isRTL ? 40 : 16,
  },
  icon: {
    position: "absolute",
    left: I18nManager.isRTL ? undefined : 12,
    right: I18nManager.isRTL ? 12 : undefined,
  },
  passwordToggle: {
    position: "absolute",
    right: I18nManager.isRTL ? undefined : 12,
    left: I18nManager.isRTL ? 12 : undefined,
    padding: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginLeft: 4,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  required: {
    color: colors.error,
  },
});

export default Input;
