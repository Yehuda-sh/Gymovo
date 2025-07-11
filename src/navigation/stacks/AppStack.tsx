// src/navigation/stacks/AppStack.tsx
// ערימת ניווט ראשית עם כל מסכי האפליקציה

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// ייבוא מסכים
import ExerciseDetailsScreen from "../../screens/exercises/ExerciseDetailsScreen";
import ExerciseSelectionScreen from "../../screens/exercises/ExerciseSelectionScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import ActiveWorkoutScreen from "../../screens/workouts/ActiveWorkoutScreen";
import StartWorkoutScreen from "../../screens/workouts/StartWorkoutScreen";
import WorkoutSummaryScreen from "../../screens/workouts/WorkoutSummaryScreen";
import SelectWorkoutDayScreen from "../../screens/workouts/SelectWorkoutDayScreen";
import ExercisesPickerScreen from "../../screens/workouts/ExercisesPickerScreen";
import CreateOrEditPlanScreen from "../../screens/plans/CreateOrEditPlanScreen";
import EditWorkoutDayScreen from "../../screens/plans/EditWorkoutDayScreen";

// ייבוא הגדרות ורכיבים
import { appStackOptions, modalOptions } from "../config/navigationStyles";
import { RootStackParamList } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { AppTabs } from "./AppTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * ערימת ניווט ראשית של האפליקציה
 * כוללת את כל המסכים לאחר הזדהות
 */
export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={appStackOptions}>
      {/* המסך הראשי - Tabs */}
      <Stack.Screen
        name="Main"
        component={AppTabs}
        options={{ headerShown: false }}
      />

      {/* === מסכי אימון === */}
      <Stack.Screen
        name="ActiveWorkout"
        component={ActiveWorkoutScreen}
        options={{
          title: "אימון פעיל",
          headerShown: false, // המסך מטפל בheader בעצמו
        }}
      />

      <Stack.Screen
        name="WorkoutSummary"
        component={WorkoutSummaryScreen}
        options={{
          title: "סיכום אימון",
          ...modalOptions,
        }}
      />

      <Stack.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        options={{
          title: "התחל אימון",
          headerShown: false, // המסך מטפל בheader בעצמו
        }}
      />

      <Stack.Screen
        name="SelectWorkoutDay"
        component={SelectWorkoutDayScreen}
        options={{
          title: "בחר יום אימון",
        }}
      />

      {/* === מסכי תרגילים === */}
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={({ route }) => ({
          title: route.params?.exerciseId ? "פרטי תרגיל" : "תרגיל",
        })}
      />

      <Stack.Screen
        name="ExerciseSelection"
        component={ExerciseSelectionScreen}
        options={{
          title: "בחר תרגילים",
          headerShown: false, // המסך מטפל בheader בעצמו
        }}
      />

      <Stack.Screen
        name="ExercisesPicker"
        component={ExercisesPickerScreen}
        options={{
          title: "בחר תרגילים",
          ...modalOptions,
        }}
      />

      {/* === מסכי תוכניות === */}
      <Stack.Screen
        name="CreatePlan"
        component={CreateOrEditPlanScreen}
        options={{
          title: "יצירת תוכנית",
        }}
      />

      <Stack.Screen
        name="CreateOrEditPlan"
        component={CreateOrEditPlanScreen}
        options={({ route }) => ({
          title: route.params?.planId ? "עריכת תוכנית" : "יצירת תוכנית",
        })}
      />

      <Stack.Screen
        name="EditWorkoutDay"
        component={EditWorkoutDayScreen}
        options={{
          title: "עריכת יום אימון",
        }}
      />

      {/* === הגדרות === */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "הגדרות",
          headerRight: () => (
            <Ionicons name="checkmark" size={24} color={colors.primary} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
