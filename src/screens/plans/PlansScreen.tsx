// src/screens/plans/PlansScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import { usePlanEditorStore } from "../../stores/planEditorStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

// רכיב המציג כרטיס בודד של תוכנית אימון
const PlanCard = ({ item, onEdit }: { item: Plan; onEdit: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onEdit}>
    <View style={styles.cardHeader}>
      <Text style={styles.planName}>{item.name}</Text>
      <View style={styles.daysBadge}>
        <Text style={styles.daysText}>{item.days.length} ימים</Text>
      </View>
    </View>
    <Text style={styles.planDescription} numberOfLines={2}>
      {item.description}
    </Text>
  </TouchableOpacity>
);

// מסך ראשי המציג את כל תוכניות האימון הזמינות
const PlansScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { plans, isLoading, refetch } = usePlans(); // קבלת פונקציית refetch לרענון הנתונים
  const { createNewPlan, loadPlanForEdit } = usePlanEditorStore();

  // רענון הנתונים בכל פעם שחוזרים למסך, כדי להציג תוכניות חדשות או מעודכנות
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // פונקציה ליצירת תוכנית חדשה
  const handleCreateNewPlan = () => {
    createNewPlan();
    navigation.navigate("CreateOrEditPlan", {});
  };

  // פונקציה לעריכת תוכנית קיימת
  const handleEditPlan = (plan: Plan) => {
    loadPlanForEdit(plan);
    navigation.navigate("CreateOrEditPlan", { planId: plan.id });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>תוכניות אימון</Text>
      <FlatList
        data={plans}
        renderItem={({ item }) => (
          <PlanCard item={item} onEdit={() => handleEditPlan(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>לא נמצאו תוכניות.</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={handleCreateNewPlan}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    textAlign: "right",
  },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planName: { fontSize: 20, fontWeight: "bold", textAlign: "right" },
  daysBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  daysText: { color: "white", fontSize: 12, fontWeight: "bold" },
  planDescription: { fontSize: 15, color: "#666", textAlign: "right" },
  emptyText: { fontSize: 16, color: "#888" },
  fab: {
    position: "absolute",
    bottom: 90,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});

export default PlansScreen;
