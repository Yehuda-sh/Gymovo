// src/screens/profile/ProfileScreen.tsx
// מסך פרופיל ראשי בעיצוב מודרני

import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Toast } from "../../components/common/Toast";
import {
  ProfileHeader,
  QuizStatusCard,
  QuickActions,
  AccountActions,
} from "./user";
import { profileColors } from "./user/styles";
import { useProfileData, useProfileAnimations } from "./user/hooks";

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    user,
    isRefreshing,
    handleRefresh,
    handleStartQuiz,
    handleResumeQuiz,
    handleLogout,
    handleDeleteAccount,
    refreshTrigger,
  } = useProfileData();

  const { fadeAnim, slideAnim } = useProfileAnimations();

  // Handlers
  const handleSettingsPress = () => {
    Toast.info("הגדרות - בקרוב");
  };

  const handleEditPress = () => {
    Toast.info("עריכת פרופיל - בקרוב");
  };

  const handleStatsPress = () => {
    Toast.info("סטטיסטיקות מפורטות - בקרוב");
  };

  const handleMyPlansPress = () => {
    Toast.info("התוכניות שלי - בקרוב");
  };

  const handleHistoryPress = () => {
    Toast.info("היסטוריית אימונים - בקרוב");
  };

  const handleGuidesPress = () => {
    Toast.info("מדריכי אימון - בקרוב");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[
            profileColors.background,
            profileColors.surface,
            profileColors.gradientDark,
          ]}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.errorText}>לא נמצא משתמש מחובר</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={[
          profileColors.background,
          profileColors.surface,
          profileColors.gradientDark,
        ]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header Component */}
      <ProfileHeader
        user={user}
        insets={insets}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        onSettingsPress={handleSettingsPress}
        onEditPress={handleEditPress}
        onStatsPress={handleStatsPress}
      />

      {/* תוכן העמוד */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[profileColors.buttonPrimary]}
            tintColor={profileColors.buttonPrimary}
          />
        }
      >
        {/* כרטיס שאלון */}
        {!user.isGuest && (
          <View style={styles.section}>
            <QuizStatusCard
              userId={user.id}
              onResumeQuiz={handleResumeQuiz}
              onStartNewQuiz={handleStartQuiz}
              refreshTrigger={refreshTrigger}
            />
          </View>
        )}

        {/* תפריט פעולות */}
        <QuickActions
          onSettingsPress={handleMyPlansPress}
          onGuidesPress={handleGuidesPress}
          onSupportPress={handleHistoryPress}
        />

        {/* פעולות חשבון */}
        <AccountActions
          user={user}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />

        {/* Footer spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: profileColors.background,
  },
  errorText: {
    color: profileColors.text,
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
});

export default ProfileScreen;
