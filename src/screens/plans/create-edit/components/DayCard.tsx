// src/screens/plans/create-edit/components/DayCard.tsx
// כרטיס יום אימון עם אפשרות גרירה ועריכה

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { colors } from "../../../../theme/colors";
import { RootStackParamList } from "../../../../types/navigation";
import { PlanDay } from "../../../../types/plan";
import { ScreenRouteProp } from "../types";

interface DayCardProps extends RenderItemParams<PlanDay> {
  planId?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Card component for displaying a workout day with drag and edit functionality
 */
const DayCard: React.FC<DayCardProps> = ({ item, drag, isActive, planId }) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  // 🎯 עריכת יום אימון
  const handleDayPress = () => {
    if (planId) {
      navigation.navigate("EditWorkoutDay", {
        planId: planId,
        dayId: item.id,
      });
    } else {
      // עבור תוכנית חדשה, נצטרך לשמור אותה קודם
      Alert.alert("שמור תוכנית", "יש לשמור את התוכנית לפני עריכת ימי אימון", [
        { text: "הבנתי", style: "default" },
      ]);
    }
  };

  // 📊 חישוב מספר תרגילים
  const exerciseCount = item.exercises.length;
  const exerciseText =
    exerciseCount === 0 ? "ללא תרגילים" : `${exerciseCount} תרגילים`;

  return (
    <ScaleDecorator>
      <TouchableOpacity
        style={[styles.dayCard, isActive && styles.dayCardActive]}
        onLongPress={drag}
        onPress={handleDayPress}
        disabled={isActive}
      >
        <Ionicons
          name="reorder-three-outline"
          size={24}
          color={colors.textSecondary}
        />

        <View style={styles.dayDetailsContainer}>
          <Text style={styles.dayTitle}>{item.name}</Text>
          <Text style={styles.daySubtitle}>{exerciseText}</Text>
        </View>

        <Ionicons name="create-outline" size={22} color={colors.primary} />
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

const styles = StyleSheet.create({
  dayCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardActive: {
    backgroundColor: colors.primaryLight,
    elevation: 4,
    shadowOpacity: 0.1,
  },
  dayDetailsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: colors.text,
  },
  daySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },
});

export default DayCard;
