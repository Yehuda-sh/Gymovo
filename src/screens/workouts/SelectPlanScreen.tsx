// src/screens/workouts/SelectPlanScreen.tsx - ✅ Fixed TypeScript Errors

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlans } from "../../hooks/usePlans";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

const SelectPlanScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { plans, isLoading } = usePlans();

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  const handleSelectPlan = (plan: Plan) => {
    // ✅ Fixed: Pass only planId as required by RootStackParamList
    navigation.navigate("SelectWorkoutDay", { planId: plan.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.header}>בחר תוכנית אימון</Text>
      </View>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectPlan(item)}
          >
            <View>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.planDetails}>
                {/* ✅ Fixed: Added null check for item.days */}
                {item.days?.length || 0} ימי אימון
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="fitness-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>אין תוכניות אימון זמינות</Text>
            <Text style={styles.emptySubtext}>צור תוכנית חדשה כדי להתחיל</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Compensate for back button
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  planDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default SelectPlanScreen;
