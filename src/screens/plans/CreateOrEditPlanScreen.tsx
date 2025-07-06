// src/screens/plans/CreateOrEditPlanScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
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
import { usePlans } from "../../hooks/usePlans";
import { usePlanEditorStore } from "../../stores/planEditorStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan, PlanDay } from "../../types/plan";

type ScreenRouteProp = RouteProp<RootStackParamList, "CreateOrEditPlan">;

// רכיב המציג כרטיס של יום אימון בודד הניתן לגרירה
const DayCard = ({ item, drag, isActive }: RenderItemParams<PlanDay>) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <ScaleDecorator>
      <TouchableOpacity
        style={[styles.dayCard, isActive && styles.dayCardActive]}
        onLongPress={drag}
        onPress={() =>
          navigation.navigate("EditWorkoutDay", { dayId: item.id })
        }
        disabled={isActive}
      >
        <Ionicons name="reorder-three-outline" size={24} color="#ccc" />
        <View style={styles.dayDetailsContainer}>
          <Text style={styles.dayTitle}>{item.name}</Text>
          <Text style={styles.daySubtitle}>
            {item.exercises.length} תרגילים
          </Text>
        </View>
        <Ionicons name="create-outline" size={22} color={colors.primary} />
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

// מסך ראשי ליצירה או עריכה של תוכנית אימון
const CreateOrEditPlanScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { planId } = route.params || {};

  const {
    plan,
    updatePlanDetails,
    savePlan,
    isLoading,
    addDay,
    loadPlanForEdit,
    resetEditor,
    reorderDays,
  } = usePlanEditorStore();
  const { plans: allUserPlans, refetch: refetchPlans } = usePlans();

  // אפקט לטעינת תוכנית קיימת או ניקוי העורך
  useFocusEffect(
    useCallback(() => {
      if (planId && allUserPlans) {
        const planToEdit = allUserPlans.find((p: Plan) => p.id === planId);
        if (planToEdit) {
          loadPlanForEdit(planToEdit);
        }
      }
      return () => {
        resetEditor();
      };
    }, [planId, allUserPlans, loadPlanForEdit, resetEditor])
  );

  const handleSave = async () => {
    if (!plan?.name.trim()) {
      Alert.alert("שם חסר", "חובה להזין שם לתוכנית.");
      return;
    }
    const success = await savePlan();
    if (success) {
      refetchPlans();
      navigation.goBack();
    } else {
      Alert.alert("שגיאה", "שמירת התוכנית נכשלה.");
    }
  };

  const handleAddNewDay = () => {
    const newDayId = `day_${Date.now()}`;
    const newDay: PlanDay = {
      id: newDayId,
      name: `יום אימון ${plan ? plan.days.length + 1 : 1}`,
      exercises: [],
    };
    addDay(newDay);
    navigation.navigate("EditWorkoutDay", { dayId: newDayId });
  };

  if (!plan) {
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
        <Text style={styles.headerTitle}>
          {planId ? "עריכת תוכנית" : "יצירת תוכנית חדשה"}
        </Text>
        <Button
          title="שמור"
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
        />
      </View>

      <DraggableFlatList
        data={plan.days}
        keyExtractor={(item) => item.id}
        renderItem={DayCard}
        onDragEnd={({ data }) => reorderDays(data)}
        ListHeaderComponent={
          <>
            <Text style={styles.label}>שם התוכנית</Text>
            <Input
              value={plan.name}
              onChangeText={(text) => updatePlanDetails({ name: text })}
              placeholder="לדוגמה: תוכנית כוח למתחילים"
            />
            <Text style={styles.label}>תיאור (אופציונלי)</Text>
            <Input
              value={plan.description}
              onChangeText={(text) => updatePlanDetails({ description: text })}
              placeholder="כל פרט שיעזור לך לזכור"
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
            <Text style={styles.label}>ימי אימון (גרור כדי לסדר)</Text>
          </>
        }
        ListFooterComponent={
          <Button
            title="הוסף יום אימון"
            variant="outline"
            onPress={handleAddNewDay}
          />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  list: { padding: 16, paddingBottom: 100 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "right",
    marginTop: 16,
  },
  dayCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  dayCardActive: {
    backgroundColor: "#eef4fc",
    elevation: 4,
    shadowOpacity: 0.1,
  },
  dayDetailsContainer: { flex: 1, marginHorizontal: 10 },
  dayTitle: { fontSize: 18, fontWeight: "bold", textAlign: "right" },
  daySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
});

export default CreateOrEditPlanScreen;
