// src/screens/auth/signup/components/SignupErrorModal.tsx

import React from "react";
import { View, Modal, StyleSheet, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ErrorDisplay from "./ErrorDisplay";
import { signupColors } from "../types";

const SignupErrorModal = ({
  visible,
  error,
  onDismiss,
}: {
  visible: boolean;
  error: string;
  onDismiss: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onDismiss}
  >
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ErrorDisplay error={error} onDismiss={onDismiss} />

        <TouchableOpacity
          onPress={onDismiss}
          activeOpacity={0.85}
          style={styles.okButtonWrapper}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={[signupColors.primary, signupColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.okButton}
          >
            <Text style={styles.okButtonText}>אוקיי</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    minWidth: 270,
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: signupColors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.17,
    shadowRadius: 18,
    elevation: 12,
    alignItems: "center",
  },
  okButtonWrapper: {
    width: "100%",
    marginTop: 14,
    alignItems: "center",
  },
  okButton: {
    width: 110,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 6,
  },
  okButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default SignupErrorModal;
