// src/screens/profile/ProfileScreen.tsx
// מסך פרופיל קומפקטי ומהיר

import React from "react";
import { View, ScrollView, Text, Animated, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Toast } from "../../components/common/Toast";
import { clearAllData } from "../../data/storage/utilities";
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
import { CleanDuplicatesHelper } from "../../components/dev/CleanDuplicatesHelper";

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
    refreshTrigger,
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
      {/* Header קומפקטי */}
      <ProfileHeader
        user={user}
        getInitials={getInitials}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* תוכן העמוד */}
      <ScrollView
        style={profileStyles.scrollView}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#667eea"]}
            tintColor="#667eea"
          />
        }
      >
        <View style={profileStyles.content}>
          {/* כרטיס שאלון */}
          {!user.isGuest && (
            <QuizStatusCard
              userId={user.id}
              onResumeQuiz={handleResumeQuiz}
              onStartNewQuiz={handleStartQuiz}
              refreshTrigger={refreshTrigger}
            />
          )}

          {/* פעולות מהירות */}
          <QuickActions
            onSettingsPress={handleSettingsPress}
            onGuidesPress={handleGuidesPress}
            onSupportPress={handleSupportPress}
          />

          {/* פעולות חשבון */}
          <AccountActions
            user={user}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />

          {/* כלי פיתוח */}
          <DevTools
            user={user}
            onClearQuiz={handleClearQuiz}
            onCreatePartialQuiz={handleCreatePartialQuiz}
            onClearAllData={handleClearAllData}
          />

          <CleanDuplicatesHelper />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
