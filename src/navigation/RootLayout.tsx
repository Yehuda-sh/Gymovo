// src/navigation/RootLayout.tsx - גרסה פשוטה יותר עם המסכים הקיימים

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

// 🛡️ רכיבי אבטחה
import Toast from "react-native-toast-message";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { DialogProvider } from "../components/common/Dialog";

// 🎨 עיצוב ונושא
import { colors } from "../theme/colors";

// 📱 מסכי האפליקציה הקיימים
// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import QuizScreen from "../screens/auth/QuizScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import HomeScreen from "../screens/home/HomeScreen";
import ActiveWorkoutScreen from "../screens/workouts/ActiveWorkoutScreen";
// Main App Screens - נשתמש במסכים קיימים או ניצור placeholders
import PlansScreen from "../screens/plans/PlansScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import WorkoutsScreen from "../screens/workouts/WorkoutsScreen";

// Secondary Screens - רק המסכים שקיימים
import ExerciseDetailsScreen from "../screens/exercises/ExerciseDetailsScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import WorkoutSummaryScreen from "../screens/workouts/WorkoutSummaryScreen";
import StartWorkoutScreen from "../screens/workouts/StartWorkoutScreen";
import ExerciseSelectionScreen from "../screens/exercises/ExerciseSelectionScreen";
// 🔗 Types
import { UserState, useUserStore } from "../stores/userStore";
import { RootStackParamList } from "../types/navigation";
import { AppTabsParamList } from "../types/tabs";

// ⚙️ שירותים
import { UserPreferencesService } from "../services/userPreferences";

// 📱 מסכי Placeholder למסכים שלא קיימים עדיין
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

// Fixed: Create a proper component for CreatePlan to avoid inline function warning
const CreatePlanScreen = () => <PlaceholderScreen title="יצירת תוכנית" />;

// 🚀 יצירת navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<AppTabsParamList>();

// 🔧 הגדרת React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 דקות
      gcTime: 10 * 60 * 1000, // 10 דקות (החלפנו cacheTime ב-gcTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// 🎨 הגדרות עיצוב גלובליות לניווט
const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold" as const,
    fontSize: 18,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

// 📱 Tab Navigator - המסכים הראשיים
const AppTabs = () => {
  const user = useUserStore((state: UserState) => state.user);
  const status = useUserStore((state: UserState) => state.status);
  const navigation = useNavigation<any>(); // הוספת navigation hook כאן

  const getTabBarIcon = (routeName: string, focused: boolean, size: number) => {
    let iconName: keyof typeof Ionicons.glyphMap;

    switch (routeName) {
      case "Home":
        iconName = focused ? "home" : "home-outline";
        break;
      case "Plans":
        iconName = focused ? "list" : "list-outline";
        break;
      case "StartWorkout":
        iconName = focused ? "play-circle" : "play-circle-outline";
        break;
      case "Workouts":
        iconName = focused ? "barbell" : "barbell-outline";
        break;
      case "Profile":
        iconName = focused ? "person" : "person-outline";
        break;
      default:
        iconName = "help-outline";
    }

    return (
      <Ionicons
        name={iconName}
        size={size}
        color={focused ? colors.primary : colors.textSecondary}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) =>
          getTabBarIcon(route.name, focused, size),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
      })}
    >
      <Tab.Screen
        name="Profile"
        component={status === "guest" ? GuestProfileScreen : ProfileScreen}
        options={{
          title: "פרופיל",
          headerTitle: user?.name || "פרופיל",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="settings-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: "היסטוריה",
          headerTitle: "אימונים קודמים",
        }}
      />

      <Tab.Screen
        name="StartWorkout"
        component={StartWorkoutScreen} // ✅ שינוי כאן - השתמש במסך האמיתי במקום PlaceholderScreen
        options={{
          title: "אימון",
          headerTitle: "התחל אימון",
          tabBarIconStyle: {
            backgroundColor: colors.primary,
            borderRadius: 25,
            padding: 8,
          },
        }}
      />

      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          title: "תוכניות",
          headerTitle: "תוכניות האימון שלי",
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "בית",
          headerTitle: "Gymovo",
        }}
      />
    </Tab.Navigator>
  );
};

// 🔐 Auth Stack - מסכי כניסה והרשמה
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      ...defaultScreenOptions,
      headerShown: false, // רוב מסכי ה-auth בלי header
      gestureEnabled: true,
      animation: "slide_from_right",
    }}
  >
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{
        headerShown: false,
        gestureEnabled: false, // מניעת חזרה ממסך הכניסה
      }}
    />

    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: true,
        title: "התחברות",
        headerBackTitle: "חזור",
      }}
    />

    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{
        headerShown: true,
        title: "הרשמה",
        headerBackTitle: "חזור",
      }}
    />

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

// 🏠 Main App Stack - כל מסכי האפליקציה
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        gestureEnabled: true,
        animation: "slide_from_right",
      }}
    >
      {/* המסך הראשי - Tabs */}
      <Stack.Screen
        name="Main"
        component={AppTabs}
        options={{ headerShown: false }}
      />

      {/* מסכי אימון - רק המסכים שקיימים */}
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
          presentation: "modal",
        }}
      />

      {/* מסכי תרגילים */}
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={({ route }) => ({
          title: route.params?.exerciseId ? "פרטי תרגיל" : "תרגיל",
        })}
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
        name="ExerciseSelection"
        component={ExerciseSelectionScreen}
        options={{
          title: "בחר תרגילים",
          headerShown: false, // המסך מטפל בheader בעצמו
        }}
      />

      <Stack.Screen
        name="CreatePlan"
        component={CreatePlanScreen}
        options={{
          title: "צור תוכנית",
        }}
      />

      {/* הגדרות */}
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

// 💾 רכיב טעינה מתקדם
const SplashScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    }}
  >
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

// 🧭 הרכיב הראשי לניווט
const RootLayout = () => {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const status = useUserStore((state: UserState) => state.status);

  // 🚀 אתחול שירותי ניווט
  useEffect(() => {
    initializeNavigation();
  }, []);

  const initializeNavigation = async () => {
    try {
      // אתחול שירות העדפות משתמש
      const preferencesService = UserPreferencesService.getInstance();
      await preferencesService.load();

      // סימולציה של זמן טעינה (אפשר להסיר)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsNavigationReady(true);

      if (__DEV__) {
        console.log("🧭 Navigation system initialized");
      }
    } catch (error) {
      console.error("Failed to initialize navigation:", error);
      // גם במקרה של כשל, נמשיך
      setIsNavigationReady(true);
    }
  };

  // 🔄 מסך טעינה בזמן אתחול
  if (!isNavigationReady) {
    return (
      <ErrorBoundary>
        <SplashScreen />
      </ErrorBoundary>
    );
  }

  // 🎯 הרכיב הראשי
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DialogProvider>
          <NavigationContainer>
            {status === "loading" ? (
              <SplashScreen />
            ) : status === "authenticated" || status === "guest" ? (
              <AppStack />
            ) : (
              <AuthStack />
            )}
            <Toast />
          </NavigationContainer>
        </DialogProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default RootLayout;
