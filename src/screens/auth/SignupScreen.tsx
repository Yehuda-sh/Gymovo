// src/screens/auth/SignupScreen.tsx

import React, { useState } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../../lib/supabase";
import { useUserStore, UserState } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

import {
  HeaderSection,
  SignupForm,
  ActionButtons,
  ProgressBar,
} from "./signup";
import { useSignupAnimations } from "./signup/components/useSignupAnimations";
import SignupErrorModal from "./signup/components/SignupErrorModal";

// Type safety for navigation
type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;

const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  gradientDark: "#0f3460",
};

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("16");
  const [currentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const totalSteps = 3;

  // Store references
  const setUser = useUserStore((state: UserState) => state.setUser);
  const setToken = useUserStore((state: UserState) => state.setToken);
  const setStatus = useUserStore((state: UserState) => state.setStatus);

  // אנימציות
  const animations = useSignupAnimations();

  const handleNext = async () => {
    console.log("=== התחלת תהליך הרשמה ===");
    console.log("Email:", email);
    console.log("Password length:", password.length);
    console.log("Age:", age);

    // בדיקת תקינות
    if (!email || !password || !age) {
      console.log("שגיאה: חסרים שדות");
      setErrorModal("נא למלא את כל השדות");
      return;
    }

    if (password.length < 6) {
      console.log("שגיאה: סיסמה קצרה מדי");
      setErrorModal("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 16 || ageNumber > 100) {
      console.log("שגיאה: גיל לא תקין");
      setErrorModal("נא להזין גיל תקין (16-100)");
      return;
    }

    setLoading(true);

    try {
      console.log("שולח בקשת הרשמה ל-Supabase...");

      // Step 1: הרשמת המשתמש
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: email.split("@")[0],
            age: ageNumber,
          },
        },
      });

      console.log("תוצאת הרשמה:", { authData, authError });

      if (authError) {
        console.error("שגיאת auth:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("לא נוצר משתמש");
      }

      // Step 2: הפרופיל נוצר אוטומטית ע"י trigger
      console.log("הפרופיל נוצר אוטומטית עבור משתמש:", authData.user.id);

      // אופציונלי: בדוק שהפרופיל אכן נוצר
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error("שגיאה בשליפת פרופיל:", profileError);
        throw new Error("הפרופיל לא נוצר כראוי");
      }

      console.log("פרופיל נמצא:", profile);

      // Step 3: עדכון ה-userStore
      if (authData.session) {
        console.log("נוצר session, מעדכן את ה-store...");

        // עדכן את ה-store עם פרטי המשתמש
        setUser({
          id: authData.user.id,
          email: authData.user.email!,
          name: profile.name || email.split("@")[0],
          age: profile.age || ageNumber,
          isGuest: false,
          createdAt: authData.user.created_at,
          // שדות אופציונליים מהטיפוס User
          avatarUrl: profile.avatar_url,
          phoneNumber: profile.phone_number,
          preferredLanguage: "he",
          // אם יש שדה stats
          stats: {
            totalWorkouts: 0,
            totalTime: 0,
            totalVolume: 0,
            favoriteExercises: [],
          },
        });

        setToken(authData.session.access_token);
        setStatus("authenticated");

        console.log("Store עודכן בהצלחה!");

        // המתן קצת כדי לתת ל-store להתעדכן
        await new Promise((resolve) => setTimeout(resolve, 100));

        // ניווט ישיר לשאלון
        console.log("מנווט לשאלון...");
        navigation.reset({
          index: 0,
          routes: [{ name: "Quiz" }],
        });
      } else {
        // אם אין session, כנראה צריך אימות אימייל
        console.log("נדרש אימות אימייל");

        setErrorModal(
          "נשלח אליך אימייל לאימות החשבון. אנא בדוק את תיבת הדואר שלך."
        );

        setTimeout(() => {
          navigation.replace("Login");
        }, 3000);
      }
    } catch (error: any) {
      console.error("שגיאה כללית:", error);

      let errorMessage = "שגיאה בהרשמה";

      if (
        error.message?.includes("already registered") ||
        error.message?.includes("User already registered")
      ) {
        errorMessage = "כתובת האימייל כבר רשומה במערכת";
      } else if (
        error.message?.includes("Invalid email") ||
        error.message?.includes("invalid_email")
      ) {
        errorMessage = "כתובת אימייל לא תקינה";
      } else if (
        error.message?.includes("Password") ||
        error.message?.includes("password")
      ) {
        errorMessage = "הסיסמה חלשה מדי - נסה סיסמה חזקה יותר";
      } else if (error.code === "23505") {
        errorMessage = "המשתמש כבר קיים במערכת";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrorModal(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log("חוזרים למסך הקודם");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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

      {/* Error Modal */}
      <SignupErrorModal
        visible={!!errorModal}
        error={errorModal || ""}
        onDismiss={() => setErrorModal(null)}
      />
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
