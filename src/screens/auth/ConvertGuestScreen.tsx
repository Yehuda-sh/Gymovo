// src/screens/auth/ConvertGuestScreen.tsx - מסך להמרת משתמש אורח

import React, { useState, useCallback } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useUserStore, useGuestUser } from "../../stores/userStore";
import { useWorkoutStore } from "../../stores/workoutStore";

export const ConvertGuestScreen: React.FC = () => {
  const navigation = useNavigation();
  const { convertGuestToUser } = useUserStore();
  const { daysUntilExpiry } = useGuestUser();
  const workoutCount = useWorkoutStore((state) => state.workouts.length);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConvert = useCallback(async () => {
    // ולידציות
    if (!email.trim() || !password.trim()) {
      Alert.alert("שגיאה", "נא למלא את כל השדות");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("שגיאה", "כתובת אימייל לא תקינה");
      return;
    }

    if (password.length < 6) {
      Alert.alert("שגיאה", "הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("שגיאה", "הסיסמאות לא תואמות");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await convertGuestToUser(email, password);

      if (result.success) {
        Alert.alert("הצלחה! 🎉", "החשבון שלך נוצר בהצלחה וכל הנתונים נשמרו", [
          {
            text: "מעולה",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Main" as never }],
              });
            },
          },
        ]);
      } else {
        Alert.alert("שגיאה", result.error || "משהו השתבש");
      }
    } catch (error) {
      Alert.alert("שגיאה", "לא הצלחנו ליצור את החשבון");
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, convertGuestToUser, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
            <Text style={styles.infoText}>
              כל האימונים והנתונים שלך יועברו לחשבון החדש
            </Text>
          </View>

          {/* טופס הרשמה */}
          <View style={styles.form}>
            {/* אימייל */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>אימייל</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* סיסמה */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>סיסמה</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="לפחות 6 תווים"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* אימות סיסמה */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>אימות סיסמה</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="הקלד שוב את הסיסמה"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
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
                loading && styles.createButtonDisabled,
              ]}
              onPress={handleConvert}
              activeOpacity={0.9}
              disabled={loading}
            >
              <LinearGradient
                colors={["#3B82F6", "#2563EB"]}
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
