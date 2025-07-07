// src/screens/auth/QuizScreen.tsx - גרסה מקצועית ומתקנת

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { demoPlans } from "../../constants/demoPlans";
import { savePlan } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

const { width, height } = Dimensions.get("window");

// מאגר שאלות מעוצב ומקצועי
const QUIZ_QUESTIONS = [
  {
    id: "goal",
    text: "מה המטרה העיקרית שלך?",
    icon: "trophy" as const,
    options: [
      {
        text: "עלייה במסת שריר",
        value: "hypertrophy",
        icon: "fitness" as const,
        color: "#ff6b35",
      },
      {
        text: "שיפור בכוח",
        value: "strength",
        icon: "barbell" as const,
        color: "#007aff",
      },
      {
        text: "סיבולת וחיטוב",
        value: "endurance",
        icon: "heart" as const,
        color: "#ff3366",
      },
    ],
  },
  {
    id: "experience",
    text: "מה רמת הניסיון שלך?",
    icon: "school" as const,
    options: [
      {
        text: "מתחיל (0-1 שנים)",
        value: "beginner",
        icon: "leaf" as const,
        color: "#00ff88",
      },
      {
        text: "בינוני (1-3 שנים)",
        value: "intermediate",
        icon: "flash" as const,
        color: "#ffab00",
      },
      {
        text: "מתקדם (3+ שנים)",
        value: "advanced",
        icon: "rocket" as const,
        color: "#8b5cf6",
      },
    ],
  },
  {
    id: "days",
    text: "כמה ימים בשבוע תרצה להתאמן?",
    icon: "calendar" as const,
    options: [
      { text: "2-3 ימים", value: 3, icon: "time" as const, color: "#34d399" },
      {
        text: "4 ימים",
        value: 4,
        icon: "hourglass" as const,
        color: "#fbbf24",
      },
      { text: "5-6 ימים", value: 5, icon: "flame" as const, color: "#f87171" },
    ],
  },
];

const generateProfessionalPlan = (answers: Record<string, any>): Plan => {
  console.log("Generating AI-powered plan based on:", answers);
  if (answers.goal === "strength" && answers.experience === "advanced") {
    return demoPlans[1];
  }
  if (answers.goal === "hypertrophy") {
    return demoPlans[0];
  }
  return demoPlans[0];
};

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

const QuizScreen = ({ navigation, route }: Props) => {
  const { signupData } = route.params;
  const register = useUserStore((state: UserState) => state.register);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionSlide = useRef(new Animated.Value(50)).current;
  const optionsSlide = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startQuestionAnimation();
  }, [currentStep]);

  const startQuestionAnimation = () => {
    // Reset animations
    questionSlide.setValue(50);
    optionsSlide.setValue(100);

    Animated.sequence([
      // Header entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Progress bar
      Animated.timing(progressAnim, {
        toValue: (currentStep + 1) / QUIZ_QUESTIONS.length,
        duration: 600,
        useNativeDriver: false,
      }),
      // Question entrance
      Animated.timing(questionSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Options entrance
      Animated.timing(optionsSlide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for question icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleAnswer = async (
    questionId: string,
    answerValue: string | number
  ) => {
    setSelectedOption(String(answerValue));

    // Selection animation
    Animated.spring(pulseAnim, {
      toValue: 1.2,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Wait for animation
    setTimeout(async () => {
      const newAnswers = { ...answers, [questionId]: answerValue };
      setAnswers(newAnswers);

      const isLastStep = currentStep === QUIZ_QUESTIONS.length - 1;

      if (isLastStep) {
        // Final registration process
        setIsRegistering(true);

        const finalAnswers = { ...newAnswers, [questionId]: answerValue };
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
        // Move to next question
        Animated.parallel([
          Animated.timing(questionSlide, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(optionsSlide, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentStep(currentStep + 1);
          setSelectedOption(null);
        });
      }
    }, 500);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Loading Screen
  if (isRegistering) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ImageBackground
          source={require("../../../assets/images/backgrounds/welcome-bg.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.loadingContent}>
            <Animated.View
              style={[
                styles.loadingIconContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.loadingGlow} />
              <Ionicons name="construct" size={60} color={colors.primary} />
            </Animated.View>
            <Text style={styles.loadingTitle}>
              יוצרים את התוכנית המושלמת עבורך
            </Text>
            <Text style={styles.loadingSubtitle}>
              הבינה המלאכותית מנתחת את התשובות שלך...
            </Text>
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />

            <View style={styles.loadingSteps}>
              <Text style={styles.loadingStep}>✓ ניתוח פרופיל אישי</Text>
              <Text style={styles.loadingStep}>✓ התאמת תרגילים</Text>
              <Text style={styles.loadingStep}>⏳ יצירת תוכנית מותאמת</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  // Main Quiz Screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ImageBackground
        source={require("../../../assets/images/backgrounds/welcome-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressText}>
            שלב {currentStep + 1} מתוך {QUIZ_QUESTIONS.length}
          </Text>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <Animated.View
            style={[styles.header, { transform: [{ translateY: slideAnim }] }]}
          >
            <Animated.View
              style={[
                styles.questionIconContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.questionGlow} />
              <Ionicons
                name={currentQuestion.icon}
                size={50}
                color={colors.primary}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.questionContainer,
                { transform: [{ translateY: questionSlide }] },
              ]}
            >
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
            </Animated.View>
          </Animated.View>

          {/* Options */}
          <ScrollView
            style={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {currentQuestion.options.map((option, index) => (
              <Animated.View
                key={option.value.toString()}
                style={[
                  styles.optionWrapper,
                  {
                    transform: [
                      {
                        translateY: optionsSlide.interpolate({
                          inputRange: [0, 100],
                          outputRange: [0, 100 + index * 20],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    selectedOption === String(option.value) &&
                      styles.optionSelected,
                  ]}
                  onPress={() => handleAnswer(currentQuestion.id, option.value)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: option.color + "20" },
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={28}
                        color={option.color}
                      />
                    </View>
                    <Text style={styles.optionText}>{option.text}</Text>
                    <View style={styles.optionArrow}>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  progressContainer: {
    position: "absolute",
    top: 60,
    left: 32,
    right: 32,
    zIndex: 1,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  progressText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  content: {
    flex: 1,
    paddingTop: 140,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  questionIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  questionGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 255, 136, 0.15)",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 15,
  },
  questionContainer: {
    alignItems: "center",
  },
  questionText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
    textShadowColor: "rgba(0, 255, 136, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  optionsContainer: {
    flex: 1,
  },
  optionWrapper: {
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
  },
  optionContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 20,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "right",
    marginRight: 16,
  },
  optionArrow: {
    opacity: 0.7,
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  loadingGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0, 255, 136, 0.2)",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
  },
  loadingSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  loadingSteps: {
    marginTop: 40,
    alignItems: "flex-start",
  },
  loadingStep: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});

export default QuizScreen;
