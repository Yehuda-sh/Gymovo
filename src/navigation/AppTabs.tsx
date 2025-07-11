// src/navigation/AppTabs.tsx
// ניווט טאבים responsive

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
import PlansScreen from "../screens/plans/PlansScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import WorkoutsScreen from "../screens/workouts/WorkoutsScreen";
import { UserState, useUserStore } from "../stores/userStore";
import { colors } from "../theme/colors";
import { RootStackParamList } from "../types/navigation";
import { AppTabsParamList } from "../types/tabs";
import { useResponsiveDimensions } from "../hooks/useDeviceInfo";

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
}) => {
  const { isSmallDevice } = useResponsiveDimensions();

  const dynamicStyles = StyleSheet.create({
    fabContainer: {
      top: isSmallDevice ? -25 : -30,
      justifyContent: "center",
      alignItems: "center",
    },
    fab: {
      width: isSmallDevice ? 56 : 60,
      height: isSmallDevice ? 56 : 60,
      borderRadius: isSmallDevice ? 28 : 30,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });

  return (
    <TouchableOpacity
      style={dynamicStyles.fabContainer}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="התחל אימון חדש"
    >
      <View style={dynamicStyles.fab}>{children}</View>
    </TouchableOpacity>
  );
};

// רכיב ניווט הטאבים הראשי של האפליקציה
const AppTabs = () => {
  const status = useUserStore((state: UserState) => state.status);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isSmallDevice, tabBarHeight, tabIconSize, screenPadding } =
    useResponsiveDimensions();

  // Dynamic styles for responsive design
  const dynamicStyles = StyleSheet.create({
    tabBar: {
      position: "absolute",
      bottom: isSmallDevice ? 20 : 25,
      left: screenPadding,
      right: screenPadding,
      elevation: 0,
      backgroundColor: "#ffffff",
      borderRadius: isSmallDevice ? 12 : 15,
      height: tabBarHeight,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: dynamicStyles.tabBar,
        tabBarShowLabel: false, // מסתירים את הטקסט מתחת לאייקונים
        tabBarIconStyle: {
          marginTop: isSmallDevice ? 4 : 0,
        },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={status === "guest" ? GuestProfileScreen : ProfileScreen}
        options={{
          tabBarAccessibilityLabel: "פרופיל אישי",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={tabIconSize} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          tabBarAccessibilityLabel: "היסטוריית אימונים",
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={tabIconSize} color={color} />
          ),
        }}
      />

      {/* מסך האמצע עם הכפתור המותאם אישית */}
      <Tab.Screen
        name="StartWorkout"
        component={DummyComponent}
        options={{
          tabBarIcon: () => (
            <Ionicons name="add" size={isSmallDevice ? 28 : 32} color="white" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate("StartWorkout")}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          tabBarAccessibilityLabel: "תוכניות אימון",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={tabIconSize} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarAccessibilityLabel: "מסך הבית",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={tabIconSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
