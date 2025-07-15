// src/screens/plans/plans-screen/EmptyState.tsx
// רכיב מצב ריק מעוצב עם אנימציות ועידוד

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { designSystem } from "../../../theme/designSystem";
import { colors } from "../../../theme/colors";
import { EmptyStateProps } from "./utils";

// רכיב מצב ריק עם אנימציית כניסה מרשימה
const EmptyState: React.FC<EmptyStateProps> = ({ onCreatePlan }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 300,
        ...designSystem.animation.easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // Dependencies לא נדרשים כי useRef values לא משתנים

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={80}
          color={colors.textMuted}
        />
      </View>

      <Text style={styles.emptyTitle}>אין לך תוכניות עדיין</Text>
      <Text style={styles.emptyText}>
        צור תוכנית אימון מותאמת אישית או בחר מהתוכניות הציבוריות
      </Text>

      <TouchableOpacity onPress={onCreatePlan}>
        <LinearGradient
          colors={[
            designSystem.colors.primary.main,
            designSystem.colors.primary.dark,
          ]}
          style={styles.createButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.createButtonText}>צור תוכנית ראשונה</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    ...designSystem.shadows.lg,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmptyState;
