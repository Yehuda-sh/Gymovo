// src/screens/home/components/QuickActionsSection.tsx
// פעולות מהירות בגובה מאוזן

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData } from "../types";

interface QuickActionsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const actions = [
    {
      id: "start",
      title: "התחל אימון",
      subtitle: "בחר תוכנית",
      icon: "play-circle",
      color: "#00D4AA",
      onPress: () => navigation.navigate("Main", { screen: "StartWorkout" }),
    },
    {
      id: "plans",
      title: "תוכניות שלי",
      subtitle: `${dashboardData?.activePlans || 0} פעילות`,
      icon: "list",
      color: "#667eea",
      onPress: () => navigation.navigate("Main", { screen: "Plans" }),
    },
    {
      id: "history",
      title: "היסטוריה",
      subtitle: `${dashboardData?.weeklyStats.completedWorkouts || 0} השבוע`,
      icon: "barbell-outline",
      color: "#F59E0B",
      onPress: () => navigation.navigate("Main", { screen: "Workouts" }),
    },
    {
      id: "profile",
      title: "פרופיל",
      subtitle: "הגדרות",
      icon: "person-outline",
      color: "#EC4899",
      onPress: () => navigation.navigate("Main", { screen: "Profile" }),
    },
  ];

  const handlePress = (action: (typeof actions)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionCard}
          onPress={() => handlePress(action)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[`${action.color}20`, `${action.color}10`]}
            style={styles.cardGradient}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${action.color}30` },
              ]}
            >
              <Ionicons
                name={action.icon as any}
                size={24}
                color={action.color}
              />
            </View>
            <Text style={styles.title}>{action.title}</Text>
            <Text style={styles.subtitle}>{action.subtitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    height: 250,
  },
  actionCard: {
    width: "48.5%",
    height: 115,
    marginBottom: 10,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardGradient: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
});

export default QuickActionsSection;
