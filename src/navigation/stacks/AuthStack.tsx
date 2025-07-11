// src/navigation/stacks/AuthStack.tsx
// ערימת ניווט למסכי הזדהות והרשמה

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// ייבוא מסכי Auth
import LoginScreen from "../../screens/auth/LoginScreen";
import QuizScreen from "../../screens/auth/QuizScreen";
import SignupScreen from "../../screens/auth/SignupScreen";
import WelcomeScreen from "../../screens/auth/WelcomeScreen";

// ייבוא הגדרות עיצוב
import { authStackOptions } from "../config/navigationStyles";
import { RootStackParamList } from "../../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * ערימת ניווט למסכי הזדהות והרשמה
 * כוללת את כל המסכים הקשורים לכניסה, הרשמה ושאלון ראשוני
 */
export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={authStackOptions}>
      {/* מסך ברוכים הבאים */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // מניעת חזרה ממסך הכניסה
        }}
      />

      {/* מסך התחברות */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: "התחברות",
          headerBackTitle: "חזור",
        }}
      />

      {/* מסך הרשמה */}
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: true,
          title: "הרשמה",
          headerBackTitle: "חזור",
        }}
      />

      {/* שאלון יצירת תוכנית */}
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          headerShown: true,
          title: "בניית התוכנית שלך",
          headerBackTitle: "חזור",
          gestureEnabled: false, // מניעת חזרה מאמצע השאלון
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
