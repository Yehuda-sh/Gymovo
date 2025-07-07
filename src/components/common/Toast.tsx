// src/components/common/Toast.tsx - ✅ רכיב Toast מקצועי עם אנימציות

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

const { width: screenWidth } = Dimensions.get("window");

type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// 🎯 Singleton לניהול Toast messages
class ToastManager {
  private static instance: ToastManager;
  private listeners: ((message: ToastMessage) => void)[] = [];
  private messageQueue: ToastMessage[] = [];

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  subscribe(listener: (message: ToastMessage) => void) {
    this.listeners.push(listener);
    // שלח הודעות ממתינות
    this.messageQueue.forEach((msg) => listener(msg));
    this.messageQueue = [];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(
    message: string,
    type: ToastType = "info",
    duration?: number,
    action?: ToastMessage["action"]
  ) {
    const toastMessage: ToastMessage = {
      id: Date.now().toString(),
      message,
      type,
      duration,
      action,
    };

    if (this.listeners.length > 0) {
      this.listeners.forEach((listener) => listener(toastMessage));
    } else {
      this.messageQueue.push(toastMessage);
    }

    // Haptic feedback
    if (type === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (type === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }
}

// 🎨 Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const manager = ToastManager.getInstance();
    const unsubscribe = manager.subscribe((message) => {
      setToasts((prev) => [...prev, message]);

      // הסר אוטומטית אחרי duration
      const duration = message.duration || 3000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== message.id));
      }, duration);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <View style={styles.container}>
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            onDismiss={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </View>
    </>
  );
};

// 🍞 Toast Item Component
const ToastItem: React.FC<{
  toast: ToastMessage;
  index: number;
  onDismiss: () => void;
}> = ({ toast, index, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // כניסה
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // יציאה אוטומטית
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      dismissToast();
    }, duration - 300);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information-circle";
    }
  };

  const getColor = () => {
    switch (toast.type) {
      case "success":
        return colors.success || "#4ade80";
      case "error":
        return colors.error || "#f87171";
      case "warning":
        return colors.warning || "#fbbf24";
      case "info":
      default:
        return colors.primary || "#3b82f6";
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [
            { translateY },
            { scale },
            { translateY: index * -10 }, // Stack effect
          ],
          opacity,
          backgroundColor: colors.surface,
          borderLeftColor: getColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={dismissToast}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={getIcon()} size={24} color={getColor()} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.message} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>

        {toast.action && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              toast.action?.onPress();
              dismissToast();
            }}
          >
            <Text style={[styles.actionText, { color: getColor() }]}>
              {toast.action.label}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={dismissToast}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🎯 Static methods for easy usage
export const Toast = {
  show: (
    message: string,
    type: ToastType = "info",
    duration?: number,
    action?: ToastMessage["action"]
  ) => {
    ToastManager.getInstance().show(message, type, duration, action);
  },

  success: (message: string, duration?: number) => {
    ToastManager.getInstance().show(message, "success", duration);
  },

  error: (message: string, duration?: number) => {
    ToastManager.getInstance().show(message, "error", duration);
  },

  warning: (message: string, duration?: number) => {
    ToastManager.getInstance().show(message, "warning", duration);
  },

  info: (message: string, duration?: number) => {
    ToastManager.getInstance().show(message, "info", duration);
  },
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    width: screenWidth - 32,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

// 🎯 Export הכל
export default Toast;
