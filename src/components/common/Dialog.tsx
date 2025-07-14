// src/components/common/Dialog.tsx - דיאלוג מתקדם עם אנימציות ואפשרויות גמישות

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors } from "../../theme/colors";
import Button from "./Button";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface DialogAction {
  text: string;
  onPress: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
  disabled?: boolean;
}

interface DialogProps {
  visible: boolean;
  onClose?: () => void;
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  actions?: DialogAction[];
  type?: "info" | "warning" | "error" | "success" | "confirm";
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  customContent?: React.ReactNode;
  animationType?: "fade" | "slide" | "bounce";
  blurBackground?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  message,
  icon,
  iconColor,
  actions = [],
  type = "info",
  closeOnBackdrop = true,
  showCloseButton = false,
  customContent,
  animationType = "bounce",
  blurBackground = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [actionLoadingStates, setActionLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateIn();
    } else {
      animateOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: animationType === "bounce" ? 50 : 100,
        friction: animationType === "bounce" ? 8 : 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          defaultIcon: "checkmark-circle" as const,
          defaultColor: "#4CAF50",
          gradientColors: ["#4CAF50", "#45a049"],
        };
      case "error":
        return {
          defaultIcon: "alert-circle" as const,
          defaultColor: "#FF4B4B",
          gradientColors: ["#FF4B4B", "#f44336"],
        };
      case "warning":
        return {
          defaultIcon: "warning" as const,
          defaultColor: "#FFA726",
          gradientColors: ["#FFA726", "#FB8C00"],
        };
      case "confirm":
        return {
          defaultIcon: "help-circle" as const,
          defaultColor: colors.primary,
          gradientColors: [colors.primary, colors.secondary],
        };
      default:
        return {
          defaultIcon: "information-circle" as const,
          defaultColor: colors.primary,
          gradientColors: [colors.primary, colors.secondary],
        };
    }
  };

  const typeConfig = getTypeConfig();
  const displayIcon = icon || typeConfig.defaultIcon;
  const displayIconColor = iconColor || typeConfig.defaultColor;

  const handleBackdropPress = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  const handleActionPress = async (action: DialogAction, index: number) => {
    if (action.loading || action.disabled) return;

    setActionLoadingStates({ ...actionLoadingStates, [index]: true });

    try {
      await action.onPress();
      if (onClose) onClose();
    } catch (error) {
      console.error("Dialog action error:", error);
    } finally {
      setActionLoadingStates({ ...actionLoadingStates, [index]: false });
    }
  };

  // Default actions if none provided
  const displayActions =
    actions.length > 0
      ? actions
      : type === "confirm"
      ? [
          {
            text: "ביטול",
            onPress: onClose || (() => {}),
            variant: "outline" as const,
          },
          {
            text: "אישור",
            onPress: onClose || (() => {}),
            variant: "primary" as const,
          },
        ]
      : [
          {
            text: "סגור",
            onPress: onClose || (() => {}),
            variant: "primary" as const,
          },
        ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {blurBackground && (
            <BlurView
              intensity={20}
              tint="dark"
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </Animated.View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.dialog,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {showCloseButton && onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconBackground,
                { backgroundColor: `${displayIconColor}20` },
              ]}
            >
              <Ionicons name={displayIcon} size={48} color={displayIconColor} />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          {customContent && (
            <View style={styles.customContent}>{customContent}</View>
          )}

          <View style={styles.actions}>
            {displayActions.map((action, index) => (
              <Button
                key={index}
                title={action.text}
                onPress={() => handleActionPress(action, index)}
                variant={action.variant || "primary"}
                loading={actionLoadingStates[index] || action.loading}
                disabled={action.disabled}
                fullWidth
                style={index > 0 ? styles.actionButtonSpacing : undefined}
              />
            ))}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Dialog Manager for easy usage
class DialogManager {
  private static instance: DialogManager;
  private showDialogCallback?: (props: DialogProps) => void;

  static getInstance(): DialogManager {
    if (!DialogManager.instance) {
      DialogManager.instance = new DialogManager();
    }
    return DialogManager.instance;
  }

  setShowDialogCallback(callback: (props: DialogProps) => void) {
    this.showDialogCallback = callback;
  }

  show(props: DialogProps) {
    this.showDialogCallback?.(props);
  }

  // Convenience methods
  info(title: string, message?: string, actions?: DialogAction[]) {
    this.show({
      visible: true,
      type: "info",
      title,
      message,
      actions,
    });
  }

  success(title: string, message?: string, actions?: DialogAction[]) {
    this.show({
      visible: true,
      type: "success",
      title,
      message,
      actions,
    });
  }

  error(title: string, message?: string, actions?: DialogAction[]) {
    this.show({
      visible: true,
      type: "error",
      title,
      message,
      actions,
    });
  }

  warning(title: string, message?: string, actions?: DialogAction[]) {
    this.show({
      visible: true,
      type: "warning",
      title,
      message,
      actions,
    });
  }

  confirm(
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void
  ) {
    this.show({
      visible: true,
      type: "confirm",
      title,
      message,
      actions: [
        {
          text: "ביטול",
          onPress: onCancel || (() => {}),
          variant: "outline",
        },
        {
          text: "אישור",
          onPress: onConfirm,
          variant: "primary",
        },
      ],
    });
  }
}

// Dialog Provider Component
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

  React.useEffect(() => {
    DialogManager.getInstance().setShowDialogCallback((props) => {
      setDialogProps(props);
    });
  }, []);

  return (
    <>
      {children}
      {dialogProps && (
        <Dialog
          {...dialogProps}
          onClose={() => {
            dialogProps.onClose?.();
            setDialogProps(null);
          }}
        />
      )}
    </>
  );
};

// Export Dialog API
export const DialogService = DialogManager.getInstance();

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    maxWidth: SCREEN_WIDTH - 48,
    width: "100%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  customContent: {
    width: "100%",
    marginBottom: 24,
  },
  actions: {
    width: "100%",
  },
  actionButtonSpacing: {
    marginTop: 12,
  },
});

export default Dialog;
