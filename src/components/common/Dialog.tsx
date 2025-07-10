// src/components/common/Dialog.tsx - פופ-אפ מעוצב לשיחלף Alert.alert

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "../../theme/colors";

// 🎭 טיפוסי הדיאלוג
export type DialogType = "info" | "success" | "warning" | "error" | "confirm";

export interface DialogButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export interface DialogConfig {
  title: string;
  message?: string;
  type?: DialogType;
  buttons?: DialogButton[];
  cancelable?: boolean;
  icon?: string;
}

// 🎯 מנהל הדיאלוגים
class DialogManager {
  private static instance: DialogManager;
  private listeners: ((config: DialogConfig | null) => void)[] = [];

  static getInstance(): DialogManager {
    if (!DialogManager.instance) {
      DialogManager.instance = new DialogManager();
    }
    return DialogManager.instance;
  }

  subscribe(listener: (config: DialogConfig | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(config: DialogConfig) {
    this.listeners.forEach((listener) => listener(config));

    // Haptic feedback
    if (config.type === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (config.type === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (config.type === "warning") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  hide() {
    this.listeners.forEach((listener) => listener(null));
  }
}

// 🎨 רכיב הדיאלוג
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);

  useEffect(() => {
    const manager = DialogManager.getInstance();
    const unsubscribe = manager.subscribe(setDialogConfig);
    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      {dialogConfig && (
        <DialogModal
          config={dialogConfig}
          onClose={() => setDialogConfig(null)}
        />
      )}
    </>
  );
};

// 🪟 מודל הדיאלוג
const DialogModal: React.FC<{
  config: DialogConfig;
  onClose: () => void;
}> = ({ config, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציה כניסה
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // טיפול בלחצן חזרה
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (config.cancelable !== false) {
        handleClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getIcon = () => {
    if (config.icon) return config.icon;
    
    switch (config.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "confirm":
        return "help-circle";
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (config.type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "warning":
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const buttons = config.buttons || [{ text: "אישור", style: "default" }];

  return (
    <Modal transparent animationType="none" visible>
      <BlurView intensity={20} style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={config.cancelable !== false ? handleClose : undefined}
        />
        
        <Animated.View
          style={[
            styles.dialog,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* כותרת עם אייקון */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: getIconColor() + "20" }]}>
              <Ionicons
                name={getIcon() as any}
                size={32}
                color={getIconColor()}
              />
            </View>
            <Text style={styles.title}>{config.title}</Text>
          </View>

          {/* הודעה */}
          {config.message && (
            <Text style={styles.message}>{config.message}</Text>
          )}

          {/* כפתורים */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === "destructive" && styles.destructiveButton,
                  button.style === "cancel" && styles.cancelButton,
                  buttons.length === 1 && styles.singleButton,
                ]}
                onPress={() => {
                  button.onPress?.();
                  handleClose();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "destructive" && styles.destructiveText,
                    button.style === "cancel" && styles.cancelText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

// 🔌 API נוח לשימוש
export const Dialog = {
  show: (config: DialogConfig) => {
    DialogManager.getInstance().show(config);
  },

  alert: (title: string, message?: string, buttons?: DialogButton[]) => {
    Dialog.show({ title, message, buttons, type: "info" });
  },

  confirm: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    Dialog.show({
      title,
      message,
      type: "confirm",
      buttons: [
        { text: "ביטול", style: "cancel", onPress: onCancel },
        { text: "אישור", style: "default", onPress: onConfirm },
      ],
    });
  },

  success: (title: string, message?: string, onPress?: () => void) => {
    Dialog.show({
      title,
      message,
      type: "success",
      buttons: [{ text: "נהדר!", onPress }],
    });
  },

  error: (title: string, message?: string, onPress?: () => void) => {
    Dialog.show({
      title,
      message,
      type: "error",
      buttons: [{ text: "הבנתי", onPress }],
    });
  },

  warning: (title: string, message?: string, buttons?: DialogButton[]) => {
    Dialog.show({
      title,
      message,
      type: "warning",
      buttons: buttons || [{ text: "הבנתי" }],
    });
  },
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: 340,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  singleButton: {
    marginHorizontal: 0,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  destructiveButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  cancelText: {
    color: colors.text,
  },
  destructiveText: {
    color: colors.text,
  },
});

export default Dialog;
