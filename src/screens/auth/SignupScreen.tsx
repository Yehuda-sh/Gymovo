// src/screens/auth/SignupScreen.tsx
import React, { useState } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

import {
  HeaderSection,
  SignupForm,
  ActionButtons,
  ProgressBar,
  useSignupAnimations,
} from "./signup";

const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  gradientDark: "#0f3460",
};

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [currentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 3;

  // אנימציות
  const animations = useSignupAnimations();

  const handleNext = async () => {
    // בדיקת תקינות
    if (!email || !password) {
      Alert.alert("שגיאה", "נא למלא את כל השדות");
      return;
    }

    if (password.length < 6) {
      Alert.alert("שגיאה", "הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (!age || parseInt(age) < 16 || parseInt(age) > 100) {
      Alert.alert("שגיאה", "נא להזין גיל תקין (16-100)");
      return;
    }

    setLoading(true);

    try {
      // 1. יצירת משתמש ב-Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. יצירת פרופיל
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: email.split("@")[0], // שם זמני
          age: parseInt(age),
        });

        if (profileError) throw profileError;

        // 3. הצלחה! נווט למסך הראשי
        Alert.alert("ברוכים הבאים! 🎉", "נרשמת בהצלחה לGymovo");

        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // תרגום שגיאות נפוצות
      let errorMessage = "שגיאה בהרשמה";

      if (error.message?.includes("already registered")) {
        errorMessage = "כתובת האימייל כבר רשומה במערכת";
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "כתובת אימייל לא תקינה";
      } else if (error.message?.includes("Password")) {
        errorMessage = "הסיסמה חלשה מדי";
      }

      Alert.alert("שגיאה", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* רקע גרדיינט */}
      <LinearGradient
        colors={[colors.background, colors.surface, colors.gradientDark]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header Fixed עם Progress */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ProgressBar
          progressAnim={animations.fadeAnim}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <HeaderSection
            fadeAnim={animations.fadeAnim}
            slideAnim={animations.slideAnim}
            headerScale={animations.headerScale}
          />

          <SignupForm
            email={email}
            password={password}
            age={age}
            error={null}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onAgeChange={setAge}
            formSlide={animations.fadeAnim}
          />

          <ActionButtons
            onNext={handleNext}
            onBack={handleBack}
            isLoading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingTop: 100,
  },
});

export default SignupScreen;
