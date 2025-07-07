// src/screens/auth/QuizScreen.tsx - ✅ Fixed import error

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { savePlan } from "../../data/storage";
// ✅ Fixed import - using correct function name
import {
  generatePlan, // ✅ Correct function name
  QuizAnswers,
} from "../../services/planGenerator";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

// Quiz Questions Interface
interface QuizQuestion {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  multiSelect: boolean;
  options: QuizOption[];
  next: string | null;
}

interface QuizOption {
  text: string;
  value: any;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  description?: string;
}

// ✅ Fixed function with proper async handling and correct imports
const generateProfessionalPlan = async (
  answers: Record<string, any>,
  userId?: string
): Promise<Plan> => {
  console.log("🎯 יוצר תוכנית מותאמת אישית על בסיס תשובות השאלון...");

  // המרת התשובות לפורמט הנדרש עבור generatePlan
  const quizAnswers: QuizAnswers = {
    goal: answers.goal || "hypertrophy",
    experience: answers.experience || "beginner",
    equipment: Array.isArray(answers.equipment)
      ? answers.equipment
      : answers.whereToTrain?.includes("gym")
      ? ["gym"]
      : ["home"],
    injuries: answers.injuries || [],
    workoutDays: answers.days || 3,
    timePerSession: 60, // ברירת מחדל - 60 דקות
  };

  try {
    // ✅ Using correct function name with await
    const personalizedPlan = await generatePlan(quizAnswers, userId);

    console.log("✅ תוכנית מותאמת אישית נוצרה בהצלחה!");
    return personalizedPlan;
  } catch (error) {
    console.error("❌ שגיאה ביצירת תוכנית:", error);
    throw new Error("לא ניתן ליצור תוכנית מותאמת אישית");
  }
};

// Sample quiz questions (simplified for demo)
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "goal",
    text: "מה המטרה העיקרית שלך?",
    icon: "trophy",
    multiSelect: false,
    options: [
      {
        text: "בניית שריר ומסה",
        value: "hypertrophy",
        icon: "fitness",
        color: "#E74C3C",
      },
      {
        text: "ירידה במשקל",
        value: "weight_loss",
        icon: "trending-down",
        color: "#3498DB",
      },
      {
        text: "בניית כוח",
        value: "strength",
        icon: "barbell",
        color: "#9B59B6",
      },
      {
        text: "שיפור סיבולת",
        value: "endurance",
        icon: "heart",
        color: "#E67E22",
      },
    ],
    next: "experience",
  },
  {
    id: "experience",
    text: "מה רמת הניסיון שלך באימונים?",
    icon: "school",
    multiSelect: false,
    options: [
      {
        text: "מתחיל (0-6 חודשים)",
        value: "beginner",
        icon: "leaf",
        color: "#27AE60",
      },
      {
        text: "בינוני (6 חודשים - 2 שנים)",
        value: "intermediate",
        icon: "trending-up",
        color: "#F39C12",
      },
      {
        text: "מתקדם (2+ שנים)",
        value: "advanced",
        icon: "trophy",
        color: "#8E44AD",
      },
    ],
    next: "equipment",
  },
  {
    id: "equipment",
    text: "איזה ציוד זמין לך?",
    icon: "hardware-chip",
    multiSelect: true,
    options: [
      {
        text: "חדר כושר מלא",
        value: "gym",
        icon: "business",
        color: "#2C3E50",
      },
      {
        text: "משקולות בבית",
        value: "dumbbells",
        icon: "barbell",
        color: "#34495E",
      },
      {
        text: "רק משקל גוף",
        value: "bodyweight",
        icon: "person",
        color: "#16A085",
      },
      {
        text: "ציוד מינימלי",
        value: "minimal",
        icon: "ellipse",
        color: "#7F8C8D",
      },
    ],
    next: "days",
  },
  {
    id: "days",
    text: "כמה ימים בשבוע תוכל להתאמן?",
    icon: "calendar",
    multiSelect: false,
    options: [
      { text: "2-3 ימים", value: 3, icon: "calendar", color: "#3498DB" },
      { text: "4-5 ימים", value: 4, icon: "calendar", color: "#E67E22" },
      { text: "6+ ימים", value: 6, icon: "calendar", color: "#E74C3C" },
    ],
    next: null,
  },
];

