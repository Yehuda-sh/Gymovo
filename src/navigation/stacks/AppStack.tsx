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
import StartWorkoutScreen from "../../screens/workouts/start-workout/StartWorkoutScreen";
import WorkoutSummaryScreen from "../../screens/workouts/WorkoutSummaryScreen";
import SelectWorkoutDayScreen from "../../screens/workouts/SelectWorkoutDayScreen";
import ExercisesPickerScreen from "../../screens/workouts/ExercisesPickerScreen";
import CreateOrEditPlanScreen from "../../screens/plans/CreateOrEditPlanScreen";
import EditWorkoutDayScreen from "../../screens/plans/EditWorkoutDayScreen";
import QuizScreen from "../../screens/auth/QuizScreen"; // הוספנו!

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

      {/* === מסך שאלון === */}
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          title: "בניית התוכנית שלך",
          headerBackTitle: "חזור",
          gestureEnabled: false, // מניעת חזרה מאמצע השאלון
          ...modalOptions, // הצגה כמודל
        }}
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
          title: route.params?.exerciseId || "פרטי תרגיל",
          presentation: "modal",
        })}
      />

      <Stack.Screen
        name="ExerciseSelection"
        component={ExerciseSelectionScreen}
        options={{
          title: "בחירת תרגילים",
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="ExercisesPicker"
        component={ExercisesPickerScreen}
        options={{
          title: "הוספת תרגילים",
          presentation: "modal",
        }}
      />

      {/* === מסכי ניהול תוכניות === */}
      <Stack.Screen
        name="CreateOrEditPlan"
        component={CreateOrEditPlanScreen}
        options={({ route }) => ({
          title: route.params?.planId ? "עריכת תוכנית" : "יצירת תוכנית",
          headerBackTitle: "חזור",
        })}
      />

      <Stack.Screen
        name="EditWorkoutDay"
        component={EditWorkoutDayScreen}
        options={{
          title: "עריכת יום אימון",
          headerBackTitle: "חזור",
        }}
      />

      {/* === הגדרות === */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "הגדרות",
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.primary}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
