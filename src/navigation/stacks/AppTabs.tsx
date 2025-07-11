// src/navigation/stacks/AppTabs.tsx
// טאבים ראשיים של האפליקציה עם ניווט תחתון

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";

// ייבוא מסכים
import HomeScreen from "../../screens/home/HomeScreen";
import PlansScreen from "../../screens/plans/PlansScreen";
import GuestProfileScreen from "../../screens/profile/GuestProfileScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import StartWorkoutScreen from "../../screens/workouts/StartWorkoutScreen";
import WorkoutsScreen from "../../screens/workouts/WorkoutsScreen";

// ייבוא רכיבים וקונפיגורציה
import { TabBarIcon } from "../components/TabBarIcon";
import { tabBarOptions } from "../config/navigationStyles";

// ייבוא טיפוסים וסטור
import { UserState, useUserStore } from "../../stores/userStore";
import { AppTabsParamList } from "../../types/tabs";
import { colors } from "../../theme/colors";

const Tab = createBottomTabNavigator<AppTabsParamList>();

/**
 * טאבים ראשיים של האפליקציה
 * מכיל את המסכים העיקריים עם ניווט תחתון
 */
export const AppTabs: React.FC = () => {
  const user = useUserStore((state: UserState) => state.user);
  const status = useUserStore((state: UserState) => state.status);
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            size={size}
          />
        ),
        ...tabBarOptions,
      })}
    >
      {/* פרופיל */}
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
              <Ionicons 
                name="settings-outline" 
                size={24} 
                color={colors.text} 
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* היסטוריית אימונים */}
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: "היסטוריה",
          headerTitle: "אימונים קודמים",
        }}
      />

      {/* התחלת אימון - הטאב המרכזי */}
      <Tab.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
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

      {/* תוכניות אימון */}
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          title: "תוכניות",
          headerTitle: "תוכניות האימון שלי",
        }}
      />

      {/* דף הבית */}
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

export default AppTabs; 