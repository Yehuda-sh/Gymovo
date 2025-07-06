// src/navigation/RootLayout.tsx

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Toast from "react-native-toast-message";
import SplashScreen from "../components/common/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import QuizScreen from "../screens/auth/QuizScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import ExerciseDetailsScreen from "../screens/exercises/ExerciseDetailsScreen";
import CreateOrEditPlanScreen from "../screens/plans/CreateOrEditPlanScreen";
import EditWorkoutDayScreen from "../screens/plans/EditWorkoutDayScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ActiveWorkoutScreen from "../screens/workouts/ActiveWorkoutScreen";
import ExercisesPickerScreen from "../screens/workouts/ExercisesPickerScreen";
import SelectPlanScreen from "../screens/workouts/SelectPlanScreen";
import SelectWorkoutDayScreen from "../screens/workouts/SelectWorkoutDayScreen";
import WorkoutSummaryScreen from "../screens/workouts/WorkoutSummaryScreen";
import { UserState, useUserStore } from "../stores/userStore";
import { RootStackParamList } from "../types/navigation";
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

// ערימת המסכים של משתמש לא מחובר
const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Quiz" component={QuizScreen} />
  </Stack.Navigator>
);

// ערימת המסכים של משתמש מחובר או אורח
const AppStack = () => (
  <Stack.Navigator
    initialRouteName="Main"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Main" component={AppTabs} />
    <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ExercisesPicker" component={ExercisesPickerScreen} />
    <Stack.Screen name="SelectPlan" component={SelectPlanScreen} />
    <Stack.Screen name="SelectWorkoutDay" component={SelectWorkoutDayScreen} />
    <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
    <Stack.Screen name="CreateOrEditPlan" component={CreateOrEditPlanScreen} />
    <Stack.Screen name="EditWorkoutDay" component={EditWorkoutDayScreen} />
  </Stack.Navigator>
);

// רכיב הניווט הראשי, מחליט איזה Stack להציג לפי סטטוס המשתמש
const RootLayout = () => {
  const status = useUserStore((state: UserState) => state.status);

  if (status === "loading") {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {status === "authenticated" || status === "guest" ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

// רכיב עליון העוטף את האפליקציה בכל ה-Providers הנדרשים
const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <RootLayout />
    <Toast />
  </QueryClientProvider>
);

export default AppWithProviders;
