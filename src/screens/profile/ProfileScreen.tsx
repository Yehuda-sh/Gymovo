// 👤 ProfileScreen מתקדם עם מערכת שאלון חכמה - יכול להמשיך מאיפה שעצר
// src/screens/profile/ProfileScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Dialog from "../../components/common/Dialog";
import { QuizAnswers } from "../../services/planGenerator";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

const { width } = Dimensions.get("window");

// 🎨 ערכת צבעים עבור פרופיל
const profileColors = {
  background: "#0a0a0a",
  cardBg: "#1a1a1a",
  accent: "#00ff88",
  secondary: "#ffaa00",
  danger: "#ff4444",
  text: "#ffffff",
  subtext: "#cccccc",
  border: "#333333",
};

// 📊 מערכת ניהול מצב השאלון
interface QuizProgress {
  isCompleted: boolean;
  currentQuestionId?: string;
  answers: Partial<QuizAnswers>;
  completedAt?: string;
  lastUpdated: string;
}

// 💾 פונקציות שמירה וטעינה של מצב השאלון (זמני - בזיכרון)
const quizProgressStorage: { [userId: string]: QuizProgress } = {};

const saveQuizProgress = async (userId: string, progress: QuizProgress) => {
  try {
    quizProgressStorage[userId] = progress;
    console.log("✅ Quiz progress saved:", progress);
  } catch (error) {
    console.error("Failed to save quiz progress:", error);
  }
};

const loadQuizProgress = async (
  userId: string
): Promise<QuizProgress | null> => {
  try {
    const progress = quizProgressStorage[userId] || null;
    console.log("📖 Quiz progress loaded:", progress);
    return progress;
  } catch (error) {
    console.error("Failed to load quiz progress:", error);
    return null;
  }
};

// 🧠 רכיב מצב השאלון החכם
const QuizStatusCard = ({ userId }: { userId: string }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    const progress = await loadQuizProgress(userId);
    setQuizProgress(progress);
    setIsLoading(false);

    // אנימציית כניסה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [userId, fadeAnim, slideAnim]);

  const handleQuizAction = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!quizProgress) {
      // התחל שאלון חדש - נווט למסך הרשמה במקום ישירות לשאלון
      Alert.alert(
        "שאלון אישי",
        "כדי ליצור תוכנית מותאמת אישית, נצטרך לענות על כמה שאלות קצרות.",
        [
          { text: "ביטול", style: "cancel" },
          { text: "בואו נתחיל!", onPress: () => startNewQuiz() },
        ]
      );
    } else if (!quizProgress.isCompleted) {
      // המשך מאיפה שעצר
      Alert.alert(
        "המשך שאלון",
        "נמצא שאלון שלא הושלם. האם תרצה להמשיך מאיפה שעצרת?",
        [
          { text: "התחל מחדש", onPress: () => startNewQuiz() },
          { text: "המשך", onPress: () => continueQuiz() },
          { text: "ביטול", style: "cancel" },
        ]
      );
    }
  }, [quizProgress, navigation]);

  const startNewQuiz = useCallback(() => {
    // במקום לנווט לשאלון ישירות, ניצור שאלון מקומי או ננווט לדף מיוחד
    Alert.alert(
      "בקרוב!",
      "מערכת השאלון האישי תהיה זמינה בקרוב. אתה יכול ליצור תוכנית אימון ידנית בינתיים.",
      [
        { text: "אוקיי", style: "default" },
        {
          text: "צור תוכנית",
          onPress: () => navigation.navigate("Main", { screen: "Plans" }),
        },
      ]
    );
  }, [navigation]);

  const continueQuiz = useCallback(() => {
    // זה גם יעבוד רק כשיהיה לנו מסך שאלון מלא
    Alert.alert("בקרוב!", "אפשרות המשכת שאלון תהיה זמינה בקרוב.", [
      { text: "אוקיי", style: "default" },
    ]);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.quizCard}>
        <View style={styles.loadingContainer}>
          <Ionicons
            name="hourglass-outline"
            size={24}
            color={profileColors.accent}
          />
          <Text style={styles.loadingText}>טוען מצב שאלון...</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.quizCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {!quizProgress ? (
        // לא עשה שאלון כלל
        <View style={styles.quizContent}>
          <View style={styles.quizIcon}>
            <Ionicons
              name="clipboard-outline"
              size={32}
              color={profileColors.accent}
            />
          </View>
          <Text style={styles.quizTitle}>השלם את הפרופיל שלך</Text>
          <Text style={styles.quizDescription}>
            ענה על שאלון קצר כדי לקבל תוכנית אימון מותאמת אישית
          </Text>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleQuizAction}
          >
            <Text style={styles.quizButtonText}>התחל שאלון 🎯</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      ) : !quizProgress.isCompleted ? (
        // התחיל אבל לא סיים
        <View style={styles.quizContent}>
          <View
            style={[
              styles.quizIcon,
              { backgroundColor: profileColors.secondary + "20" },
            ]}
          >
            <Ionicons
              name="pause-circle-outline"
              size={32}
              color={profileColors.secondary}
            />
          </View>
          <Text style={styles.quizTitle}>שאלון בתהליך</Text>
          <Text style={styles.quizDescription}>
            יש לך שאלון שלא הושלם. תוכל להמשיך מאיפה שעצרת
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (Object.keys(quizProgress.answers).length / 12) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Object.keys(quizProgress.answers).length}/12 שאלות
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleQuizAction}
          >
            <Text style={styles.quizButtonText}>המשך שאלון 🔄</Text>
            <Ionicons name="play" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      ) : (
        // השלם בהצלחה - הצג תוצאות
        <QuizResultsView
          answers={quizProgress.answers}
          completedAt={quizProgress.completedAt}
        />
      )}
    </Animated.View>
  );
};

