// src/components/common/Modal.tsx - מודאל מותאם אישית עם אנימציות

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors } from "../../theme/colors";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "fullscreen";
  position?: "center" | "bottom";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  scrollable?: boolean;
  blurBackground?: boolean;
  showDragIndicator?: boolean;
  onBackdropPress?: () => void;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  animationType?: "fade" | "slide" | "spring";
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = "medium",
  position = "center",
  showCloseButton = true,
  closeOnBackdrop = true,
  scrollable = false,
  blurBackground = true,
  showDragIndicator = false,
  onBackdropPress,
  headerComponent,
  footerComponent,
  animationType = "spring",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateIn();
    } else {
      animateOut();
    }
  }, [visible]);

  const animateIn = () => {
    if (animationType === "fade") {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animationType === "slide") {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const animateOut = () => {
    if (animationType === "fade") {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animationType === "slide") {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getModalSize = () => {
    switch (size) {
      case "small":
        return {
          maxHeight: SCREEN_HEIGHT * 0.4,
          width: SCREEN_WIDTH * 0.8,
        };
      case "large":
        return {
          maxHeight: SCREEN_HEIGHT * 0.8,
          width: SCREEN_WIDTH * 0.9,
        };
      case "fullscreen":
        return {
          maxHeight: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
          borderRadius: 0,
        };
      default:
        return {
          maxHeight: SCREEN_HEIGHT * 0.6,
          width: SCREEN_WIDTH * 0.85,
        };
    }
  };

  const modalSize = getModalSize();

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onBackdropPress?.();
      onClose();
    }
  };

  const renderContent = () => {
    const content = (
      <>
        {showDragIndicator && position === "bottom" && (
          <View style={styles.dragIndicator} />
        )}

        {(title || headerComponent || showCloseButton) && (
          <View style={styles.header}>
            {headerComponent || (
              <>
                {title && <Text style={styles.title}>{title}</Text>}
                {showCloseButton && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}

        <View style={styles.content}>{children}</View>

        {footerComponent && (
          <View style={styles.footer}>{footerComponent}</View>
        )}
      </>
    );

    if (scrollable) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  const getAnimatedStyle = () => {
    if (animationType === "slide" && position === "bottom") {
      return {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      };
    }
    return {
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    };
  };

  return (
    <RNModal
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
        style={[
          styles.container,
          position === "bottom" && styles.bottomContainer,
        ]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.modal,
            modalSize,
            position === "bottom" && styles.bottomModal,
            getAnimatedStyle(),
          ]}
        >
          {renderContent()}
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH - 40,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  bottomModal: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: SCREEN_WIDTH,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  content: {
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default Modal;
