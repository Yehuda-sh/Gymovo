// src/screens/auth/WelcomeScreen.tsx - מסך פתיחה מתוקן

import React, { useCallback } from "react";
import { View, StatusBar } from "react-native";
import { clearAllData } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { demoUsers } from "../../constants/demoUsers";
import { User } from "../../types/user";
import {
  BackgroundGradient,
  HeroSection,
  ActionButtons,
  GuestButton,
  DevPanel,
  useWelcomeAnimations,
} from "./welcome";
import { WelcomeScreenProps, DemoUserData, welcomeStyles } from "./welcome";

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

  // אנימציות חדשות
  const { fadeAnim, logoScale, titleSlide, subtitleSlide, buttonsSlide } =
    useWelcomeAnimations();

  // התחברות כמשתמש דמו
  const handleDemoLogin = useCallback(
    async (demoUser: DemoUserData) => {
      // המרה ל-User בסיסי לפני שליחה ל-store
      const userForStore: User = {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        age: demoUser.age,
        isGuest: demoUser.isGuest,
        createdAt: demoUser.createdAt,
        stats: demoUser.stats,
      };

      await loginAsDemoUser(userForStore);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    },
    [loginAsDemoUser, navigation]
  );

  // כניסה כאורח
  const handleGuestLogin = useCallback(() => {
    becomeGuest();
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  }, [becomeGuest, navigation]);

  // איפוס נתונים (רק ב-DEV)
  const handleResetData = useCallback(async () => {
    if (__DEV__) {
      await clearAllData();
      console.log("✅ All data cleared!");
    }
  }, []);

  return (
    <View style={welcomeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* רקע כהה עם גרדיאנט */}
      <BackgroundGradient />

      <View style={welcomeStyles.content}>
        {/* לוגו וכותרת */}
        <HeroSection
          fadeAnim={fadeAnim}
          logoScale={logoScale}
          titleSlide={titleSlide}
          subtitleSlide={subtitleSlide}
        />

        {/* כפתורי כניסה */}
        <ActionButtons
          onSignup={() => navigation.navigate("Signup")}
          onLogin={() => navigation.navigate("Login")}
          buttonsSlide={buttonsSlide}
          fadeAnim={fadeAnim}
        />

        {/* כפתור אורח */}
        <GuestButton onGuestLogin={handleGuestLogin} />

        {/* פאנל מפתחים */}
        <DevPanel
          visible={__DEV__}
          demoUsers={demoUsers as DemoUserData[]}
          onDemoLogin={handleDemoLogin}
          onResetData={handleResetData}
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;