const QuizScreen: React.FC<Props> = ({ navigation, route }) => {
  const { signupData } = route.params;
  const user = useUserStore((state: UserState) => state.user);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;
  const progress = (currentQuestionIndex + 1) / QUIZ_QUESTIONS.length;

  // Animation for question transitions
  const animateToNextQuestion = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: QuizOption) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (currentQuestion.multiSelect) {
        const isSelected = selectedOptions.some(
          (o) => o.value === option.value
        );
        if (isSelected) {
          setSelectedOptions((prev) =>
            prev.filter((o) => o.value !== option.value)
          );
        } else {
          setSelectedOptions((prev) => [...prev, option]);
        }
      } else {
        setSelectedOptions([option]);
      }
    },
    [currentQuestion.multiSelect, selectedOptions]
  );

  // Handle next question
  const handleNext = useCallback(async () => {
    if (selectedOptions.length === 0) {
      Alert.alert("בחר תשובה", "אנא בחר לפחות תשובה אחת כדי להמשיך");
      return;
    }

    // Save current answer
    const answerValue = currentQuestion.multiSelect
      ? selectedOptions.map((o) => o.value)
      : selectedOptions[0].value;

    const newAnswers = { ...answers, [currentQuestion.id]: answerValue };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Generate plan
      await handleGeneratePlan(newAnswers);
    } else {
      // Move to next question
      animateToNextQuestion();
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions([]);
    }
  }, [
    selectedOptions,
    currentQuestion,
    answers,
    isLastQuestion,
    animateToNextQuestion,
  ]);

  // ✅ Fixed plan generation with proper async handling
  const handleGeneratePlan = async (finalAnswers: Record<string, any>) => {
    try {
      setIsLoading(true);

      const userId =
        user?.id || signupData?.email?.replace("@", "_").replace(".", "_");
      const plan = await generateProfessionalPlan(finalAnswers, userId);

      // Save plan if user exists
      if (userId && plan) {
        await savePlan(userId, plan);
        console.log("✅ Plan saved successfully");
      }

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      console.error("❌ Plan generation failed:", error);
      Alert.alert(
        "שגיאה",
        "לא ניתן ליצור תוכנית אישית כרגע. נסה שוב מאוחר יותר.",
        [
          { text: "נסה שוב", onPress: () => handleGeneratePlan(finalAnswers) },
          {
            text: "דלג",
            onPress: () =>
              navigation.reset({ index: 0, routes: [{ name: "Main" }] }),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back
  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOptions([]);
    } else {
      navigation.goBack();
    }
  }, [currentQuestionIndex, navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>יוצר תוכנית מותאמת אישית...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.questionCounter}>
          {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
        </Text>
      </View>

      {/* Question */}
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.questionHeader}>
          <Ionicons
            name={currentQuestion.icon}
            size={48}
            color={colors.primary}
          />
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        <ScrollView
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptions.some(
              (o) => o.value === option.value
            );

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  isSelected && styles.selectedOption,
                  { borderLeftColor: option.color || colors.primary },
                ]}
                onPress={() => handleOptionSelect(option)}
              >
                <View style={styles.optionContent}>
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={
                        isSelected ? "white" : option.color || colors.primary
                      }
                    />
                  )}
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {option.text}
                  </Text>
                </View>

                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedOptions.length === 0 && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={selectedOptions.length === 0}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? "צור תוכנית" : "המשך"}
          </Text>
          <Ionicons
            name={isLastQuestion ? "create" : "arrow-forward"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginRight: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  questionCounter: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderLeftColor: colors.primary,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "white",
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QuizScreen;
