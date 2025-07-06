// src/screens/workouts/WorkoutsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWorkoutHistory } from "../../hooks/useWorkoutHistory";
import { colors } from "../../theme/colors";
import { Workout } from "../../types/workout";

// רכיב להצגת כרטיס אימון בודד בהיסטוריה
const WorkoutHistoryCard = ({ item }: { item: Workout }) => {
  const workoutDate = new Date(item.date).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <TouchableOpacity style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDate}>{workoutDate}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

const WorkoutsScreen = () => {
  const { data: workouts, isLoading, isError } = useWorkoutHistory();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>אירעה שגיאה בטעינת היסטוריית האימונים.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>היסטוריית אימונים</Text>
      <FlatList
        data={workouts}
        renderItem={({ item }) => <WorkoutHistoryCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>עדיין לא השלמת אימונים.</Text>
            <Text style={styles.emptySubText}>האימונים שתסיים יופיעו כאן.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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
  list: { paddingHorizontal: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", textAlign: "right" },
  cardDate: { fontSize: 14, color: "#666", marginTop: 4, textAlign: "right" },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#555" },
  emptySubText: { fontSize: 14, color: "#888", marginTop: 8 },
});

export default WorkoutsScreen;
