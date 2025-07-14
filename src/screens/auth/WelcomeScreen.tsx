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
import * as WebBrowser from "expo-web-browser";
import {
  BackgroundGradient,
  HeroSection,
  GuestButton,
  DevPanel,
  useWelcomeAnimations,
} from "./welcome";
// תיקון: ייבוא כ-named exports במקום default
import { ActionButtons } from "./welcome/components/ActionButtons";
import { SocialLoginButtons } from "./welcome/components/SocialLoginButtons";
import { welcomeStyles } from "./welcome/styles/welcomeStyles";
import { WelcomeScreenProps } from "./welcome/types";

// תיקון עבור OAuth redirects
WebBrowser.maybeCompleteAuthSession();

// המרת DemoUserData types
interface DemoUserForPanel {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level?: string;
  goal?: string;
}

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

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
    }, 1000);
  }, [logoTapCount, modalOpacity, modalScale]);

  // סגירת מודל Dev
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

  // 🏃 התחברות כאורח
  const handleGuestLogin = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      becomeGuest();
      setLoading(false);
    }, 300);
  }, [becomeGuest]);

  // 👨‍💻 התחברות כמשתמש דמו
  const handleDemoLogin = useCallback(
    async (demoUser: User) => {
      setLoading(true);
      setShowDevModal(false);

      try {
        await loginAsDemoUser(demoUser);
      } catch (err) {
        // תיקון: שינוי שם המשתנה מ-error ל-err
        Alert.alert("שגיאה", "לא ניתן להתחבר כמשתמש דמו");
      } finally {
        setLoading(false);
      }
    },
    [loginAsDemoUser]
  );

  // 🗑️ איפוס נתונים
  const handleResetData = useCallback(async () => {
    Alert.alert("איפוס נתונים", "האם אתה בטוח?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "אפס הכל",
        style: "destructive",
        onPress: async () => {
          try {
            await clearAllData();
            Alert.alert("✅", "כל הנתונים אופסו בהצלחה");
          } catch (err) {
            // תיקון: שינוי שם המשתנה מ-error ל-err
            Alert.alert("שגיאה", "לא ניתן לאפס נתונים");
          }
        },
      },
    ]);
  }, []);

  // 🔑 התחברות רגילה
  const handleLogin = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  // 📝 הרשמה
  const handleSignup = useCallback(() => {
    navigation.navigate("Signup");
  }, [navigation]);

  // 🔐 Google Login עם Supabase
  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "gymovo://auth-callback",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert("שגיאה בהתחברות", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🍎 Apple Login עם Supabase
  const handleAppleLogin = useCallback(async () => {
    if (Platform.OS !== "ios") {
      Alert.alert("זמין רק ב-iOS", "התחברות עם Apple זמינה רק במכשירי iOS");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: "gymovo://auth-callback",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert("שגיאה בהתחברות", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // המרת demoUsers לפורמט המתאים ל-DevPanel
  const demoUsersForPanel: DemoUserForPanel[] = demoUsers.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatarUrl,
    // תיקון: בדיקה אם demographics קיים
    level: user.demographics?.experienceLevel || user.level,
    goal: user.demographics?.primaryGoal || user.goal,
  }));

  return (
    <View style={welcomeStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* רקע גרדיאנט */}
      <BackgroundGradient visible={true} />

      {/* תוכן ראשי */}
      <View style={welcomeStyles.content}>
        <HeroSection
          fadeAnim={fadeAnim}
          logoScale={logoScale}
          titleSlide={titleSlide}
          subtitleSlide={subtitleSlide}
          onLogoPress={handleLogoPress}
        />

        {/* כפתורי פעולה */}
        <ActionButtons
          buttonsSlide={buttonsSlide}
          onLogin={handleLogin}
          onSignup={handleSignup}
          fadeAnim={fadeAnim}
        />

        {/* כפתורי רשתות חברתיות */}
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
                demoUsers={demoUsersForPanel as any}
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
