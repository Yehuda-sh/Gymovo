// src/screens/auth/QuizScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import { demoPlans } from "../../constants/demoPlans";
import { savePlan } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

// מאגר השאלות והתשובות האפשריות לשאלון
const QUIZ_QUESTIONS = [
  {
    id: "goal",
    text: "מה המטרה העיקרית שלך?",
    options: [
      { text: "עלייה במסת שריר", value: "hypertrophy" },
      { text: "שיפור בכוח", value: "strength" },
      { text: "סיבולת וחיטוב", value: "endurance" },
    ],
  },
  {
    id: "experience",
    text: "מה רמת הניסיון שלך?",
    options: [
      { text: "מתחיל (0-1 שנים)", value: "beginner" },
      { text: "בינוני (1-3 שנים)", value: "intermediate" },
      { text: "מתקדם (3+ שנים)", value: "advanced" },
    ],
  },
  {
    id: "days",
    text: "כמה ימים בשבוע תרצה להתאמן?",
    options: [
      { text: "2-3 ימים", value: 3 },
      { text: "4 ימים", value: 4 },
      { text: "5-6 ימים", value: 5 },
    ],
  },
];

// פונקציה המדמה "בינה מלאכותית" ובונה תוכנית על סמך תשובות המשתמש
const generateProfessionalPlan = (answers: Record<string, any>): Plan => {
  // TODO: בעתיד, נוכל להחליף את הלוגיקה הפשוטה הזו בקריאה ל-API של מודל שפה אמיתי
  console.log("Generating plan based on answers:", answers);
  if (answers.goal === "strength" && answers.experience === "advanced") {
    return demoPlans[1];
  }
  if (answers.goal === "hypertrophy") {
    return demoPlans[0];
  }
  return demoPlans[0];
};

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

// מסך השאלון האינטראקטיבי, חלק מתהליך ההרשמה
const QuizScreen = ({ navigation, route }: Props) => {
  const { signupData } = route.params;
  const register = useUserStore((state: UserState) => state.register);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isRegistering, setIsRegistering] = useState(false);

  // פונקציה המטפלת בבחירת תשובה ומקדמת לשלב הבא או מסיימת את השאלון
  const handleAnswer = async (
    questionId: string,
    answerValue: string | number
  ) => {
    const newAnswers = { ...answers, [questionId]: answerValue };
    setAnswers(newAnswers);

    const isLastStep = currentStep === QUIZ_QUESTIONS.length - 1;
    if (isLastStep) {
      setIsRegistering(true);
      const finalAnswers = { ...newAnswers, [questionId]: answerValue };
      // ביצוע הרשמה, יצירת תוכנית ושמירה שלה
      const registerResult = await register(signupData);
      if (registerResult.success) {
        const generatedPlan = generateProfessionalPlan(finalAnswers);
        const currentUserId = useUserStore.getState().user?.id;
        if (currentUserId) {
          await savePlan(currentUserId, generatedPlan);
        }
      } else {
        setIsRegistering(false);
        Alert.alert(
          "שגיאת הרשמה",
          registerResult.error || "אירעה שגיאה, נסה שוב."
        );
        navigation.goBack();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (isRegistering) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          יוצרים את התוכנית המושלמת עבורך...
        </Text>
      </View>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.stepText}>
          שלב {currentStep + 1} מתוך {QUIZ_QUESTIONS.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => (
          <Button
            key={option.value.toString()}
            title={option.text}
            onPress={() => handleAnswer(currentQuestion.id, option.value)}
            variant="outline"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  stepText: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  optionsContainer: { width: "100%", gap: 10, paddingBottom: 20 },
  loadingText: { marginTop: 20, fontSize: 16, color: colors.primary },
});

export default QuizScreen;
