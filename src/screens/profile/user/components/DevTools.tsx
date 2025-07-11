// src/screens/profile/user/components/DevTools.tsx
// כלי פיתוח קומפקטיים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../theme/colors";
import { DevToolsProps } from "../types";

// אכיפת RTL
I18nManager.forceRTL(true);

const DevTools: React.FC<DevToolsProps> = ({
  user,
  onClearQuiz,
  onCreatePartialQuiz,
  onClearAllData,
}) => {
  if (!__DEV__) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="construct" size={16} color="#ffa726" />
        <Text style={styles.headerText}>כלי פיתוח</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.devButton} onPress={onClearQuiz}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="refresh" size={16} color="#fff" />
            <Text style={styles.buttonText}>איפוס שאלון</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.devButton}
          onPress={onCreatePartialQuiz}
        >
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="shuffle" size={16} color="#fff" />
            <Text style={styles.buttonText}>החלפת תוכנית (אקראי)</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.devButton} onPress={onClearAllData}>
          <LinearGradient
            colors={["#ff7675", "#e17055"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={styles.buttonText}>מחיקת כל הנתונים</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 167, 38, 0.1)",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 167, 38, 0.3)",
    marginTop: 10,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffa726",
  },
  buttonsContainer: {
    gap: 8,
  },
  devButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  buttonText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    textAlign: "right",
  },
});

export default DevTools;
