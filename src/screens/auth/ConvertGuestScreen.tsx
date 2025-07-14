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
import { useUserStore, useGuestUser, UserState } from "../../stores/userStore";
import { useWorkoutStore } from "../../stores/workoutStore";
import { RootStackParamList } from "../../types/navigation";
import { showToast } from "../../utils/toast";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Regular expressions for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export const ConvertGuestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const convertGuestToUser = useUserStore(
    (state: UserState) => state.convertGuestToUser
  );
  const { daysUntilExpiry } = useGuestUser();
  const workoutCount = useWorkoutStore((state) => state.workouts.length);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validation functions
  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= PASSWORD_MIN_LENGTH;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "אימייל הוא שדה חובה";
    } else if (!validateEmail(email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    // Password validation
    if (!password) {
      newErrors.password = "סיסמה היא שדה חובה";
    } else if (!validatePassword(password)) {
      newErrors.password = `הסיסמה חייבת להכיל לפחות ${PASSWORD_MIN_LENGTH} תווים`;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "אימות סיסמה הוא שדה חובה";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות לא תואמות";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, confirmPassword, validateEmail, validatePassword]);

  // Clear error for specific field when user starts typing
  const handleFieldChange = useCallback(
    (field: keyof typeof errors, value: string) => {
      switch (field) {
        case "email":
          setEmail(value);
          if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
          }
          break;
        case "password":
          setPassword(value);
          if (errors.password) {
            setErrors((prev) => ({ ...prev, password: undefined }));
          }
          break;
        case "confirmPassword":
          setConfirmPassword(value);
          if (errors.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }
          break;
      }
    },
    [errors]
  );

  const handleConvert = useCallback(async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await convertGuestToUser(
        email.trim().toLowerCase(),
        password
      );

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast("החשבון נוצר בהצלחה! 🎉", "success");

        // Navigate to main screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        // Handle specific errors
        if (
          result.error?.includes("already exists") ||
          result.error?.includes("already registered")
        ) {
          setErrors({ email: "כתובת האימייל כבר רשומה במערכת" });
        } else {
          Alert.alert("שגיאה", result.error || "לא הצלחנו ליצור את החשבון");
        }
      }
    } catch (error) {
      console.error("Convert guest error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("שגיאה", "אירעה שגיאה בלתי צפויה. אנא נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  }, [email, password, validateForm, convertGuestToUser, navigation]);

  // Calculate form completion percentage
  const formProgress = useMemo(() => {
    let completed = 0;
    if (validateEmail(email)) completed++;
    if (validatePassword(password)) completed++;
    if (password && password === confirmPassword) completed++;
    return (completed / 3) * 100;
  }, [email, password, confirmPassword, validateEmail, validatePassword]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* כותרת ראשית */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.iconContainer}
            >
              <Ionicons name="person-add" size={40} color="white" />
            </LinearGradient>

            <Text style={styles.title}>שמור את ההתקדמות שלך</Text>
            <Text style={styles.subtitle}>
              צור חשבון בחינם וכל הנתונים שלך יישמרו
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${formProgress}%` }]}
              />
            </View>
          </View>

          {/* כרטיס מידע */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoNumber}>{workoutCount}</Text>
                <Text style={styles.infoLabel}>אימונים</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoNumber}>{daysUntilExpiry}</Text>
                <Text style={styles.infoLabel}>ימים נותרו</Text>
              </View>
            </View>
            {daysUntilExpiry <= 7 && (
              <View style={styles.warningBadge}>
                <Ionicons name="warning" size={16} color="#F59E0B" />
                <Text style={styles.warningText}>
                  הנתונים שלך יימחקו בעוד {daysUntilExpiry} ימים
                </Text>
              </View>
            )}
            <Text style={styles.infoText}>
              כל האימונים והנתונים שלך יועברו לחשבון החדש
            </Text>
          </View>

          {/* טופס הרשמה */}
          <View style={styles.form}>
            {/* אימייל */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>אימייל</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={errors.email ? "#EF4444" : "#6B7280"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => handleFieldChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                />
                {validateEmail(email) && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={styles.validIcon}
                  />
                )}
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* סיסמה */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>סיסמה</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.password ? "#EF4444" : "#6B7280"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={`לפחות ${PASSWORD_MIN_LENGTH} תווים`}
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => handleFieldChange("password", text)}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* אימות סיסמה */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>אימות סיסמה</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.confirmPassword ? "#EF4444" : "#6B7280"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="הקלד שוב את הסיסמה"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) =>
                    handleFieldChange("confirmPassword", text)
                  }
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  textContentType="newPassword"
                />
                {password && password === confirmPassword && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={styles.validIcon}
                  />
                )}
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* יתרונות */}
            <View style={styles.benefits}>
              <BenefitItem
                icon="cloud-upload"
                text="גיבוי אוטומטי בענן"
                color="#3B82F6"
              />
              <BenefitItem
                icon="sync"
                text="סנכרון בין מכשירים"
                color="#10B981"
              />
              <BenefitItem
                icon="stats-chart"
                text="סטטיסטיקות מתקדמות"
                color="#8B5CF6"
              />
              <BenefitItem
                icon="trophy"
                text="מעקב הישגים אישיים"
                color="#F59E0B"
              />
            </View>

            {/* כפתור יצירת חשבון */}
            <TouchableOpacity
              style={[
                styles.createButton,
                (loading || formProgress < 100) && styles.createButtonDisabled,
              ]}
              onPress={handleConvert}
              activeOpacity={0.9}
              disabled={loading || formProgress < 100}
            >
              <LinearGradient
                colors={
                  formProgress === 100
                    ? ["#3B82F6", "#2563EB"]
                    : ["#4B5563", "#374151"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.createButtonText}>
                      צור חשבון ושמור נתונים
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* הערה */}
            <Text style={styles.note}>
              ההרשמה חינמית לחלוטין • ללא כרטיס אשראי
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// רכיב יתרון
const BenefitItem: React.FC<{
  icon: string;
  text: string;
  color: string;
}> = ({ icon, text, color }) => (
  <View style={styles.benefitItem}>
    <View style={[styles.benefitIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as any} size={16} color={color} />
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#1F2937",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  infoCard: {
    backgroundColor: "#1F2937",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#374151",
  },
  infoNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D1D5DB",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  inputWrapperError: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#fff",
  },
  eyeButton: {
    padding: 12,
  },
  validIcon: {
    marginRight: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  benefits: {
    marginBottom: 24,
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  note: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default ConvertGuestScreen;
