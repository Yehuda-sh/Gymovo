// src/screens/auth/LoginScreen.tsx - מסך התחברות בעיצוב מרהיב

import React, { useState, useCallback } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Toast } from "../../components/common/Toast";
import { UserState, useUserStore } from "../../stores/userStore";
import { supabase } from "../../lib/supabase";
import {
  ActionButtons,
  ErrorDisplay,
  ForgotPasswordLink,
  HeaderSection,
  LoginForm,
  LoginScreenProps,
  SignupPrompt,
  useLoginAnimations,
  validateLoginForm,
} from "./login";
import SocialLoginButton from "./login/components/SocialLoginButton";
import * as WebBrowser from "expo-web-browser";

// תיקון עבור OAuth redirects
WebBrowser.maybeCompleteAuthSession();
import { loginStyles, loginColors } from "./login/styles/loginStyles";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const setUser = useUserStore((state: UserState) => state.setUser);
  const setToken = useUserStore((state: UserState) => state.setToken);
  const setStatus = useUserStore((state: UserState) => state.setStatus);

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Custom hooks
  const animations = useLoginAnimations();

  const handleLogin = useCallback(async () => {
    setError(null);

    // Validation
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.error || "שגיאה בוולידציה");
      return;
    }

    setIsLoading(true);

    try {
      // התחברות עם Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (data.user && data.session) {
        // קבלת פרטי הפרופיל
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        // עדכון ה-store
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.email!.split("@")[0],
          age: profile?.age || 25,
          isGuest: false,
          createdAt: data.user.created_at,
        });
        setToken(data.session.access_token);
        setStatus("authenticated");

        Toast.success("ברוך הבא! 🎯");
        // הניווט יתבצע אוטומטית דרך RootLayout
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "שגיאה בהתחברות");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, setUser, setToken, setStatus]);

  const handleForgotPassword = useCallback(() => {
    Toast.info("תכונה זו תהיה זמינה בקרוב");
  }, []);

  const handleSignup = useCallback(() => {
    navigation.navigate("Signup");
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  // התחברות עם Google
  const handleGoogleLogin = useCallback(async () => {
    try {
      setSocialLoading(true);
      setError(null);
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
        setError("לא הצלחנו להתחבר עם Google");
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
          // הניווט יתבצע אוטומטית דרך ה-auth listener
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("משהו השתבש בתהליך ההתחברות");
    } finally {
      setSocialLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={["#1a1a2e", "#0f1523", "#000000"]}
        style={styles.gradient}
      />

      {/* אפקט Blur לרקע */}
      <View style={styles.backgroundEffects}>
        <View style={[styles.glowOrb, styles.glowOrb1]} />
        <View style={[styles.glowOrb, styles.glowOrb2]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: animations.fadeAnim,
                transform: [{ translateY: animations.keyboardOffset }],
              },
            ]}
          >
            {/* Header Section */}
            <HeaderSection
              fadeAnim={animations.fadeAnim}
              slideAnim={animations.slideAnim}
              headerScale={animations.headerScale}
            />

            {/* Form Section */}
            <LoginForm
              email={email}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onTogglePassword={handleTogglePassword}
              formSlide={animations.formSlide}
            />

            {/* Error Display */}
            <ErrorDisplay error={error} onDismiss={handleDismissError} />

            {/* Forgot Password */}
            <ForgotPasswordLink onPress={handleForgotPassword} />

            <View style={styles.spacer} />

            {/* Actions Section */}
            <ActionButtons
              isLoading={isLoading}
              onLogin={handleLogin}
              onBack={handleBack}
            />

            {/* Social Login */}
            <SocialLoginButton
              onGoogleLogin={handleGoogleLogin}
              fadeAnim={animations.fadeAnim}
              loading={socialLoading}
            />

            {/* Sign up link */}
            <SignupPrompt onSignupPress={handleSignup} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.8,
  },
  backgroundEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowOrb: {
    position: "absolute",
    borderRadius: 1000,
  },
  glowOrb1: {
    width: 300,
    height: 300,
    backgroundColor: loginColors.primary,
    opacity: 0.05,
    top: -150,
    left: -100,
  },
  glowOrb2: {
    width: 400,
    height: 400,
    backgroundColor: loginColors.logoGlow,
    opacity: 0.03,
    bottom: -200,
    right: -150,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: isSmallDevice ? 30 : 40,
    paddingTop: isSmallDevice ? 40 : 60,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  spacer: {
    height: 16,
  },
});

export default LoginScreen;
