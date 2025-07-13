// src/screens/home/HomeScreen.tsx
// מסך הבית מאוזן - קומפקטי עם גלילה מינימלית

import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useUserStore } from "../../stores/userStore";
import { useHomeData } from "./hooks/useHomeData";
import { RootStackParamList } from "../../types/navigation";
import {
  HomeHeader,
  StatsButton,
  QuickActionsSection,
  MotivationCard,
  WelcomeMessage,
  QuickStartFAB,
  RecentWorkoutsSection,
  RecommendedPlanCard,
} from "./components";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// צבעים
const gradientColors = {
  primary: ["#667eea", "#764ba2"] as [string, string],
  secondary: ["#764ba2", "#667eea"] as [string, string],
  background: ["#0f0c29", "#302b63", "#24243e"] as [string, string, string],
  dark: ["#000000", "#130F40"] as [string, string],
};

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <LinearGradient
      colors={gradientColors.background}
      style={StyleSheet.absoluteFillObject}
    />
    <ActivityIndicator size="large" color={gradientColors.primary[0]} />
    <Text style={styles.loadingText}>טוען...</Text>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const { dashboardData, loading, refreshing, onRefresh } = useHomeData(user);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={gradientColors.background}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={gradientColors.primary[0]}
            colors={[gradientColors.primary[0]]}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <HomeHeader user={user} />
        </View>

        {/* Welcome Message */}
        <WelcomeMessage dashboardData={dashboardData} />

        {/* Stats Button */}
        <View style={styles.statsSection}>
          <StatsButton dashboardData={dashboardData} />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>פעולות מהירות</Text>
          <QuickActionsSection dashboardData={dashboardData} />
        </View>

        {/* Motivation Card */}
        <View style={styles.motivationSection}>
          <Text style={styles.sectionTitle}>היעד השבועי שלך</Text>
          <MotivationCard dashboardData={dashboardData} />
        </View>

        {/* Recent Workouts */}
        {dashboardData?.recentWorkouts &&
          dashboardData.recentWorkouts.length > 0 && (
            <View style={styles.recentSection}>
              <RecentWorkoutsSection dashboardData={dashboardData} />
            </View>
          )}

        {/* Recommended Plan (if exists) */}
        {dashboardData?.todaysWorkout && (
          <View style={styles.recommendedSection}>
            <Text style={styles.sectionTitle}>תוכנית מומלצת להיום</Text>
            <RecommendedPlanCard
              plan={dashboardData.todaysWorkout}
              onPress={() => {
                navigation.navigate("Main", { screen: "StartWorkout" });
              }}
            />
          </View>
        )}

        {/* Extra spacing for tab bar */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Quick Start FAB */}
      <QuickStartFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // מרווח לטאב בר
  },
  headerSection: {
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 20,
  },
  actionsSection: {
    marginBottom: 20,
    height: 260,
  },
  motivationSection: {
    marginBottom: 20,
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  recentSection: {
    marginBottom: 20,
  },
  recommendedSection: {
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
});

export default HomeScreen;
