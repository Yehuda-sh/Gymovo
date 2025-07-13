// src/screens/profile/GuestProfileScreen.tsx
// מסך פרופיל משופר למשתמשים אורחים עם שימוש מלא ברכיבים

import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// ייבוא רכיבים מתיקיית guest
import {
  GuestProfileHeader,
  GuestProfileBanner,
  GuestProfileFeatures,
  GuestProfileActions,
  GuestProfileFooter,
} from "./guest/components";

// ייבוא hooks
import {
  useGuestProfileNavigation,
  useGuestProfileAnimations,
} from "./guest/hooks";

// ייבוא סטיילים וטיפוסים
import { guestProfileStyles } from "./guest/styles";
import { RootStackParamList } from "../../types/navigation";
import { colors } from "../../theme/colors";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GuestProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { navigateToConvertGuest, navigateToSignup } =
    useGuestProfileNavigation();
  const animations = useGuestProfileAnimations();

  // הפעלת אנימציות כניסה
  useEffect(() => {
    animations.startEntranceAnimation();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      {/* רקע גרדיאנט אנימטיבי */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: animations.backgroundOpacity },
        ]}
      >
        <LinearGradient
          colors={[colors.background, "#1a1a1a", colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* באנר התראה */}
      <GuestProfileBanner
        onPress={navigateToConvertGuest}
        animation={animations.bannerSlide}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* כותרת ופרטי משתמש */}
        <GuestProfileHeader
          fadeAnim={animations.fadeAnim}
          scaleAnim={animations.scaleAnim}
        />

        {/* כרטיס CTA ראשי */}
        <GuestProfileActions
          onConvertPress={navigateToConvertGuest}
          onSignupPress={navigateToSignup}
          slideAnim={animations.contentSlide}
          pulseAnim={animations.pulseAnim}
        />

        {/* רשימת יתרונות */}
        <GuestProfileFeatures
          fadeAnim={animations.featuresAnim}
          staggerDelay={100}
        />

        {/* כותרת תחתונה */}
        <GuestProfileFooter
          onAlternativeSignup={navigateToSignup}
          fadeAnim={animations.footerAnim}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 80, // מקום לבאנר
    paddingBottom: 30,
  },
});

export default GuestProfileScreen;
