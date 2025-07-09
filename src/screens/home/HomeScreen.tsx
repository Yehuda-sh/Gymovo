// src/screens/home/HomeScreen.tsx
// מסך הבית הראשי עם דשבורד מפורט

import * as Haptics from "expo-haptics";
import React from "react";
import { RefreshControl } from "react-native";

import { ScreenLayout, Spacer } from "../../components/ui";
import { useUserStore } from "../../stores/userStore";
import { theme } from "../../theme";
import {
  HomeHeader,
  LoadingScreen,
  QuickActionsSection,
  RecentWorkoutsSection,
  RecommendedPlanCard,
  WeeklyStats,
  useHomeData,
} from "./";

/**
 * Main home screen component with dashboard and quick actions
 */
const HomeScreen = () => {
  const user = useUserStore((state) => state.user);
  const { dashboardData, loading, refreshing, onRefresh } = useHomeData(user);

  // ⏳ מסך טעינה
  if (loading) {
    return <LoadingScreen />;
  }

  // 📱 המסך הראשי
  return (
    <ScreenLayout
      scrollable
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <HomeHeader user={user} />
      <Spacer size="xl" />

      {/* סטטיסטיקות שבועיות */}
      <WeeklyStats dashboardData={dashboardData} />
      <Spacer size="xl" />

      {/* פעולות מהירות */}
      <QuickActionsSection dashboardData={dashboardData} />
      <Spacer size="xl" />

      {/* תוכנית מומלצת */}
      {dashboardData?.todaysWorkout && (
        <>
          <RecommendedPlanCard
            plan={dashboardData.todaysWorkout}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              // עכשיו נדאג לnavigation אחר כך
            }}
          />
          <Spacer size="xl" />
        </>
      )}

      {/* אימונים אחרונים */}
      <RecentWorkoutsSection dashboardData={dashboardData} />
    </ScreenLayout>
  );
};

export default HomeScreen;
