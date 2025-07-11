// src/navigation/stacks/AppStack.tsx
// ערימת ניווט ראשית עם כל מסכי האפליקציה

import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";

// ייבוא מסכים
import ExerciseDetailsScreen from "../../screens/exercises/ExerciseDetailsScreen";
import ExerciseSelectionScreen from "../../screens/exercises/ExerciseSelectionScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import ActiveWorkoutScreen from "../../screens/workouts/ActiveWorkoutScreen";
import StartWorkoutScreen from "../../screens/workouts/StartWorkoutScreen";
import WorkoutSummaryScreen from "../../screens/workouts/WorkoutSummaryScreen";

// ייבוא הגדרות ורכיבים
import { appStackOptions, modalOptions } from "../config/navigationStyles";
import { RootStackParamList } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { AppTabs } from "./AppTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * רכיב Placeholder למסכים שעדיין לא מוכנים
 */
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    }}
  >
    <Ionicons name="construct" size={64} color={colors.textSecondary} />
    <Text style={{ color: colors.text, fontSize: 18, marginTop: 16 }}>
      {title}
    </Text>
    <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>
      בבנייה...
    </Text>
  </View>
);

/**
 * רכיב מסך יצירת תוכנית
 */
const CreatePlanScreen = () => <PlaceholderScreen title="יצירת תוכנית" />;

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

      {/* === מסכי תוכניות === */}
      <Stack.Screen
        name="CreatePlan"
        component={CreatePlanScreen}
        options={{
          title: "צור תוכנית",
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
