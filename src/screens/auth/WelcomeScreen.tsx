// src/screens/auth/WelcomeScreen.tsx - עם Supabase Integration מלאה

import React, { useCallback, useState, useRef } from "react";
import {
  View,
  StatusBar,
  Modal,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { clearAllData } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { demoUsers } from "../../constants/demoUsers";
import { User } from "../../types/user";
import { supabase } from "../../lib/supabase";
import { authService } from "../../services/auth/authService";
import * as WebBrowser from "expo-web-browser";
import {
  BackgroundGradient,
  HeroSection,
  GuestButton,
  DevPanel,
  useWelcomeAnimations,
  welcomeStyles,
  WelcomeScreenProps,
  DemoUserData,
} from "./welcome";
import SocialLoginButtons from "./welcome/components/SocialLoginButtons";
import ActionButtons from "./welcome/components/ActionButtons";

// תיקון עבור OAuth redirects
WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );
  const setUser = useUserStore((state: UserState) => state.setUser);
  const setToken = useUserStore((state: UserState) => state.setToken);
  const setStatus = useUserStore((state: UserState) => state.setStatus);

  // 🔒 State לDev Mode מוסתר
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [showDevModal, setShowDevModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // אנימציות למודל Dev
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;

  // אנימציות רגילות
  const { fadeAnim, logoScale, titleSlide, subtitleSlide, buttonsSlide } =
    useWelcomeAnimations();

  // 🎯 טיפול ב-3 לחיצות על הלוגו
  const handleLogoPress = useCallback(() => {
    if (!__DEV__) return;

    const newCount = logoTapCount + 1;
    setLogoTapCount(newCount);

    if (newCount >= 3) {
      setShowDevModal(true);
      setLogoTapCount(0);

      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      setLogoTapCount(0);
    }, 3000);
  }, [logoTapCount, logoScale, modalOpacity, modalScale]);

  // 🚪 סגירת Dev Modal
  const closeDevModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDevModal(false);
    });
  }, [modalOpacity, modalScale]);

  // 🔐 התחברות חברתית עם Supabase - Google
  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      console.log("מתחיל תהליך התחברות עם Google...");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,
          redirectTo: "gymovo://auth",
        },
      });

      if (error) {
        console.error("Google login error:", error);
        Alert.alert("שגיאה", "לא הצלחנו להתחבר עם Google");
        return;
      }

      if (data?.url) {
        console.log("פותח דפדפן להתחברות...");
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          "gymovo://auth"
        );

        if (result.type === "success" && result.url) {
          console.log("התחברות הצליחה!");
          // הניווט יתבצע אוטומטית דרך ה-auth listener ב-App.tsx
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("שגיאה", "משהו השתבש בתהליך ההתחברות");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 התחברות חברתית עם Supabase - Apple
  const handleAppleLogin = useCallback(async () => {
    try {
      setLoading(true);
      console.log("מתחיל תהליך התחברות עם Apple...");

      // Apple Sign In זמין רק ב-iOS
      if (Platform.OS !== "ios") {
        Alert.alert("שגיאה", "התחברות עם Apple זמינה רק במכשירי iOS");
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          skipBrowserRedirect: true,
          redirectTo: "gymovo://auth",
        },
      });

      if (error) {
        console.error("Apple login error:", error);
        Alert.alert("שגיאה", "לא הצלחנו להתחבר עם Apple");
        return;
      }

      if (data?.url) {
        console.log("פותח דפדפן להתחברות...");
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          "gymovo://auth"
        );

        if (result.type === "success" && result.url) {
          console.log("התחברות הצליחה!");
          // הניווט יתבצע אוטומטית דרך ה-auth listener ב-App.tsx
        }
      }
    } catch (error) {
      console.error("Apple login error:", error);
      Alert.alert("שגיאה", "משהו השתבש בתהליך ההתחברות");
    } finally {
      setLoading(false);
    }
  }, []);

  // התחברות כמשתמש דמו
  const handleDemoLogin = useCallback(
    async (demoUser: DemoUserData) => {
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
      closeDevModal();
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    },
    [loginAsDemoUser, navigation, closeDevModal]
  );

  // כניסה כאורח
  const handleGuestLogin = useCallback(() => {
    becomeGuest();
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  }, [becomeGuest, navigation]);

  // איפוס נתונים
  const handleResetData = useCallback(async () => {
    if (__DEV__) {
      await clearAllData();
      // נקה גם את ה-session של Supabase
      await supabase.auth.signOut();
      console.log("✅ All data cleared!");
      closeDevModal();
    }
  }, [closeDevModal]);

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
          onLogoPress={handleLogoPress}
        />

        {/* כפתורי כניסה רגילים */}
        <ActionButtons
          onSignup={() => navigation.navigate("Signup")}
          onLogin={() => navigation.navigate("Login")}
          buttonsSlide={buttonsSlide}
          fadeAnim={fadeAnim}
        />

        {/* כפתורי התחברות חברתית - אחרי הכפתורים הרגילים */}
        <SocialLoginButtons
          onGoogleLogin={handleGoogleLogin}
          onAppleLogin={handleAppleLogin}
          fadeAnim={fadeAnim}
          loading={loading}
        />

        {/* כפתור אורח */}
        <GuestButton onGuestLogin={handleGuestLogin} />
      </View>

      {/* 🔒 Dev Modal */}
      <Modal
        visible={showDevModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeDevModal}
      >
        <TouchableOpacity
          style={devModalStyles.overlay}
          activeOpacity={1}
          onPress={closeDevModal}
        >
          <Animated.View
            style={[
              devModalStyles.modalContainer,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={devModalStyles.modalContent}
            >
              <TouchableOpacity
                style={devModalStyles.closeButton}
                onPress={closeDevModal}
              >
                <Text style={devModalStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <DevPanel
                visible={true}
                demoUsers={demoUsers as DemoUserData[]}
                onDemoLogin={handleDemoLogin}
                onResetData={handleResetData}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const devModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WelcomeScreen;
