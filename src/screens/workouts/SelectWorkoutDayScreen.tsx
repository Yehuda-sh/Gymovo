// src/screens/workouts/SelectWorkoutDayScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWorkoutStore } from "../../stores/workoutStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { PlanDay } from "../../types/plan";

type ScreenRouteProp = RouteProp<RootStackParamList, "SelectWorkoutDay">;

const SelectWorkoutDayScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { plan } = route.params;

  const startWorkout = useWorkoutStore((state) => state.startWorkout);

  const handleSelectDay = (day: PlanDay) => {
    startWorkout(plan, day.id);
    navigation.navigate("ActiveWorkout", { plan, day }); // מנווט למסך האימון הפעיל
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
        <Text style={styles.header}>{plan.name}</Text>
      </View>
      <Text style={styles.subHeader}>בחר את האימון להיום:</Text>
      <FlatList
        data={plan.days}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectDay(item)}
          >
            <Text style={styles.dayTitle}>
              יום {index + 1}: {item.name}
            </Text>
            <Text style={styles.dayDetails}>
              {item.exercises.length} תרגילים
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },
  headerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  backButton: { padding: 8 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    marginRight: 16,
  },
  subHeader: {
    fontSize: 18,
    color: "#666",
    textAlign: "right",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  list: { paddingHorizontal: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  dayTitle: { fontSize: 18, fontWeight: "600", textAlign: "right" },
  dayDetails: { fontSize: 14, color: "#666", textAlign: "right", marginTop: 4 },
});

export default SelectWorkoutDayScreen;
