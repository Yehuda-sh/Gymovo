// src/screens/workouts/SelectPlanScreen.tsx
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
    navigation.navigate("SelectWorkoutDay", { plan });
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
                {item.days.length} ימי אימון
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.centered}>לא נמצאו תוכניות.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: { padding: 8 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    marginRight: 16,
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
  },
  planName: { fontSize: 18, fontWeight: "600", textAlign: "right" },
  planDetails: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
});

export default SelectPlanScreen;
