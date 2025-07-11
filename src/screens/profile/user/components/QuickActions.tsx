// src/screens/profile/user/components/QuickActions.tsx
// פעולות מהירות קומפקטיות בפרופיל

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
import { QuickActionsProps } from "../types";

// אכיפת RTL
I18nManager.forceRTL(true);

const QuickActions: React.FC<QuickActionsProps> = ({
  onSettingsPress,
  onGuidesPress,
  onSupportPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionCard} onPress={onSettingsPress}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.cardGradient}
        >
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={styles.actionTitle}>הגדרות</Text>
          <Ionicons
            name="chevron-back"
            size={16}
            color="rgba(255,255,255,0.7)"
          />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={onGuidesPress}>
        <LinearGradient
          colors={["#f093fb", "#f5576c"]}
          style={styles.cardGradient}
        >
          <Ionicons name="book" size={20} color="#fff" />
          <Text style={styles.actionTitle}>מדריכי אימון</Text>
          <Ionicons
            name="chevron-back"
            size={16}
            color="rgba(255,255,255,0.7)"
          />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={onSupportPress}>
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          style={styles.cardGradient}
        >
          <Ionicons name="help-circle" size={20} color="#fff" />
          <Text style={styles.actionTitle}>תמיכה</Text>
          <Ionicons
            name="chevron-back"
            size={16}
            color="rgba(255,255,255,0.7)"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  actionCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  actionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "right",
  },
});

export default QuickActions;
