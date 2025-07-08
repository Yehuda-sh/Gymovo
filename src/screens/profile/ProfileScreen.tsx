// src/screens/profile/ProfileScreen.tsx - ✅ מסך פרופיל מתקדם עם מערכת שאלון חכמה

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Components & Services
import { Toast } from "../../components/common/Toast";
import { clearAllData } from "../../data/storage";
import {
  clearQuizProgress,
  loadQuizProgress,
  QuizProgress,
  saveQuizProgress,
} from "../../services/quizProgressService";

// Stores & Types
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { QuizAnswers } from "../../services/planGenerator";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 🎨 צבעים מותאמים לפרופיל
const profileColors = {
  background: colors.background,
  cardBg: colors.surface,
  accent: colors.primary,
  secondary: colors.warning,
  danger: colors.error,
  text: colors.text,
  subtext: colors.textSecondary,
  border: colors.border,
  success: colors.success,
};

// 📋 רכיב הצגת תוצאות השאלון
const QuizResultsView = ({
  answers,
  completedAt,
  onViewPlans,
  onRetakeQuiz,
}: {
  answers: Partial<QuizAnswers>;
  completedAt?: string;
  onViewPlans: () => void;
  onRetakeQuiz: () => void;
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
    if (!equipment || equipment.length === 0) return "לא צוין";
    const equipmentMap: Record<string, string> = {
      gym: "חדר כושר",
      home: "בית",
      dumbbells: "משקולות",
      bands: "גומיות",
      bodyweight: "משקל גוף",
    };
    return equipment.map((e) => equipmentMap[e] || e).join(", ");
  };

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <View
          style={[
            styles.quizIcon,
            { backgroundColor: profileColors.success + "20" },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={32}
            color={profileColors.success}
          />
        </View>
        <Text style={styles.resultsTitle}>השאלון הושלם בהצלחה! 🎉</Text>
        {completedAt && (
          <Text style={styles.completedDate}>
            הושלם ב-{new Date(completedAt).toLocaleDateString("he-IL")}
          </Text>
        )}
      </View>

      <View style={styles.answersList}>
        {/* מטרה */}
        {answers.goal && (
          <View style={styles.answerItem}>
            <View
              style={[
                styles.answerIcon,
                { backgroundColor: profileColors.accent + "20" },
              ]}
            >
              <Ionicons name="fitness" size={18} color={profileColors.accent} />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>המטרה שלך</Text>
              <Text style={styles.answerValue}>
                {getGoalText(answers.goal)}
              </Text>
            </View>
          </View>
        )}

        {/* ניסיון */}
        {answers.experience && (
          <View style={styles.answerItem}>
            <View
              style={[
                styles.answerIcon,
                { backgroundColor: profileColors.secondary + "20" },
              ]}
            >
              <Ionicons
                name="trending-up"
                size={18}
                color={profileColors.secondary}
              />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>רמת ניסיון</Text>
              <Text style={styles.answerValue}>
                {getExperienceText(answers.experience)}
              </Text>
            </View>
          </View>
        )}

        {/* ציוד */}
        {answers.equipment && (
          <View style={styles.answerItem}>
            <View style={[styles.answerIcon, { backgroundColor: "#9333ea20" }]}>
              <Ionicons name="barbell" size={18} color="#9333ea" />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>ציוד זמין</Text>
              <Text style={styles.answerValue}>
                {getEquipmentText(answers.equipment)}
              </Text>
            </View>
          </View>
        )}

        {/* ימי אימון */}
        {answers.workoutDays && (
          <View style={styles.answerItem}>
            <View style={[styles.answerIcon, { backgroundColor: "#3b82f620" }]}>
              <Ionicons name="calendar" size={18} color="#3b82f6" />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>ימי אימון בשבוע</Text>
              <Text style={styles.answerValue}>{answers.workoutDays} ימים</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.resultsActions}>
        <TouchableOpacity style={styles.viewPlansButton} onPress={onViewPlans}>
          <Ionicons name="list" size={20} color={profileColors.accent} />
          <Text style={styles.viewPlansText}>צפה בתוכניות שנוצרו</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retakeButton} onPress={onRetakeQuiz}>
          <Text style={styles.retakeText}>מלא שאלון מחדש</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🧠 רכיב מצב השאלון
const QuizStatusCard = ({
  userId,
  onResumeQuiz,
  onStartNewQuiz,
}: {
  userId: string;
  onResumeQuiz: (progress: QuizProgress) => void;
  onStartNewQuiz: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = async () => {
    try {
      setIsLoading(true);
      const progress = await loadQuizProgress(userId);
      setQuizProgress(progress);

      // אנימציית כניסה
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Failed to load quiz progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPlans = () => {
    Toast.show("עבור למסך התוכניות שלי", "info");
  };

  const handleRetakeQuiz = () => {
    Alert.alert(
      "מילוי שאלון מחדש",
      "האם אתה בטוח שברצונך למלא את השאלון מחדש? התוכניות הקיימות לא יימחקו.",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "המשך",
          onPress: async () => {
            await clearQuizProgress(userId);
            setQuizProgress(null);
            onStartNewQuiz();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.quizCard}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={profileColors.accent} />
          <Text style={styles.loadingText}>בודק מצב שאלון...</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.quizCard, { opacity: fadeAnim }]}>
      {!quizProgress ? (
        // לא התחיל שאלון
        <View style={styles.quizContent}>
          <View style={styles.quizIcon}>
            <Ionicons
              name="clipboard-outline"
              size={32}
              color={profileColors.accent}
            />
          </View>
          <Text style={styles.quizTitle}>בנה תוכנית אימונים אישית</Text>
          <Text style={styles.quizDescription}>
            ענה על מספר שאלות קצרות ונבנה עבורך תוכנית אימונים מותאמת אישית
          </Text>
          <TouchableOpacity style={styles.quizButton} onPress={onStartNewQuiz}>
            <Text style={styles.quizButtonText}>התחל שאלון</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      ) : !quizProgress.isCompleted ? (
        // יש שאלון בתהליך
        <View style={styles.quizContent}>
          <View
            style={[
              styles.quizIcon,
              { backgroundColor: profileColors.secondary + "20" },
            ]}
          >
            <Ionicons
              name="pause-circle"
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
              <Animated.View
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
            style={[
              styles.quizButton,
              { backgroundColor: profileColors.secondary },
            ]}
            onPress={() => onResumeQuiz(quizProgress)}
          >
            <Text style={styles.quizButtonText}>המשך שאלון</Text>
            <Ionicons name="play" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      ) : (
        // השלים שאלון
        <QuizResultsView
          answers={quizProgress.answers}
          completedAt={quizProgress.completedAt}
          onViewPlans={handleViewPlans}
          onRetakeQuiz={handleRetakeQuiz}
        />
      )}
    </Animated.View>
  );
};

// 🏠 מסך פרופיל ראשי
const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  // State
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // אנימציית כניסה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const handleStartQuiz = () => {
    if (!user) return;

    navigation.navigate("Quiz", {
      signupData: {
        email: user.email,
        password: "",
        age: user.age || 25,
        name: user.name,
      },
    });
  };

  const handleResumeQuiz = (progress: QuizProgress) => {
    if (!user) return;

    navigation.navigate("Quiz", {
      signupData: {
        email: user.email,
        password: "",
        age: user.age || 25,
        name: user.name,
      },
      resumeFrom: progress.currentQuestionId,
      existingAnswers: progress.answers,
    });
  };

  const handleLogout = () => {
    Alert.alert("יציאה מהחשבון", "האם אתה בטוח שברצונך לצאת?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "יציאה",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.navigate("Welcome");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "מחיקת חשבון",
      "פעולה זו תמחק את כל הנתונים שלך ולא ניתן לבטל אותה. האם אתה בטוח?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק חשבון",
          style: "destructive",
          onPress: async () => {
            if (user?.id) {
              await clearAllData();
              logout();
              navigation.navigate("Welcome");
              Toast.show("החשבון נמחק בהצלחה", "success");
            }
          },
        },
      ]
    );
  };

  const getInitials = useMemo(() => {
    if (!user?.name) return "G";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>לא נמצא משתמש מחובר</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[profileColors.accent]}
            tintColor={profileColors.accent}
          />
        }
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials}</Text>
              </View>
              {user.isGuest && (
                <View style={styles.guestBadge}>
                  <Ionicons name="person-outline" size={16} color="#fff" />
                </View>
              )}
            </View>

            <Text style={styles.userName}>{user.name || "משתמש"}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            {user.stats && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {user.stats.workoutsCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>אימונים</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {user.stats.streakDays || 0}
                  </Text>
                  <Text style={styles.statLabel}>ימי רצף</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {Math.round((user.stats.totalWeightLifted || 0) / 1000)}K
                  </Text>
                  <Text style={styles.statLabel}>קג כולל</Text>
                </View>
              </View>
            )}
          </View>

          {/* Quiz Status */}
          {!user.isGuest && (
            <QuizStatusCard
              userId={user.id}
              onResumeQuiz={handleResumeQuiz}
              onStartNewQuiz={handleStartQuiz}
            />
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פעולות מהירות</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Settings")}
            >
              <View style={styles.actionIcon}>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={profileColors.text}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>הגדרות</Text>
                <Text style={styles.actionSubtitle}>התאמה אישית ועדיפויות</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={profileColors.subtext}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => Toast.show("מדריכי אימון - בקרוב", "info")}
            >
              <View style={styles.actionIcon}>
                <Ionicons
                  name="book-outline"
                  size={24}
                  color={profileColors.text}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>מדריכי אימון</Text>
                <Text style={styles.actionSubtitle}>טיפים וטכניקות</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={profileColors.subtext}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => Toast.show("תמיכה - בקרוב", "info")}
            >
              <View style={styles.actionIcon}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={profileColors.text}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>תמיכה</Text>
                <Text style={styles.actionSubtitle}>שאלות נפוצות ועזרה</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={profileColors.subtext}
              />
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.accountSection}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>יציאה מהחשבון</Text>
            </TouchableOpacity>

            {!user.isGuest && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteText}>מחיקת חשבון</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Dev Tools */}
          {__DEV__ && (
            <View style={styles.devSection}>
              <Text style={styles.devTitle}>🛠️ כלי פיתוח</Text>

              <TouchableOpacity
                style={styles.devButton}
                onPress={async () => {
                  if (user?.id) {
                    await clearQuizProgress(user.id);
                    Toast.show("התקדמות השאלון נמחקה", "success");
                  }
                }}
              >
                <Text style={styles.devButtonText}>מחק התקדמות שאלון</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.devButton}
                onPress={async () => {
                  if (user?.id) {
                    // סימולציה של שאלון חלקי
                    const partialProgress: QuizProgress = {
                      isCompleted: false,
                      currentQuestionId: "experience",
                      questionIndex: 4,
                      answers: {
                        goal: "hypertrophy",
                        experience: "intermediate",
                        equipment: ["gym"],
                        workoutDays: 4,
                      },
                      lastUpdated: new Date().toISOString(),
                    };
                    await saveQuizProgress(user.id, partialProgress);
                    Toast.show("נוצר שאלון חלקי לבדיקה", "success");
                  }
                }}
              >
                <Text style={styles.devButtonText}>צור שאלון חלקי (בדיקה)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.devButton}
                onPress={async () => {
                  await clearAllData();
                  Toast.show("כל הנתונים נמחקו", "success");
                }}
              >
                <Text style={styles.devButtonText}>מחק את כל הנתונים</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: profileColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingTop: 60,
  },
  errorText: {
    fontSize: 16,
    color: profileColors.danger,
    textAlign: "center",
    marginTop: 50,
  },

  // Header
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  guestBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: profileColors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: profileColors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: profileColors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: profileColors.subtext,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: profileColors.cardBg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: profileColors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: profileColors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: profileColors.subtext,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: profileColors.border,
  },

  // Quiz Card
  quizCard: {
    backgroundColor: profileColors.cardBg,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
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

  // Results
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
    gap: 8,
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
    marginBottom: 8,
  },
  viewPlansText: {
    color: profileColors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  retakeButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  retakeText: {
    color: profileColors.subtext,
    fontSize: 13,
    textDecorationLine: "underline",
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: profileColors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: profileColors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: profileColors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: profileColors.accent + "10",
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
  },
  actionSubtitle: {
    fontSize: 13,
    color: profileColors.subtext,
  },

  // Account Section
  accountSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: profileColors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  deleteText: {
    fontSize: 14,
    color: profileColors.danger,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Dev Section
  devSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
  },
  devTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
    textAlign: "center",
    marginBottom: 12,
  },
  devButton: {
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  devButtonText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProfileScreen;
