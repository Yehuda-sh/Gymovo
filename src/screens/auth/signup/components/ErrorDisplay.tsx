// src/screens/auth/signup/components/ErrorDisplay.tsx - משופר

import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect, useRef, useCallback } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  AccessibilityInfo,
  View,
} from "react-native";
import { ErrorDisplayProps, signupColors } from "../types";

// מיפוי סוגי שגיאות לאייקונים
const ERROR_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  network: "cloud-offline",
  auth: "lock-closed",
  validation: "alert-circle",
  default: "warning",
};

// מיפוי סוגי שגיאות להודעות ידידותיות
const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "כתובת המייל כבר קיימת במערכת",
  "auth/invalid-email": "כתובת מייל לא תקינה",
  "auth/weak-password": "סיסמה חלשה מדי - נדרשות לפחות 6 תווים",
  "auth/network-request-failed": "בעיית תקשורת - בדוק את החיבור לאינטרנט",
  "auth/too-many-requests": "יותר מדי ניסיונות - נסה שוב מאוחר יותר",
};

// הרחבת ממשק לתמיכה ב-props נוספים - הגדרה פנימית בלבד
interface ErrorDisplayPropsInternal extends ErrorDisplayProps {
  type?: "network" | "auth" | "validation" | "default";
  autoHide?: boolean;
  autoHideDelay?: number;
}

const ErrorDisplay: React.FC<ErrorDisplayPropsInternal> = memo(
  ({
    error,
    onDismiss,
    type = "default",
    autoHide = false,
    autoHideDelay = 5000,
  }) => {
    // אנימציות
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // טיימר להסתרה אוטומטית
    const hideTimer = useRef<NodeJS.Timeout | null>(null);

    const handleDismiss = useCallback(() => {
      // אנימציית יציאה
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    }, [fadeAnim, slideAnim, onDismiss]);

    useEffect(() => {
      if (!error) return;

      // אנימציית כניסה
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // הכרזה לקורא מסך
      if (Platform.OS !== "web") {
        AccessibilityInfo.announceForAccessibility(`שגיאה: ${error}`);
      }

      // הסתרה אוטומטית
      if (autoHide && onDismiss) {
        hideTimer.current = setTimeout(() => {
          handleDismiss();
        }, autoHideDelay);
      }

      return () => {
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
        }
      };
    }, [
      error,
      fadeAnim,
      slideAnim,
      scaleAnim,
      autoHide,
      autoHideDelay,
      handleDismiss,
      onDismiss,
    ]);

    if (!error) return null;

    // המרת קוד שגיאה להודעה ידידותית
    const displayMessage = ERROR_MESSAGES[error] || error;

    // בחירת אייקון לפי סוג
    const iconName = ERROR_ICONS[type] || ERROR_ICONS.default;

    return (
      <Animated.View
        style={[
          styles.errorContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={22} color={signupColors.danger} />
        </View>

        <Text
          style={styles.errorText}
          numberOfLines={2}
          accessibilityLabel={`הודעת שגיאה: ${displayMessage}`}
        >
          {displayMessage}
        </Text>

        {onDismiss && (
          <TouchableOpacity
            onPress={handleDismiss}
            style={styles.dismissButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="סגור הודעת שגיאה"
            accessibilityRole="button"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={signupColors.danger}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
);

// שם לדיבוג
ErrorDisplay.displayName = "ErrorDisplay";

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: signupColors.errorBackground,
    borderColor: signupColors.errorBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: signupColors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    marginRight: 12,
    padding: 2,
  },
  errorText: {
    color: signupColors.danger,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
    lineHeight: 20,
  },
  dismissButton: {
    marginLeft: 12,
    padding: 2,
  },
});

export default ErrorDisplay;
