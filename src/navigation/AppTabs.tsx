// src/navigation/AppTabs.tsx - ניווט טאבים משופר עם תמיכה מלאה

import { Ionicons } from "@expo/vector-icons";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

// ייבוא מסכים
import HomeScreen from "../screens/home/HomeScreen";
import PlansScreen from "../screens/plans/PlansScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import WorkoutsScreen from "../screens/workouts/WorkoutsScreen";
import StartWorkoutScreen from "../screens/workouts/StartWorkoutScreen";

// ייבוא stores, hooks וטיפוסים
import { UserState, useUserStore } from "../stores/userStore";
import { useWorkoutStore } from "../stores/workoutStore";
import { colors } from "../theme/colors";
import { RootStackParamList } from "../types/navigation";
import { AppTabsParamList, TabBadgeConfig } from "../types/tabs";
import { useResponsiveDimensions } from "../hooks/useDeviceInfo";
import { GuestUserBanner } from "../components/GuestUserBanner";

const Tab = createBottomTabNavigator<AppTabsParamList>();
const { width } = Dimensions.get("window");

// רכיב Badge לטאבים
const TabBadge: React.FC<{ badge?: TabBadgeConfig }> = ({ badge }) => {
  if (!badge || (!badge.count && !badge.showDot)) return null;

  const displayCount =
    badge.count && badge.count > (badge.maxCount || 99)
      ? `${badge.maxCount || 99}+`
      : badge.count?.toString();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: badge.color || colors.error },
        badge.showDot && !badge.count && styles.badgeDot,
      ]}
    >
      {displayCount && (
        <Text style={[styles.badgeText, { color: badge.textColor || "white" }]}>
          {displayCount}
        </Text>
      )}
    </View>
  );
};

// רכיב אייקון טאב עם אנימציות
const AnimatedTabIcon: React.FC<{
  name: string;
  color: string;
  size: number;
  focused: boolean;
  badge?: TabBadgeConfig;
}> = ({ name, color, size, focused, badge }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={name as any} size={size} color={color} />
      <TabBadge badge={badge} />
    </Animated.View>
  );
};

// רכיב הכפתור המרכזי המעוצב
const CustomTabBarButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
}> = ({ children, onPress, accessibilityLabel }) => {
  const { isSmallDevice } = useResponsiveDimensions();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // אנימציית לחיצה
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onPress();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <TouchableOpacity
      style={[styles.fabContainer, { top: isSmallDevice ? -25 : -30 }]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={[
          styles.fab,
          {
            width: isSmallDevice ? 56 : 60,
            height: isSmallDevice ? 56 : 60,
            borderRadius: isSmallDevice ? 28 : 30,
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// רכיב Tab Bar מותאם אישית
const CustomTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const { isSmallDevice, tabBarHeight } = useResponsiveDimensions();

  return (
    <View style={[styles.tabBarContainer, { height: tabBarHeight + 20 }]}>
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={100}
          tint="light"
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: isSmallDevice ? 20 : 25 },
          ]}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.androidTabBar,
            { borderRadius: isSmallDevice ? 20 : 25 },
          ]}
        />
      )}

      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabBarItem}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.primary : colors.textSecondary,
                  size: 24,
                })}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// קומפוננטת הניווט הראשית
const AppTabs: React.FC = () => {
  const status = useUserStore((state: UserState) => state.status);
  const user = useUserStore((state: UserState) => state.user);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isSmallDevice, tabBarHeight, tabIconSize, screenPadding } =
    useResponsiveDimensions();

  const [badges, setBadges] = useState<Record<string, TabBadgeConfig>>({});

  // עדכון badges
  useEffect(() => {
    setBadges({
      Workouts: activeWorkout
        ? { showDot: true, color: colors.success }
        : undefined,
    });
  }, [activeWorkout]);

  // בדיקת מצב אורח ותצוגת באנר
  const renderGuestBanner = useCallback(() => {
    if (status === "guest") {
      return <GuestUserBanner variant="minimal" />;
    }
    return null;
  }, [status]);

  // הגדרות דינמיות לטאב בר
  const tabBarStyle: BottomTabNavigationOptions["tabBarStyle"] = {
    position: "absolute",
    bottom: isSmallDevice ? 20 : 25,
    left: screenPadding,
    right: screenPadding,
    elevation: 0,
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#ffffff",
    borderRadius: isSmallDevice ? 20 : 25,
    height: tabBarHeight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderTopWidth: 0,
  };

  return (
    <>
      {renderGuestBanner()}
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        {/* פרופיל */}
        <Tab.Screen
          name="Profile"
          component={status === "guest" ? GuestProfileScreen : ProfileScreen}
          options={{
            tabBarAccessibilityLabel: "פרופיל אישי",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name={focused ? "person" : "person-outline"}
                color={color}
                size={size}
                focused={focused}
                badge={badges.Profile}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  if (Platform.OS === "ios") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  navigation.navigate("Profile");
                }}
              />
            ),
          }}
        />

        {/* היסטוריית אימונים */}
        <Tab.Screen
          name="Workouts"
          component={WorkoutsScreen}
          options={{
            tabBarAccessibilityLabel: "היסטוריית אימונים",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name={focused ? "barbell" : "barbell-outline"}
                color={color}
                size={size}
                focused={focused}
                badge={badges.Workouts}
              />
            ),
          }}
        />

        {/* כפתור מרכזי - התחלת אימון */}
        <Tab.Screen
          name="StartWorkout"
          component={StartWorkoutScreen}
          options={{
            tabBarIcon: () => (
              <Ionicons
                name="add"
                size={isSmallDevice ? 28 : 32}
                color="white"
              />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton
                {...props}
                onPress={() => navigation.navigate("StartWorkout")}
                accessibilityLabel="התחל אימון חדש"
              />
            ),
          }}
        />

        {/* תוכניות אימון */}
        <Tab.Screen
          name="Plans"
          component={PlansScreen}
          options={{
            tabBarAccessibilityLabel: "תוכניות אימון",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name={focused ? "list" : "list-outline"}
                color={color}
                size={size}
                focused={focused}
                badge={badges.Plans}
              />
            ),
          }}
        />

        {/* מסך הבית */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarAccessibilityLabel: "מסך הבית",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
                focused={focused}
                badge={badges.Home}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  // Tab Bar Container
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarContent: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  androidTabBar: {
    backgroundColor: "#ffffff",
    elevation: 10,
  },

  // FAB Styles
  fabContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },

  // Badge Styles
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeDot: {
    minWidth: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AppTabs;
