// src/screens/profile/ProfileScreen.tsx
// מסך פרופיל מתקדם עם מערכת שאלון חכמה

import React from "react";
import { View, ScrollView, Text, Animated, RefreshControl } from "react-native";
import { Toast } from "../../components/common/Toast";
import { clearAllData } from "../../data/storage";
import {
  clearQuizProgress,
  saveQuizProgress,
  QuizProgress,
} from "../../services/quizProgressService";
import { colors } from "../../theme/colors";
import {
  ProfileHeader,
  QuizStatusCard,
  QuickActions,
  AccountActions,
  DevTools,
  useProfileData,
  useProfileAnimations,
} from "./user";
import { profileStyles } from "./user/styles";

const ProfileScreen: React.FC = () => {
  const {
    user,
    isRefreshing,
    handleRefresh,
    handleStartQuiz,
    handleResumeQuiz,
    handleLogout,
    handleDeleteAccount,
    getInitials,
    handleClearQuiz,
    handleCreatePartialQuiz,
    handleClearAllData,
  } = useProfileData();

  const { fadeAnim, slideAnim } = useProfileAnimations();

  // Navigation handlers
  const handleSettingsPress = () => {
    Toast.show("הגדרות - בקרוב", "info");
  };

  const handleGuidesPress = () => {
    Toast.show("מדריכי אימון - בקרוב", "info");
  };

  const handleSupportPress = () => {
    Toast.show("תמיכה - בקרוב", "info");
  };

  if (!user) {
    return (
      <View style={profileStyles.container}>
        <Text style={profileStyles.errorText}>לא נמצא משתמש מחובר</Text>
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <ScrollView
        style={profileStyles.scrollView}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View
          style={[
            profileStyles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ProfileHeader
            user={user}
            getInitials={getInitials}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {!user.isGuest && (
            <QuizStatusCard
              userId={user.id}
              onResumeQuiz={handleResumeQuiz}
              onStartNewQuiz={handleStartQuiz}
            />
          )}

          <QuickActions
            onSettingsPress={handleSettingsPress}
            onGuidesPress={handleGuidesPress}
            onSupportPress={handleSupportPress}
          />

          <AccountActions
            user={user}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />

          <DevTools
            user={user}
            onClearQuiz={handleClearQuiz}
            onCreatePartialQuiz={handleCreatePartialQuiz}
            onClearAllData={handleClearAllData}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
