// src/screens/auth/convert-guest/components/ConvertErrorModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ConvertErrorModalProps {
  visible: boolean;
  error: string;
  onDismiss: () => void;
}

const colors = {
  background: "rgba(0, 0, 0, 0.8)",
  modalBackground: "#1F2937",
  text: "#FFFFFF",
  textSecondary: "#9CA3AF",
  error: "#EF4444",
  button: "#374151",
};

const ConvertErrorModal: React.FC<ConvertErrorModalProps> = ({
  visible,
  error,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={40} color={colors.error} />
          </View>

          <Text style={styles.title}>שגיאה בהמרת החשבון</Text>
          <Text style={styles.message}>{error}</Text>

          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>הבנתי</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: colors.modalBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.button,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
});

export default ConvertErrorModal;
