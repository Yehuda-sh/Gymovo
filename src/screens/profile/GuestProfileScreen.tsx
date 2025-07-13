// src/screens/profile/GuestProfileScreen.tsx
// מסך פרופיל משופר למשתמשים אורחים עם עיצוב תואם למסכי Login/Welcome

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

// צבעים תואמים למסכי Login/Welcome
const gradientColors = {
  primary: ["#667eea", "#764ba2"] as [string, string],
  secondary: ["#764ba2", "#667eea"] as [string, string],
  background: ["#0f0c29", "#302b63", "#24243e"] as [string, string, string],
  dark: ["#000000", "#130F40"] as [string, string],
  accent: "#00ff88",
};

const GuestProfileScreen: React.FC = () => {
  const { navigateToConvertGuest, navigateToSignup } =
    useGuestProfileNavigation();
  const animations = useGuestProfileAnimations();

  // הפעלת אנימציות כניסה
  useEffect(() => {
    animations.startEntranceAnimation();
  }, [animations.startEntranceAnimation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* רקע גרדיאנט ראשי */}
      <LinearGradient
        colors={gradientColors.background}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* שכבת גרדיאנט נוספת לעומק */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: animations.backgroundOpacity },
        ]}
      >
        <LinearGradient
          colors={
            ["transparent", ...gradientColors.dark] as [string, string, string]
          }
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80, // מקום לבאנר
    paddingBottom: 30,
  },
});

export default GuestProfileScreen;
