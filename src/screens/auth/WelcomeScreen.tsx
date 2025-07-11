// src/screens/auth/WelcomeScreen.tsx - Dev Mode מוסתר עם 3 לחיצות על לוגו

import React, { useCallback, useState, useRef } from "react";
import {
  View,
  StatusBar,
  Modal,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
} from "react-native";
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
  welcomeStyles,
  WelcomeScreenProps,
  DemoUserData,
} from "./welcome";

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

  // 🔒 State לDev Mode מוסתר
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [showDevModal, setShowDevModal] = useState(false);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // אנימציות למודל Dev
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;

  // אנימציות רגילות
  const { fadeAnim, logoScale, titleSlide, subtitleSlide, buttonsSlide } =
    useWelcomeAnimations();

  // 🎯 טיפול ב-3 לחיצות על הלוגו
  const handleLogoPress = useCallback(() => {
    if (!__DEV__) return; // רק בסביבת פיתוח

    const newCount = logoTapCount + 1;
    setLogoTapCount(newCount);

    // אנימציית לוגו קטנה בכל לחיצה
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // אם הגענו ל-3 לחיצות
    if (newCount >= 3) {
      setShowDevModal(true);
      setLogoTapCount(0);

      // אנימציית פתיחת המודל
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

    // איפוס הספירה אחרי 3 שניות
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
      closeDevModal(); // סגור את המודל
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
        {/* לוגו וכותרת - עם אפשרות ללחיצה */}
        <HeroSection
          fadeAnim={fadeAnim}
          logoScale={logoScale}
          titleSlide={titleSlide}
          subtitleSlide={subtitleSlide}
          onLogoPress={handleLogoPress} // הוספת פונקציית לחיצה
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
      </View>

      {/* 🔒 Dev Modal - מוצג רק אחרי 3 לחיצות */}
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
              {/* כפתור סגירה */}
              <TouchableOpacity
                style={devModalStyles.closeButton}
                onPress={closeDevModal}
              >
                <Text style={devModalStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {/* תוכן Dev Panel */}
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

// 🎨 סטיילים למודל Dev
const devModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  modalContainer: {
    width: "100%" as const,
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
    position: "absolute" as const,
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});

export default WelcomeScreen;
