// src/components/common/NetworkError.tsx - מתוקן

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";

interface NetworkErrorProps {
  onRetry: () => void;
  message?: string;
}

export const NetworkError = ({
  onRetry,
  message = "בעיה בחיבור לאינטרנט",
}: NetworkErrorProps) => (
  <View style={networkStyles.container}>
    <Ionicons name="wifi-outline" size={48} color="#cccccc" />
    <Text style={networkStyles.title}>אין חיבור</Text>
    <Text style={networkStyles.message}>{message}</Text>
    <TouchableOpacity style={networkStyles.retryButton} onPress={onRetry}>
      <Ionicons name="refresh" size={20} color="#fff" />
      <Text style={networkStyles.retryText}>נסה שוב</Text>
    </TouchableOpacity>
  </View>
);

const networkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff", // צבע קבוע במקום colors.text
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#cccccc", // צבע קבוע במקום colors.textSecondary
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
