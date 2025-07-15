// src/screens/auth/ConvertGuestScreen.tsx
// מסך המרת אורח מעוצב כמו SignupScreen

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore, useIsGuest } from "../../stores/userStore";
import { useWorkoutStore } from "../../stores/workoutStore";
import { RootStackParamList } from "../../types/navigation";
import { Toast } from "../../components/common/Toast";
import * as Haptics from "expo-haptics";

// ייבוא קומפוננטות מ-signup (הקיימות)
import { ActionButtons, ProgressBar, useSignupAnimations } from "./signup";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// צבעים זהים ל-SignupScreen
const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  gradientDark: "#0f3460",
  primary: "#FF6B35",
  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  inputBackground: "rgba(255, 255, 255, 0.1)",
  inputBorder: "rgba(255, 255, 255, 0.2)",
  inputBorderFocused: "#FF6B35",
  placeholder: "#64748B",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

const ConvertGuestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const convertGuestToUser = useUserStore((state) => state.convertGuestToUser);
  const getGuestExpiryDate = useUserStore((state) => state.getGuestExpiryDate);
  const isGuest = useIsGuest();
  const workoutCount = useWorkoutStore((state) => state.workouts.length);

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentStep] = useState(1);
  const totalSteps = 2;

  // חישוב ימים לתפוגה
  const daysUntilExpiry = useMemo(() => {
    const expiryDate = getGuestExpiryDate();
    if (!expiryDate) return 0;

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [getGuestExpiryDate]);

  // Animations
  const animations = useSignupAnimations();

  // הפעלת אנימציות כניסה כשהמסך נטען
  useEffect(() => {
    // איפוס הערכים לוודא שהם מתחילים נכון
    animations.fadeAnim.setValue(1);
    animations.slideAnim.setValue(0);
    animations.headerScale.setValue(1);
    animations.formSlide.setValue(0);
    animations.progressAnim.setValue(currentStep / totalSteps);

    // הפעלת אנימציות
    setTimeout(() => {
      animations.startEntryAnimations();
    }, 100);
  }, []);

  // ולידציה
  const validateForm = useCallback(() => {
    if (!name.trim()) return "שם הוא שדה חובה";
    if (name.trim().length < 2) return "השם חייב להכיל לפחות 2 תווים";
    if (!email.trim()) return "אימייל הוא שדה חובה";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "כתובת אימייל לא תקינה";
    if (!password) return "סיסמה היא שדה חובה";
    if (password.length < 6) return "הסיסמה חייבת להכיל לפחות 6 תווים";
    if (!confirmPassword) return "אישור סיסמה הוא שדה חובה";
    if (password !== confirmPassword) return "הסיסמאות לא תואמות";

    return null;
  }, [email, password, confirmPassword, name]);

  // טיפול בהמרה
  const handleConvert = useCallback(async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("שגיאה", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isGuest) {
      Alert.alert("שגיאה", "המשתמש כבר רשום במערכת");
      return;
    }

    setLoading(true);

    try {
      await convertGuestToUser(
        email.toLowerCase().trim(),
        password,
        name.trim()
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.success("ברוך הבא! 🎉", "החשבון שלך נוצר בהצלחה וכל הנתונים נשמרו");

      // ניווט למסך הבית
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error: any) {
      console.error("Conversion error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "שגיאה",
        error.message || "לא הצלחנו ליצור את החשבון. נסה שוב"
      );
    } finally {
      setLoading(false);
    }
  }, [
    email,
    password,
    name,
    validateForm,
    isGuest,
    convertGuestToUser,
    navigation,
  ]);

  // ניווט חזרה
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // צבע התראה לפי ימים שנותרו
  const urgencyColor = useMemo(() => {
    if (daysUntilExpiry <= 3) return colors.error;
    if (daysUntilExpiry <= 7) return colors.warning;
    return colors.primary;
  }, [daysUntilExpiry]);

  // אם לא אורח - הראה הודעה
  if (!isGuest) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={[colors.background, colors.surface, colors.gradientDark]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.centeredContainer}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.successTitle}>אתה כבר רשום!</Text>
          <Text style={styles.successSubtitle}>החשבון שלך כבר פעיל במערכת</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>חזור</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.background, colors.surface, colors.gradientDark]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {/* Progress Bar */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            progressAnim={animations.progressAnim}
          />

          {/* Header */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: animations.fadeAnim,
                transform: [
                  { scale: animations.headerScale },
                  {
                    translateY: animations.slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>המר חשבון אורח</Text>
              <Text style={styles.subtitle}>
                שמור את כל הנתונים שלך לצמיתות
              </Text>
            </View>

            {/* אזהרת תפוגה */}
            {daysUntilExpiry > 0 && (
              <View
                style={[styles.urgencyBanner, { borderColor: urgencyColor }]}
              >
                <Ionicons
                  name={daysUntilExpiry <= 3 ? "warning" : "time-outline"}
                  size={20}
                  color={urgencyColor}
                />
                <Text style={[styles.urgencyText, { color: urgencyColor }]}>
                  נותרו {daysUntilExpiry} ימים לתפוגת החשבון
                </Text>
              </View>
            )}

            {/* סטטיסטיקות */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons
                  name="fitness-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.statText}>
                  {workoutCount} אימונים נשמרו
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.statText}>גיבוי מאובטח</Text>
              </View>
            </View>
          </Animated.View>

          {/* Form */}
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContent}>
              {/* שם מלא */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>שם מלא</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "name" && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="הכנס את שמך המלא"
                    placeholderTextColor={colors.placeholder}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* אימייל */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>כתובת אימייל</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "email" && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="הכנס כתובת אימייל"
                    placeholderTextColor={colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* סיסמה */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>סיסמה</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "password" && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="בחר סיסמה חזקה"
                    placeholderTextColor={colors.placeholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* אישור סיסמה */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>אישור סיסמה</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "confirmPassword" &&
                      styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="הכנס שוב את הסיסמה"
                    placeholderTextColor={colors.placeholder}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* יתרונות המרה */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>מה תקבל:</Text>
                <View style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={styles.benefitText}>שמירת כל האימונים שלך</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={styles.benefitText}>גיבוי אוטומטי בענן</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={styles.benefitText}>גישה מכל מכשיר</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <ActionButtons
            onNext={handleConvert}
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
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  urgencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.inputBorderFocused,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  benefitsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export { ConvertGuestScreen };
export default ConvertGuestScreen;
