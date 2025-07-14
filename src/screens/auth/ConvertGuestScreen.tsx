// src/screens/auth/ConvertGuestScreen.tsx - מסך להמרת משתמש אורח

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserStore, useIsGuest } from "../../stores/userStore";
import { useWorkoutStore } from "../../stores/workoutStore";
import { RootStackParamList } from "../../types/navigation";
import { Toast } from "../../components/common/Toast";
import { colors } from "../../theme/colors";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Regular expressions for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export const ConvertGuestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const convertGuestToUser = useUserStore((state) => state.convertGuestToUser);
  const getGuestExpiryDate = useUserStore((state) => state.getGuestExpiryDate);
  const isGuest = useIsGuest();
  const workoutCount = useWorkoutStore((state) => state.workouts.length);

  // חישוב ימים לתפוגה
  const daysUntilExpiry = useMemo(() => {
    const expiryDate = getGuestExpiryDate();
    if (!expiryDate) return 0;

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [getGuestExpiryDate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
  }>({});

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "אימייל הוא שדה חובה";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (!password) {
      newErrors.password = "סיסמה היא שדה חובה";
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = `הסיסמה חייבת להכיל לפחות ${PASSWORD_MIN_LENGTH} תווים`;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "אישור סיסמה הוא שדה חובה";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות לא תואמות";
    }

    if (!name) {
      newErrors.name = "שם הוא שדה חובה";
    } else if (name.length < 2) {
      newErrors.name = "השם חייב להכיל לפחות 2 תווים";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, confirmPassword, name]);

  // Handle conversion
  const handleConvert = useCallback(async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isGuest) {
      Alert.alert("שגיאה", "המשתמש כבר רשום במערכת");
      return;
    }

    Keyboard.dismiss();
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
        routes: [{ name: "Home" as keyof RootStackParamList }],
      });
    } catch (error: any) {
      console.error("Conversion error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Toast.error(
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

  // Urgency indicator
  const urgencyColor = useMemo(() => {
    if (daysUntilExpiry <= 3) return colors.error;
    if (daysUntilExpiry <= 7) return colors.warning;
    return colors.primary;
  }, [daysUntilExpiry]);

  if (!isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContainer}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.successTitle}>אתה כבר רשום!</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>חזור</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>המר חשבון אורח</Text>
              <Text style={styles.subtitle}>
                שמור את כל הנתונים שלך לצמיתות
              </Text>
            </View>
          </View>

          {/* Urgency Banner */}
          <LinearGradient
            colors={[urgencyColor, `${urgencyColor}DD`]}
            style={styles.urgencyBanner}
          >
            <Ionicons
              name={daysUntilExpiry <= 3 ? "warning" : "time-outline"}
              size={24}
              color="white"
            />
            <View style={styles.urgencyTextContainer}>
              <Text style={styles.urgencyTitle}>
                נותרו {daysUntilExpiry} ימים
              </Text>
              <Text style={styles.urgencySubtitle}>
                {workoutCount} אימונים יימחקו אם לא תירשם
              </Text>
            </View>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>שם מלא</Text>
              <View
                style={[styles.inputWrapper, errors.name && styles.inputError]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="הכנס את שמך"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={!loading}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>אימייל</Text>
              <View
                style={[styles.inputWrapper, errors.email && styles.inputError]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!loading}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>סיסמה</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="לפחות 6 תווים"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>אישור סיסמה</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputError,
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
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleConvert}
                  editable={!loading}
                />
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>מה תקבל:</Text>
            <View style={styles.benefitItem}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.benefitText}>
                שמירת כל {workoutCount} האימונים שלך
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.benefitText}>גיבוי אוטומטי בענן</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.benefitText}>גישה מכל מכשיר</Text>
            </View>
          </View>

          {/* Convert Button */}
          <TouchableOpacity
            style={[styles.convertButton, loading && styles.disabledButton]}
            onPress={handleConvert}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.buttonText}>צור חשבון ושמור נתונים</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  urgencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  urgencyTextContainer: {
    flex: 1,
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 2,
  },
  urgencySubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  benefitsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text,
  },
  convertButton: {
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ConvertGuestScreen;
