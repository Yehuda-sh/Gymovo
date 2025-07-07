// src/screens/plans/CreateOrEditPlanScreen.tsx - תוקן

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
  const route = useRoute<ScreenRouteProp>();
  const { planId } = route.params || {};

  return (
    <ScaleDecorator>
      <TouchableOpacity
        style={[styles.dayCard, isActive && styles.dayCardActive]}
        onLongPress={drag}
        onPress={() => {
          if (planId) {
            navigation.navigate("EditWorkoutDay", {
              planId: planId,
              dayId: item.id,
            });
          } else {
            // עבור תוכנית חדשה, נצטרך לשמור אותה קודם
            Alert.alert(
              "שמור תוכנית",
              "יש לשמור את התוכנית לפני עריכת ימי אימון",
              [{ text: "הבנתי", style: "default" }]
            );
          }
        }}
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
    if (!plan) return;

    const newDayId = `day_${Date.now()}`;
    const currentDaysCount = plan.days?.length || 0;
    const newDay: PlanDay = {
      id: newDayId,
      name: `יום אימון ${currentDaysCount + 1}`,
      exercises: [],
    };
    addDay(newDay);

    // אם זו תוכנית קיימת, ניתן לערוך מיד
    if (planId) {
      navigation.navigate("EditWorkoutDay", {
        planId: planId,
        dayId: newDayId,
      });
    }
  };

  if (!plan) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  // וידוא שיש days array
  const planDays = plan.days || [];

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
        data={planDays}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  headerButton: {
    padding: 5,
  },
  saveButton: {
    width: "auto",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 0,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    textAlign: "right",
    marginTop: 16,
  },
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

export default CreateOrEditPlanScreen;
