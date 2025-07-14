// src/components/common/Toast.tsx - מערכת הודעות Toast מותאמת אישית

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: "top" | "bottom";
  offset?: number;
  onPress?: () => void;
  onHide?: () => void;
}

interface ToastProps extends ToastConfig {
  visible: boolean;
  hide: () => void;
}

const ToastComponent: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 3000,
  position = "top",
  offset = 50,
  visible,
  hide,
  onPress,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(
        type === "error"
          ? Haptics.NotificationFeedbackType.Error
          : type === "success"
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );

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
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === "top" ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hide();
      onHide?.();
    });
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: "#4CAF50" };
      case "error":
        return { name: "alert-circle", color: "#FF4B4B" };
      case "warning":
        return { name: "warning", color: "#FFA726" };
      case "info":
        return { name: "information-circle", color: colors.primary };
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#E8F5E9";
      case "error":
        return "#FFEBEE";
      case "warning":
        return "#FFF3E0";
      case "info":
        return "#E3F2FD";
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#FF4B4B";
      case "warning":
        return "#FFA726";
      case "info":
        return colors.primary;
    }
  };

  if (!visible) return null;

  const icon = getIcon();

  return (
    <Animated.View
      style={[
        styles.container,
        position === "top" ? { top: offset } : { bottom: offset },
        {
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          onPress?.();
          hideToast();
        }}
        style={[
          styles.toast,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: getBorderColor() }]}>
            {title}
          </Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Toast Manager Class
class ToastManager {
  private static instance: ToastManager;
  private showToastCallback?: (config: ToastConfig) => void;

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  setShowToastCallback(callback: (config: ToastConfig) => void) {
    this.showToastCallback = callback;
  }

  show(config: ToastConfig) {
    this.showToastCallback?.(config);
  }

  success(title: string, message?: string, options?: Partial<ToastConfig>) {
    this.show({ ...options, type: "success", title, message });
  }

  error(title: string, message?: string, options?: Partial<ToastConfig>) {
    this.show({ ...options, type: "error", title, message });
  }

  warning(title: string, message?: string, options?: Partial<ToastConfig>) {
    this.show({ ...options, type: "warning", title, message });
  }

  info(title: string, message?: string, options?: Partial<ToastConfig>) {
    this.show({ ...options, type: "info", title, message });
  }
}

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastConfig, setToastConfig] = React.useState<ToastConfig | null>(
    null
  );
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    ToastManager.getInstance().setShowToastCallback((config) => {
      setToastConfig(config);
      setVisible(true);
    });
  }, []);

  return (
    <>
      {children}
      {toastConfig && (
        <ToastComponent
          {...toastConfig}
          visible={visible}
          hide={() => setVisible(false)}
        />
      )}
    </>
  );
};

// Export Toast API
export const Toast = ToastManager.getInstance();

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    maxWidth: SCREEN_WIDTH - 40,
    minHeight: 56,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default ToastComponent;
