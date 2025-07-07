// src/screens/plans/EditWorkoutDayScreen.tsx - ✅ Fixed TypeScript Errors

import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { usePlanEditorStore } from "../../stores/planEditorStore";
import { colors } from "../../theme/colors";
import { Exercise } from "../../types/exercise";
import { RootStackParamList } from "../../types/navigation";
import { PlanDay, PlanExercise } from "../../types/plan";

type ScreenRouteProp = RouteProp<RootStackParamList, "EditWorkoutDay">;

// רכיב התרגיל ברשימה הניתנת לגרירה
const ExerciseCard = ({
  item,
  drag,
  isActive,
}: RenderItemParams<PlanExercise>) => (
  <ScaleDecorator>
    <TouchableOpacity
      style={[styles.exerciseCard, isActive && styles.exerciseCardActive]}
      onLongPress={drag}
      disabled={isActive}
    >
      <Ionicons name="reorder-three-outline" size={24} color="#ccc" />
      <View style={styles.exerciseDetailsContainer}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDetails}>
          {item.sets} סטים × {item.reps} חזרות
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          /* TODO: Open exercise options menu */
        }}
      >
        <Ionicons name="ellipsis-vertical" size={22} color={"#888"} />
      </TouchableOpacity>
    </TouchableOpacity>
  </ScaleDecorator>
);

// מסך לעריכת יום אימון ספציפי
const EditWorkoutDayScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { dayId } = route.params;

  const { plan, updateDay, removeDay } = usePlanEditorStore();
  const [localDay, setLocalDay] = useState<PlanDay | null>(null);

  useEffect(() => {
    // ✅ Fixed: Added null check for plan.days
    const dayFromStore = plan?.days?.find((d) => d.id === dayId);
    if (dayFromStore) {
      setLocalDay(JSON.parse(JSON.stringify(dayFromStore)));
    }
  }, [dayId, plan?.days]);

  const handleExercisesSelected = (selectedExercises: Exercise[]) => {
    if (localDay) {
      const newExercises: PlanExercise[] = selectedExercises.map((ex) => {
        const existingExercise = localDay.exercises.find((e) => e.id === ex.id);
        return {
          id: ex.id,
          name: ex.name,
          // ✅ Fixed: Use category instead of muscleGroup
          muscleGroup: ex.category || "",
          sets: existingExercise?.sets || 3,
          reps: existingExercise?.reps || 10,
        };
      });
      setLocalDay({ ...localDay, exercises: newExercises });
    }
  };

  const handleSave = () => {
    if (localDay && localDay.name.trim()) {
      updateDay(localDay.id, localDay);
      navigation.goBack();
    } else {
      Alert.alert("שגיאה", "חובה לתת שם ליום האימון.");
    }
  };

  const handleDelete = () => {
    Alert.alert("מחיקת יום", "האם אתה בטוח שברצונך למחוק את יום האימון?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          if (localDay) {
            removeDay(localDay.id);
            navigation.goBack();
          }
        },
      },
    ]);
  };

  if (!localDay) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>עריכת יום אימון</Text>
        <Button title="שמור" onPress={handleSave} style={styles.saveButton} />
      </View>

      <DraggableFlatList
        data={localDay.exercises}
        keyExtractor={(item) => item.id}
        renderItem={ExerciseCard}
        onDragEnd={({ data }) =>
          setLocalDay((prev) => (prev ? { ...prev, exercises: data } : null))
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.label}>שם היום</Text>
            <Input
              value={localDay.name}
              onChangeText={(text) =>
                setLocalDay((prev) => (prev ? { ...prev, name: text } : null))
              }
            />
            <Text style={styles.label}>תרגילים (גרור כדי לסדר)</Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ marginTop: 16, gap: 10 }}>
            <Button
              title="בחר / ערוך תרגילים"
              variant="outline"
              onPress={() =>
                navigation.navigate("ExercisesPicker", {
                  planId: route.params.planId,
                  dayId: route.params.dayId,
                  // ✅ Fixed: Remove initiallySelected as it's not in the type
                  // If needed, handle this in the ExercisesPicker screen itself
                })
              }
            />
            <Button
              title="מחק יום אימון"
              variant="danger"
              onPress={handleDelete}
            />
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerButton: { padding: 5 },
  saveButton: {
    width: "auto",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 0,
  },
  list: { padding: 16 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "right",
    marginTop: 16,
  },
  exerciseCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseCardActive: { backgroundColor: "#eef4fc" },
  exerciseDetailsContainer: { flex: 1, marginHorizontal: 10 },
  exerciseName: { fontSize: 16, fontWeight: "500", textAlign: "right" },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    marginTop: 2,
  },
});

export default EditWorkoutDayScreen;
