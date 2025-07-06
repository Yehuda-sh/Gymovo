// src/components/common/Dialog.tsx

import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import Button from "./Button";

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

// רכיב דיאלוג גנרי להצגת הודעות וקבלת אישור מהמשתמש
const Dialog = ({
  visible,
  title,
  message,
  onClose,
  confirmLabel = "אישור",
  cancelLabel = "ביטול",
  onConfirm,
}: Props) => (
  <Modal visible={visible} animationType="fade" transparent>
    <View style={styles.backdrop}>
      <View style={styles.box}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <Button
            title={cancelLabel}
            onPress={onClose}
            variant="outline"
            style={styles.actionButton}
          />
          {onConfirm && (
            <Button
              title={confirmLabel}
              onPress={onConfirm}
              variant="primary"
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  box: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
    color: colors.primary,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  actions: { flexDirection: "row-reverse", width: "100%", gap: 10 },
  actionButton: { flex: 1, marginVertical: 0 },
});

export default Dialog;
