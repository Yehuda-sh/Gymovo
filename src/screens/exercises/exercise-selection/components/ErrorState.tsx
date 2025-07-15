// src/screens/exercises/exercise-selection/components/ErrorState.tsx
// רכיב מצב שגיאה מעוצב למסך בחירת תרגילים

import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../../../theme/colors";
import { styles } from "../styles/exerciseSelectionStyles";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "שגיאה בטעינת התרגילים",
  onRetry,
  showRetryButton = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית כניסה
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // אנימציית רעד קלה
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, shakeAnim]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <View style={styles.errorContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark || colors.primary]}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[
          errorStyles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <View style={errorStyles.iconContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
        </View>
        <Text style={styles.errorText}>{message}</Text>

        {showRetryButton && onRetry && (
          <TouchableOpacity
            style={errorStyles.retryButton}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={16} color={colors.primary} />
            <Text style={errorStyles.retryText}>נסה שנית</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const errorStyles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: 8,
  },
  retryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
});

export default ErrorState;
