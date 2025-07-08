// src/navigation/AppTabs.tsx

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import PlansScreen from "../screens/plans/PlansScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import WorkoutsScreen from "../screens/workouts/WorkoutsScreen";
import { UserState, useUserStore } from "../stores/userStore";
import { colors } from "../theme/colors";
import { RootStackParamList } from "../types/navigation";
import { AppTabsParamList } from "../types/tabs";

const Tab = createBottomTabNavigator<AppTabsParamList>();

// רכיב ריק המשמש כתחליף למסך עבור הכפתור המרכזי
const DummyComponent = () => null;

// רכיב הכפתור המרכזי המעוצב
const CustomTabBarButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.fabContainer}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="התחל אימון חדש"
  >
    <View style={styles.fab}>{children}</View>
  </TouchableOpacity>
);

// רכיב ניווט הטאבים הראשי של האפליקציה
const AppTabs = () => {
  const status = useUserStore((state: UserState) => state.status);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // מסתירים את הטקסט מתחת לאייקונים
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          // TODO: בעתיד, להוסיף תג עם מספר עדכונים, למשל 'tabBarBadge: 3'
          tabBarAccessibilityLabel: "מסך הבית", // שדרוג נגישות
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          tabBarAccessibilityLabel: "תוכניות אימון", // שדרוג נגישות
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      {/* מסך האמצע עם הכפתור המותאם אישית */}
      <Tab.Screen
        name="StartWorkout"
        component={DummyComponent}
        options={{
          tabBarIcon: () => <Ionicons name="add" size={32} color="white" />,
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate("StartWorkout")} // שינוי כאן!
            />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          tabBarAccessibilityLabel: "היסטוריית אימונים", // שדרוג נגישות
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={status === "guest" ? GuestProfileScreen : ProfileScreen}
        options={{
          tabBarAccessibilityLabel: "פרופיל אישי", // שדרוג נגישות
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  fabContainer: { top: -30, justifyContent: "center", alignItems: "center" },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default AppTabs;
