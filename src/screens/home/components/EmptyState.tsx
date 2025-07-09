// src/screens/home/components/EmptyState.tsx
// מצב ריק כאשר אין אימונים

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";

import { Button, CardLayout, Spacer, Typography } from "../../../components/ui";
import { theme } from "../../../theme";
import { RootStackParamList } from "../../../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Empty state component when no workouts are available
 */
const EmptyState: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <CardLayout
      style={{
        alignItems: "center",
        paddingVertical: theme.spacing.xxl,
      }}
    >
      <Ionicons
        name="barbell-outline"
        size={64}
        color={theme.colors.textSecondary}
      />
      <Spacer size="lg" />
      <Typography variant="h3">טרם התחלת להתאמן</Typography>
      <Spacer size="sm" />
      <Typography
        variant="body"
        color={theme.colors.textSecondary}
        align="center"
      >
        בוא נתחיל את המסע שלך לכושר טוב יותר!
      </Typography>
      <Spacer size="lg" />
      <Button
        title="בחר תוכנית אימונים"
        onPress={() => navigation.navigate("Plans" as any)}
        variant="primary"
        size="lg"
      />

      {/* Spacing for tab bar */}
      <View style={{ height: 100 }} />
    </CardLayout>
  );
};

export default EmptyState;
