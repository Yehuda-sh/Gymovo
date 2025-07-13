// src/screens/home/components/RecommendedPlanCard.tsx
// כרטיס תוכנית מומלצת עם פרטים מלאים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Button, CardLayout, Spacer, Typography } from "../../../components/ui";
import { theme } from "../../../theme";
import { Plan } from "../../../types/plan";

interface RecommendedPlanCardProps {
  plan: Plan;
  onPress: () => void;
}

/**
 * Card component for recommended workout plan with detailed information
 */
const RecommendedPlanCard: React.FC<RecommendedPlanCardProps> = ({
  plan,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <CardLayout
        style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.primary,
          ...theme.shadows.lg,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Typography variant="h3" color="#fff" align="center">
            {plan.name}
          </Typography>
          <Spacer size="sm" />
          <Typography
            variant="body"
            color="rgba(255,255,255,0.8)"
            align="center"
          >
            {plan.description}
          </Typography>
          <Spacer size="lg" />

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Typography variant="caption" color="#fff">
                {plan.durationWeeks || 4} שבועות
              </Typography>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons name="barbell-outline" size={16} color="#fff" />
              <Typography variant="caption" color="#fff">
                {plan.days?.length || 3} ימים בשבוע
              </Typography>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons name="trophy-outline" size={16} color="#fff" />
              <Typography variant="caption" color="#fff">
                {plan.difficulty || "בינוני"}
              </Typography>
            </View>
          </View>

          <Button
            title="התחל עכשיו"
            onPress={onPress}
            variant="secondary"
              
            fullWidth
          />
        </View>
      </CardLayout>
    </TouchableOpacity>
  );
};

export default RecommendedPlanCard;
