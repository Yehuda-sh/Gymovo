// src/components/common/Input.tsx - תיקון שגיאות TypeScript + עיצוב משופר

import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

const Input = ({
  label,
  error,
  iconName,
  style,
  value,
  ...restOfProps
}: Props) => {
  const focusAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const hasValue = value && value.length > 0;
  const hasError = Boolean(error);

  useEffect(() => {
    // Animation when focused or has value
    if (hasValue || hasError) {
      Animated.parallel([
        Animated.timing(focusAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [hasValue, hasError, focusAnim, glowAnim]);

  // תיקון שגיאת TypeScript - החזרת arrays במקום פונקציות
  const getBorderColors = (): [string, string] => {
    if (hasError) {
      return ["#ff3366", "#ff6b9d"];
    } else if (hasValue) {
      return ["#667eea", "#764ba2"];
    } else {
      return ["rgba(255, 255, 255, 0.3)", "rgba(102, 126, 234, 0.2)"];
    }
  };

  const getBackgroundColors = (): [string, string] => {
    if (hasError) {
      return ["rgba(255, 51, 102, 0.1)", "rgba(0, 0, 0, 0.8)"];
    } else if (hasValue) {
      return ["rgba(102, 126, 234, 0.1)", "rgba(0, 0, 0, 0.8)"];
    } else {
      return ["rgba(255, 255, 255, 0.05)", "rgba(0, 0, 0, 0.8)"];
    }
  };

  const getIconColor = (): string => {
    if (hasError) {
      return "#ff3366";
    } else if (hasValue) {
      return "#667eea";
    } else {
      return "rgba(255, 255, 255, 0.7)";
    }
  };

  const getLabelColor = (): string => {
    if (hasError) {
      return "#ff3366";
    } else if (hasValue) {
      return "#667eea";
    } else {
      return "rgba(255, 255, 255, 0.9)";
    }
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>
      )}

      {/* Input Container */}
      <View style={styles.inputWrapper}>
        {/* Glow Effect - תחת הכל */}
        {(hasValue || hasError) && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={
                hasError
                  ? ["#ff3366", "transparent"]
                  : ["#667eea", "transparent"]
              }
              style={styles.glow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        )}

        {/* Border Gradient */}
        <LinearGradient
          colors={getBorderColors()}
          style={styles.borderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Background */}
          <LinearGradient
            colors={getBackgroundColors()}
            style={styles.inputInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Icon */}
            {iconName && (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={22} color={getIconColor()} />
              </View>
            )}

            {/* Text Input */}
            <TextInput
              style={[
                styles.input,
                iconName ? styles.inputWithIcon : null,
                style,
              ]}
              value={value}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              {...restOfProps}
            />

            {/* Status Indicator */}
            <View style={styles.statusContainer}>
              {hasValue && !hasError && (
                <Animated.View
                  style={[
                    styles.statusIcon,
                    {
                      opacity: focusAnim,
                      transform: [
                        {
                          scale: focusAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#00ff88" />
                </Animated.View>
              )}
              {hasError && (
                <Animated.View
                  style={[
                    styles.statusIcon,
                    {
                      opacity: focusAnim,
                    },
                  ]}
                >
                  <Ionicons name="alert-circle" size={20} color="#ff3366" />
                </Animated.View>
              )}
            </View>
          </LinearGradient>
        </LinearGradient>
      </View>

      {/* Error Message */}
      {error && (
        <Animated.View
          style={[
            styles.errorContainer,
            {
              opacity: focusAnim,
              transform: [
                {
                  translateY: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="alert-circle" size={16} color="#ff3366" />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    marginBottom: 10,
    fontSize: 15,
    textAlign: "right",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  inputWrapper: {
    position: "relative",
    borderRadius: 16,
  },
  glowEffect: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    zIndex: -1,
  },
  glow: {
    flex: 1,
    borderRadius: 20,
  },
  borderGradient: {
    padding: 2,
    borderRadius: 16,
  },
  inputInner: {
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 65,
  },
  iconContainer: {
    marginRight: 14,
    width: 28,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#ffffff",
    textAlign: "right",
    includeFontPadding: false,
    padding: 0,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  inputWithIcon: {
    paddingRight: 0,
  },
  statusContainer: {
    marginLeft: 12,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIcon: {
    // Container for status icon
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255, 51, 102, 0.15)",
    borderRadius: 10,
    paddingVertical: 10,
  },
  errorText: {
    color: "#ff3366",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    textAlign: "right",
    flex: 1,
  },
});

export default Input;