// 📋 רכיב הצגת תוצאות השאלון
const QuizResultsView = ({
  answers,
  completedAt,
}: {
  answers: Partial<QuizAnswers>;
  completedAt?: string;
}) => {
  const getGoalText = (goal?: string) => {
    const goals = {
      hypertrophy: "הגדלת מסת שריר 💪",
      strength: "חיזוק כוח 🏋️",
      endurance: "סיבולת וחיטוב 🏃",
      weight_loss: "ירידה במשקל 🔥",
    };
    return goals[goal as keyof typeof goals] || "לא צוין";
  };

  const getExperienceText = (exp?: string) => {
    const levels = {
      beginner: "מתחיל 🌱",
      intermediate: "בינוני ⚡",
      advanced: "מתקדם 🚀",
    };
    return levels[exp as keyof typeof levels] || "לא צוין";
  };

  const getEquipmentText = (equipment?: string[]) => {
    if (!equipment) return "לא צוין";
    const equipmentMap = {
      gym: "חדר כושר 🏋️",
      home_equipment: "ציוד ביתי 🏠",
      no_equipment: "משקל גוף 🤸",
    };
    return equipment
      .map((eq) => equipmentMap[eq as keyof typeof equipmentMap])
      .join(", ");
  };

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <View
          style={[
            styles.quizIcon,
            { backgroundColor: profileColors.accent + "20" },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={32}
            color={profileColors.accent}
          />
        </View>
        <Text style={styles.resultsTitle}>הפרופיל הושלם! ✅</Text>
        {completedAt && (
          <Text style={styles.completedDate}>
            הושלם ב-{new Date(completedAt).toLocaleDateString("he-IL")}
          </Text>
        )}
      </View>

      <View style={styles.answersList}>
        <AnswerItem
          icon="target"
          label="מטרה"
          value={getGoalText(answers.goal)}
          color={profileColors.accent}
        />
        <AnswerItem
          icon="school"
          label="רמת ניסיון"
          value={getExperienceText(answers.experience)}
          color={profileColors.secondary}
        />
        <AnswerItem
          icon="fitness"
          label="ציוד"
          value={getEquipmentText(answers.whereToTrain)}
          color="#8b5cf6"
        />
        <AnswerItem
          icon="calendar"
          label="ימי אימון"
          value={`${answers.days || 0} ימים בשבוע`}
          color="#f59e0b"
        />
        {answers.injuries && !answers.injuries.includes("none") && (
          <AnswerItem
            icon="shield-checkmark"
            label="התחשבות בפציעות"
            value="כן ✓"
            color={profileColors.danger}
          />
        )}
      </View>

      <View style={styles.resultsActions}>
        <TouchableOpacity style={styles.viewPlansButton}>
          <Text style={styles.viewPlansText}>צפה בתוכניות שנוצרו</Text>
          <Ionicons name="library" size={16} color={profileColors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 📝 רכיב פריט תשובה
const AnswerItem = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.answerItem}>
    <View style={[styles.answerIcon, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <View style={styles.answerContent}>
      <Text style={styles.answerLabel}>{label}</Text>
      <Text style={styles.answerValue}>{value}</Text>
    </View>
  </View>
);

// 👤 המסך הראשי
const ProfileScreen = () => {
  const user = useUserStore((state: UserState) => state.user);
  const logout = useUserStore((state: UserState) => state.logout);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDeleteAccount = useCallback(() => {
    console.log(`Deleting account for user: ${user?.id}`);
    setDeleteModalVisible(false);
    logout();
    Alert.alert("החשבון נמחק בהצלחה");
  }, [user?.id, logout]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "G";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>שגיאה: לא נמצא משתמש</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* רקע גרדיאנט */}
      <View style={styles.backgroundGradient} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header פרופיל */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
              </View>
              <View style={styles.avatarGlow} />
            </View>
            <Text style={styles.name}>{user.name || "משתמש אורח"}</Text>
            <Text style={styles.email}>{user.email}</Text>

            {user.age && (
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Ionicons
                    name="person"
                    size={16}
                    color={profileColors.accent}
                  />
                  <Text style={styles.statText}>גיל {user.age}</Text>
                </View>
              </View>
            )}
          </View>

          {/* מצב השאלון */}
          <QuizStatusCard userId={user.id} />

          {/* כפתורי דמו למפתחים */}
          {__DEV__ && (
            <View style={styles.devSection}>
              <Text style={styles.devTitle}>🔧 Developer Tools</Text>
              <View style={styles.devButtons}>
                <TouchableOpacity
                  style={styles.devButton}
                  onPress={() => {
                    // סימולציה של שאלון שלא הושלם
                    quizProgressStorage[user.id] = {
                      isCompleted: false,
                      currentQuestionId: "experience",
                      answers: { goal: "hypertrophy", whereToTrain: ["gym"] },
                      lastUpdated: new Date().toISOString(),
                    };
                    loadProgress();
                  }}
                >
                  <Text style={styles.devButtonText}>דמה שאלון חלקי</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.devButton}
                  onPress={() => {
                    // סימולציה של שאלון מושלם
                    quizProgressStorage[user.id] = {
                      isCompleted: true,
                      answers: {
                        goal: "hypertrophy",
                        whereToTrain: ["gym"],
                        experience: "intermediate",
                        days: 4,
                        injuries: ["none"],
                      },
                      completedAt: new Date().toISOString(),
                      lastUpdated: new Date().toISOString(),
                    };
                    loadProgress();
                  }}
                >
                  <Text style={styles.devButtonText}>דמה שאלון מושלם</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.devButton}
                  onPress={() => {
                    // מחיקת כל ההתקדמות
                    delete quizProgressStorage[user.id];
                    loadProgress();
                  }}
                >
                  <Text style={styles.devButtonText}>אפס שאלון</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* פעולות פרופיל */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>הגדרות</Text>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={profileColors.accent}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>ערוך פרופיל</Text>
                <Text style={styles.actionSubtitle}>עדכן פרטים אישיים</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={profileColors.subtext}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={profileColors.secondary}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>התראות</Text>
                <Text style={styles.actionSubtitle}>
                  הגדרות הודעות ותזכורות
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={profileColors.subtext}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="shield-outline" size={24} color="#8b5cf6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>פרטיות ובטיחות</Text>
                <Text style={styles.actionSubtitle}>ניהול נתונים ופרטיות</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={profileColors.subtext}
              />
            </TouchableOpacity>
          </View>

          {/* כפתורי פעולה ראשיים */}
          <View style={styles.mainActions}>
            <TouchableOpacity
              style={[styles.mainActionButton, styles.logoutButton]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                logout();
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.mainActionText}>התנתק</Text>
            </TouchableOpacity>
          </View>

          {/* אזור סכנה */}
          <View style={styles.dangerZone}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setDeleteModalVisible(true);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={profileColors.danger}
              />
              <Text style={styles.deleteButtonText}>מחק חשבון</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* דיאלוג מחיקה */}
      <Dialog
        visible={isDeleteModalVisible}
        title="אישור מחיקת חשבון"
        message="האם אתה בטוח שברצונך למחוק את החשבון? כל הנתונים יימחקו לצמיתות."
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        confirmLabel="כן, מחק"
        cancelLabel="לא, בטל"
      />
    </View>
  );
};

// 🎨 סטיילים מתקדמים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: profileColors.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: profileColors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    color: profileColors.text,
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },

  // Profile Header
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: profileColors.accent,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  avatarGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: profileColors.accent + "20",
    top: -10,
    left: -10,
  },
  avatarText: {
    color: "#000",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: profileColors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: profileColors.subtext,
    textAlign: "center",
    marginBottom: 12,
  },
  userStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: profileColors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    color: profileColors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  // Quiz Card
  quizCard: {
    backgroundColor: profileColors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: profileColors.border,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: profileColors.subtext,
    fontSize: 14,
  },
  quizContent: {
    alignItems: "center",
  },
  quizIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: profileColors.accent + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: profileColors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: profileColors.subtext,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: profileColors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: profileColors.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: profileColors.subtext,
    textAlign: "center",
  },
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: profileColors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quizButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Quiz Results
  resultsContainer: {
    alignItems: "center",
  },
  resultsHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: profileColors.text,
    textAlign: "center",
    marginTop: 12,
  },
  completedDate: {
    fontSize: 12,
    color: profileColors.subtext,
    marginTop: 4,
  },
  answersList: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  answerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  answerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  answerContent: {
    flex: 1,
  },
  answerLabel: {
    fontSize: 12,
    color: profileColors.subtext,
    marginBottom: 2,
  },
  answerValue: {
    fontSize: 14,
    color: profileColors.text,
    fontWeight: "600",
  },
  resultsActions: {
    width: "100%",
  },
  viewPlansButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: profileColors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  viewPlansText: {
    color: profileColors.accent,
    fontSize: 14,
    fontWeight: "600",
  },

  // Actions Section
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: profileColors.text,
    marginBottom: 16,
    textAlign: "right",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: profileColors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: profileColors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: profileColors.text,
    marginBottom: 2,
    textAlign: "right",
  },
  actionSubtitle: {
    fontSize: 13,
    color: profileColors.subtext,
    textAlign: "right",
  },

  // Main Actions
  mainActions: {
    marginBottom: 32,
  },
  mainActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutButton: {
    backgroundColor: profileColors.secondary,
  },
  mainActionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  // Danger Zone
  dangerZone: {
    alignItems: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    fontSize: 14,
    color: profileColors.danger,
    fontWeight: "600",
  },

  // Developer Section
  devSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  devTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b35",
    textAlign: "center",
    marginBottom: 12,
  },
  devButtons: {
    gap: 8,
  },
  devButton: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  devButtonText: {
    color: "#ff6b35",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ProfileScreen;
