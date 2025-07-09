// src/screens/plans/CreateOrEditPlanScreen.tsx
// מסך יצירה ועריכה של תוכנית אימון מפורקת

import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import {
  LoadingState,
  PlanDaysList,
  PlanHeader,
  ScreenRouteProp,
  usePlanData,
} from "./create-edit";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Main screen component for creating or editing a workout plan
 */
const CreateOrEditPlanScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { planId } = route.params || {};

  const {
    plan,
    isLoading,
    validationErrors,
    handleSave,
    handleAddNewDay,
    handleUpdateDetails,
    handleReorderDays,
  } = usePlanData(planId);

  // 🔄 שמירה וחזרה למסך הקודם
  const handleSaveAndGoBack = async () => {
    const success = await handleSave();
    if (success) {
      navigation.goBack();
    }
  };

  // ⏳ מצב טעינה
  if (!plan) {
    return <LoadingState />;
  }

  // 🎯 הכנת props לטופס
  const planFormProps = {
    plan,
    onUpdateDetails: handleUpdateDetails,
    validationErrors,
  };

  // 📋 נתוני ימי אימון
  const planDays = plan.days || [];

  return (
    <View style={styles.container}>
      <PlanHeader
        planId={planId}
        onSave={handleSaveAndGoBack}
        isLoading={isLoading}
      />

      <PlanDaysList
        planDays={planDays}
        planId={planId}
        onReorderDays={handleReorderDays}
        onAddNewDay={handleAddNewDay}
        planFormProps={planFormProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default CreateOrEditPlanScreen;
