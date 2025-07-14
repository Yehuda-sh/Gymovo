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
import StartWorkoutScreen from "../../screens/workouts/start-workout/StartWorkoutScreen";
import WorkoutsScreen from "../../screens/workouts/WorkoutsScreen";

// ייבוא רכיבים וקונפיגורציה
import { TabBarIcon } from "../components/TabBarIcon";
import { tabBarOptions } from "../config/navigationStyles";

// ייבוא טיפוסים וסטור
import { useIsGuest } from "../../stores/userStore";
import { AppTabsParamList } from "../../types/tabs";
import { colors } from "../../theme/colors";

const Tab = createBottomTabNavigator<AppTabsParamList>();

/**
 * טאבים ראשיים של האפליקציה
 * מכיל את המסכים העיקריים עם ניווט תחתון
 */
export const AppTabs: React.FC = () => {
  const isGuest = useIsGuest();
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => (
          <TabBarIcon routeName={route.name} focused={focused} size={size} />
        ),
        ...tabBarOptions,
      })}
    >
      {/* פרופיל */}
      <Tab.Screen
        name="Profile"
        component={isGuest ? GuestProfileScreen : ProfileScreen}
        options={{
          title: "פרופיל",
          tabBarLabel: "פרופיל",
        }}
      />

      {/* היסטוריית אימונים */}
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: "היסטוריה",
          tabBarLabel: "היסטוריה",
        }}
      />

      {/* אימון חדש - כפתור מרכזי */}
      <Tab.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        options={{
          title: "אימון חדש",
          tabBarLabel: "",
          tabBarButton: (props) => {
            // פילטור של props שיכולים להיות null
            const filteredProps = Object.entries(props).reduce(
              (acc, [key, value]) => {
                if (value !== null) {
                  acc[key] = value;
                }
                return acc;
              },
              {} as any
            );

            const { style, onPress, ...restProps } = filteredProps;

            return (
              <TouchableOpacity
                {...restProps}
                style={[
                  style,
                  {
                    top: -20,
                    borderRadius: 35,
                    width: 70,
                    height: 70,
                    backgroundColor: colors.primary,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  },
                ]}
                onPress={() => navigation.navigate("StartWorkout")}
              >
                <Ionicons
                  name="add"
                  size={40}
                  color="white"
                  style={{ alignSelf: "center", marginTop: 15 }}
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      {/* תוכניות אימון */}
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          title: "תוכניות",
          tabBarLabel: "תוכניות",
        }}
      />

      {/* בית */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "בית",
          tabBarLabel: "בית",
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
