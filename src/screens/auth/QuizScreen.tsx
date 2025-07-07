// src/screens/auth/QuizScreen.tsx – גרסה משופרת עם תיקונים קלים וחוויה טובה יותר

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
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { savePlan } from "../../data/storage";
import {
  generatePersonalizedPlan,
  QuizAnswers,
} from "../../services/planGenerator";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";

const { width, height } = Dimensions.get("window");

// --- דימוי תמונות אונליין לכל מכונה וציוד (demo בלבד) ---
const DEMO_IMAGES = {
  smith_machine:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/smith-machine.jpg",
  chest_press:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/chest-press-machine.jpg",
  lat_pulldown:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/lat-pulldown-machine.jpg",
  pullup_dip:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/assisted-pull-up-machine.jpg",
  leg_press:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/leg-press-machine.jpg",
  leg_extension:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/leg-extension-machine.jpg",
  leg_curl:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/leg-curl-machine.jpg",
  shoulder_press:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/shoulder-press-machine.jpg",
  incline_press:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/incline-press-machine.jpg",
  chest_machine:
    "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/chest-press-machine.jpg",
  // ציוד ביתי
  dumbbells:
    "https://cdn.pixabay.com/photo/2016/03/23/04/01/dumbbell-1275466_1280.png",
  barbell:
    "https://cdn.pixabay.com/photo/2013/07/12/13/58/barbell-147522_1280.png",
  mat: "https://cdn.pixabay.com/photo/2014/12/21/23/55/yoga-577094_1280.png",
  trx: "https://cdn-icons-png.flaticon.com/512/3081/3081749.png",
  resistance_bands: "https://cdn-icons-png.flaticon.com/512/3094/3094838.png",
  bench:
    "https://cdn.pixabay.com/photo/2017/02/21/08/49/fitness-2085395_1280.png",
  cardio_machine:
    "https://cdn.pixabay.com/photo/2014/04/03/10/32/treadmill-312350_1280.png",
  fitball:
    "https://cdn.pixabay.com/photo/2017/05/02/19/54/gym-ball-2277761_1280.png",
  none: "https://cdn-icons-png.flaticon.com/512/44/44386.png",
};

// טיפוס לאופציות
interface QuizOption {
  text: string;
  value: any;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  multiSelect: boolean;
  options?: QuizOption[];
  input?: boolean;
  next: string | null | ((answers: Record<string, any>) => string);
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "goal",
    text: "מה המטרה העיקרית שלך?",
    icon: "trophy" as keyof typeof Ionicons.glyphMap,
    multiSelect: false,
    options: [
      {
        text: "עלייה במסת שריר",
        value: "hypertrophy",
        icon: "fitness" as keyof typeof Ionicons.glyphMap,
        color: "#ff6b35",
      },
      {
        text: "שיפור בכוח",
        value: "strength",
        icon: "barbell" as keyof typeof Ionicons.glyphMap,
        color: "#007aff",
      },
      {
        text: "סיבולת וחיטוב",
        value: "endurance",
        icon: "heart" as keyof typeof Ionicons.glyphMap,
        color: "#ff3366",
      },
      {
        text: "ירידה במשקל",
        value: "weight_loss",
        icon: "walk" as keyof typeof Ionicons.glyphMap,
        color: "#fbc531",
      },
    ],
    next: "whereToTrain",
  },
  {
    id: "whereToTrain",
    text: "איזה סוג תוכנית תרצה שנבנה לך?\n(ניתן לבחור יותר מתשובה אחת)",
    icon: "home" as keyof typeof Ionicons.glyphMap,
    multiSelect: true,
    options: [
      {
        text: "חדר כושר",
        value: "gym",
        icon: "barbell" as keyof typeof Ionicons.glyphMap,
        color: "#3b82f6",
      },
      {
        text: "ציוד ביתי",
        value: "home_equipment",
        icon: "home" as keyof typeof Ionicons.glyphMap,
        color: "#16a34a",
      },
      {
        text: "בלי ציוד",
        value: "no_equipment",
        icon: "body" as keyof typeof Ionicons.glyphMap,
        color: "#f59e42",
      },
    ],
    next: (answers: Record<string, any>) => {
      if (answers.whereToTrain?.includes("gym")) return "gymMachines";
      if (answers.whereToTrain?.includes("home_equipment"))
        return "homeEquipment";
      return "experience";
    },
  },
  {
    id: "gymMachines",
    text: "סמן את המכונות שיש לך במכון:\n(סמן את כולן)",
    icon: "fitness" as keyof typeof Ionicons.glyphMap,
    multiSelect: true,
    options: [
      { text: "סמית' משין (Smith Machine)", value: "smith_machine" },
      { text: "לחיצת חזה (Chest Press)", value: "chest_press" },
      { text: "פולי עליון (Lat Pulldown)", value: "lat_pulldown" },
      { text: "מתח/מקבילים (Pull-up/Dip)", value: "pullup_dip" },
      { text: "לחיצת רגליים (Leg Press)", value: "leg_press" },
      { text: "פשיטת רגליים (Leg Extension)", value: "leg_extension" },
      { text: "כפיפת רגליים (Leg Curl)", value: "leg_curl" },
      { text: "כתפיים ישיבה (Shoulder Press)", value: "shoulder_press" },
      { text: "דחיקת חזה בשיפוע (Incline Press)", value: "incline_press" },
      { text: "שכיבות שמיכה על מכונה (Chest Machine)", value: "chest_machine" },
    ],
    next: (answers: Record<string, any>) =>
      answers.whereToTrain?.includes("home_equipment")
        ? "homeEquipment"
        : "experience",
  },
  {
    id: "homeEquipment",
    text: "איזה ציוד יש לך בבית?\n(סמן את כל הציוד הרלוונטי)",
    icon: "briefcase" as keyof typeof Ionicons.glyphMap,
    multiSelect: true,
    options: [
      { text: "משקולות יד", value: "dumbbells" },
      { text: "מוט אולימפי ומשקולות", value: "barbell" },
      { text: "מזרן", value: "mat" },
      { text: "רצועות TRX", value: "trx" },
      { text: "גומיות התנגדות", value: "resistance_bands" },
      { text: "ספסל", value: "bench" },
      { text: "אופני כושר / הליכון", value: "cardio_machine" },
      { text: "כדור פיטבול", value: "fitball" },
      { text: "אין ציוד", value: "none" },
    ],
    next: "experience",
  },
  {
    id: "experience",
    text: "מה רמת הניסיון שלך?",
    icon: "school" as keyof typeof Ionicons.glyphMap,
    multiSelect: false,
    options: [
      {
        text: "מתחיל",
        value: "beginner",
        icon: "leaf" as keyof typeof Ionicons.glyphMap,
        color: "#00ff88",
      },
      {
        text: "בינוני",
        value: "intermediate",
        icon: "flash" as keyof typeof Ionicons.glyphMap,
        color: "#ffab00",
      },
      {
        text: "מתקדם",
        value: "advanced",
        icon: "rocket" as keyof typeof Ionicons.glyphMap,
        color: "#8b5cf6",
      },
    ],
    next: "days",
  },
  {
    id: "days",
    text: "כמה ימים בשבוע תרצה להתאמן?",
    icon: "calendar" as keyof typeof Ionicons.glyphMap,
    multiSelect: false,
    options: [
      {
        text: "2-3 ימים",
        value: 3,
        icon: "time" as keyof typeof Ionicons.glyphMap,
        color: "#34d399",
      },
      {
        text: "4 ימים",
        value: 4,
        icon: "hourglass" as keyof typeof Ionicons.glyphMap,
        color: "#fbbf24",
      },
      {
        text: "5-6 ימים",
        value: 5,
        icon: "flame" as keyof typeof Ionicons.glyphMap,
        color: "#f87171",
      },
    ],
    next: "injuries",
  },
  {
    id: "injuries",
    text: "יש לך פציעות או מגבלות גופניות?\n(ניתן לבחור יותר מתשובה אחת)",
    icon: "medkit" as keyof typeof Ionicons.glyphMap,
    multiSelect: true,
    options: [
      {
        text: "אין",
        value: "none",
        icon: "checkmark" as keyof typeof Ionicons.glyphMap,
        color: "#00FFB0",
      },
      {
        text: "גב",
        value: "back",
        icon: "body" as keyof typeof Ionicons.glyphMap,
        color: "#FFD166",
      },
      {
        text: "ברכיים",
        value: "knee",
        icon: "walk" as keyof typeof Ionicons.glyphMap,
        color: "#FFD166",
      },
      {
        text: "כתפיים",
        value: "shoulder",
        icon: "hand-left" as keyof typeof Ionicons.glyphMap,
        color: "#FFD166",
      },
      {
        text: "קרסוליים/רגליים",
        value: "ankle",
        icon: "footsteps" as keyof typeof Ionicons.glyphMap,
        color: "#FFD166",
      },
      {
        text: "לב / לחץ דם",
        value: "heart",
        icon: "heart-half" as keyof typeof Ionicons.glyphMap,
        color: "#FF5252",
      },
      {
        text: "אחר",
        value: "other",
        icon: "help-buoy" as keyof typeof Ionicons.glyphMap,
        color: "#54A0FF",
      },
    ],
    next: (answers: Record<string, any>) =>
      answers.injuries?.includes("other") ? "injuryDetails" : "trainingType",
  },
  {
    id: "injuryDetails",
    text: "פרט בבקשה על פציעות נוספות",
    icon: "information-circle" as keyof typeof Ionicons.glyphMap,
    multiSelect: false,
    input: true,
    next: "trainingType",
  },
  {
    id: "trainingType",
    text: "איזה סוגי אימונים מעניינים אותך?\n(ניתן לבחור יותר מתשובה אחת)",
    icon: "pulse" as keyof typeof Ionicons.glyphMap,
    multiSelect: true,
    options: [
      {
        text: "אימוני כוח",
        value: "weights",
        icon: "barbell" as keyof typeof Ionicons.glyphMap,
        color: "#6C63FF",
      },
      {
        text: "פונקציונלי",
        value: "functional",
        icon: "body" as keyof typeof Ionicons.glyphMap,
        color: "#43E97B",
      },
      {
        text: "אירובי/קרדיו",
        value: "cardio",
        icon: "walk" as keyof typeof Ionicons.glyphMap,
        color: "#F94F6D",
      },
      {
        text: "יוגה/פילאטיס",
        value: "yoga",
        icon: "leaf" as keyof typeof Ionicons.glyphMap,
        color: "#FFD700",
      },
    ],
    next: "preferredTime",
  },
  {
    id: "preferredTime",
    text: "מתי אתה מעדיף להתאמן?",
    icon: "time" as keyof typeof Ionicons.glyphMap,
    multiSelect: false,
    options: [
      {
        text: "בוקר",
        value: "morning",
        icon: "sunny" as keyof typeof Ionicons.glyphMap,
        color: "#FFE082",
      },
      {
        text: 'צהריים/אחה"צ',
        value: "afternoon",
        icon: "partly-sunny" as keyof typeof Ionicons.glyphMap,
        color: "#64B5F6",
      },
      {
        text: "ערב",
        value: "evening",
        icon: "moon" as keyof typeof Ionicons.glyphMap,
        color: "#9575CD",
      },
      {
        text: "אין עדיפות",
        value: "any",
        icon: "swap-vertical" as keyof typeof Ionicons.glyphMap,
        color: "#8D6E63",
      },
    ],
    next: "motivation",
  },
  {
    id: "motivation",
    text: "מה הכי מדרבן אותך להתמיד באימונים?\n(ניתן לבחור יותר מתשובה אחת)",
    icon: "star" as keyof typeof Ionicons.glyphMap,
    multiSelect: true,
    options: [
      {
        text: "השגת מטרות אישיות",
        value: "goals",
        icon: "trophy" as keyof typeof Ionicons.glyphMap,
        color: "#FFD700",
      },
      {
        text: "תחרות / הישגים",
        value: "competition",
        icon: "medal" as keyof typeof Ionicons.glyphMap,
        color: "#00CFFF",
      },
      {
        text: "חברה / אימון עם אחרים",
        value: "social",
        icon: "people" as keyof typeof Ionicons.glyphMap,
        color: "#FD79A8",
      },
      {
        text: "בריאות ואנרגיה",
        value: "health",
        icon: "fitness" as keyof typeof Ionicons.glyphMap,
        color: "#55EFC4",
      },
    ],
    next: null,
  },
];

// פונקציית יצירת תוכנית מותאמת אישית
const generateProfessionalPlan = (answers: Record<string, any>): Plan => {
  console.log("🎯 יוצר תוכנית מותאמת אישית על בסיס תשובות השאלון...");

  // המרת התשובות לפורמט הנדרש
  const quizAnswers: QuizAnswers = {
    goal: answers.goal || "hypertrophy",
    whereToTrain: answers.whereToTrain || ["no_equipment"],
    gymMachines: answers.gymMachines || [],
    homeEquipment: answers.homeEquipment || [],
    experience: answers.experience || "beginner",
    days: answers.days || 3,
    injuries: answers.injuries || ["none"],
    injuryDetails: answers.injuryDetails || "",
    trainingType: answers.trainingType || ["weights"],
    preferredTime: answers.preferredTime || "any",
    motivation: answers.motivation || ["health"],
  };

  // יצירת התוכנית המותאמת
  const personalizedPlan = generatePersonalizedPlan(quizAnswers);

  console.log("✅ תוכנית מותאמת אישית נוצרה בהצלחה!");
  return personalizedPlan;
};

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

const QuizScreen = ({ navigation, route }: Props) => {
  const { signupData, resumeFrom, existingAnswers } = route.params;
  const register = useUserStore((state: UserState) => state.register);

  const [answers, setAnswers] = useState<Record<string, any>>(
    existingAnswers || {}
  );
  const [currentQuestionId, setCurrentQuestionId] = useState(
    resumeFrom || QUIZ_QUESTIONS[0].id
  );
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [multiSelections, setMultiSelections] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionSlide = useRef(new Animated.Value(50)).current;
  const optionsSlide = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // מפיגציות ממואוירצות
  const getCurrentQuestion = useCallback(
    () => QUIZ_QUESTIONS.find((q) => q.id === currentQuestionId),
    [currentQuestionId]
  );

  const getQuestionIndex = useCallback(
    (id: string) => QUIZ_QUESTIONS.findIndex((q) => q.id === id),
    []
  );

  const progressPercentage = useMemo(
    () => (getQuestionIndex(currentQuestionId) + 1) / QUIZ_QUESTIONS.length,
    [currentQuestionId, getQuestionIndex]
  );

  useEffect(() => {
    startQuestionAnimation();
    setSelectedOption(null);
    setInputValue("");
    setMultiSelections([]);
  }, [currentQuestionId]);

  const startQuestionAnimation = useCallback(() => {
    questionSlide.setValue(50);
    optionsSlide.setValue(100);

    Animated.sequence([
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
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(questionSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(optionsSlide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית פולס רק בתחילת השאלה
    const pulseAnimation = Animated.loop(
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
    );
    pulseAnimation.start();

    // ניקוי אנימציה כשעוברים לשאלה הבאה
    return () => pulseAnimation.stop();
  }, [
    fadeAnim,
    slideAnim,
    progressAnim,
    questionSlide,
    optionsSlide,
    pulseAnim,
    progressPercentage,
  ]);

  // בחירה באופציה עם רטט
  const handleSelectOption = useCallback(
    (optionValue: any) => {
      // רטט קל בבחירה
      Haptics.selectionAsync();

      const q = getCurrentQuestion();
      if (q?.multiSelect) {
        setMultiSelections((selections) =>
          selections.includes(optionValue)
            ? selections.filter((v) => v !== optionValue)
            : [...selections, optionValue]
        );
      } else {
        setSelectedOption(optionValue);
      }
    },
    [getCurrentQuestion]
  );

  // מעבר לשאלה הבאה עם ולידציה טובה יותר
  const handleNext = useCallback(async () => {
    const q = getCurrentQuestion();
    let valueToSave = q?.multiSelect ? multiSelections : selectedOption;

    // ולידציה משופרת
    if (q?.input) {
      valueToSave = inputValue.trim();
      if (!valueToSave) {
        Alert.alert("שגיאה", "אנא מלא את הפרטים");
        return;
      }
    } else if (q?.multiSelect) {
      // בשאלות מולטי-סלקט, רק שאלות מסוימות חייבות תשובה
      const requiredMultiSelectQuestions = [
        "whereToTrain",
        "injuries",
        "trainingType",
        "motivation",
      ];
      if (
        requiredMultiSelectQuestions.includes(q.id) &&
        !multiSelections.length
      ) {
        Alert.alert("שגיאה", "אנא בחר לפחות תשובה אחת");
        return;
      }
    } else if (!q?.multiSelect && selectedOption == null) {
      Alert.alert("שגיאה", "אנא בחר תשובה");
      return;
    }

    // רטט הצלחה
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newAnswers = { ...answers, [q!.id]: valueToSave };
    setAnswers(newAnswers);

    // לוגיקת ניווט משופרת
    let next = typeof q!.next === "function" ? q!.next(newAnswers) : q!.next;

    // טיפול בזרימה מורכבת של שאלות
    if (q!.id === "whereToTrain") {
      const selectedTraining = valueToSave as string[];
      if (
        selectedTraining?.includes("gym") &&
        selectedTraining?.includes("home_equipment")
      ) {
        setCurrentQuestionId("gymMachines");
        return;
      } else if (selectedTraining?.includes("gym")) {
        setCurrentQuestionId("gymMachines");
        return;
      } else if (selectedTraining?.includes("home_equipment")) {
        setCurrentQuestionId("homeEquipment");
        return;
      }
    }

    if (
      q!.id === "gymMachines" &&
      newAnswers.whereToTrain?.includes("home_equipment")
    ) {
      setCurrentQuestionId("homeEquipment");
      return;
    }

    // סיום השאלון
    if (!next) {
      setIsRegistering(true);

      try {
        const registerResult = await register(signupData);

        if (registerResult.success) {
          // רטט הצלחה חזק
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          const generatedPlan = generateProfessionalPlan(newAnswers);
          const currentUserId = useUserStore.getState().user?.id;

          if (currentUserId) {
            await savePlan(currentUserId, generatedPlan);
          }

          // הצגת הודעת הצלחה יפה
          setTimeout(() => {
            Alert.alert(
              "🎉 ברוך הבא ל-Gymovo!",
              "התוכנית האישית שלך נוצרה בהצלחה והוספה לחשבון שלך.",
              [{ text: "בואו נתחיל!", style: "default" }]
            );
          }, 1500);
        } else {
          setIsRegistering(false);
          Alert.alert(
            "שגיאת הרשמה",
            registerResult.error || "אירעה שגיאה במהלך ההרשמה. אנא נסה שוב.",
            [{ text: "חזור לתיקון", onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        setIsRegistering(false);
        Alert.alert(
          "שגיאה",
          "אירעה שגיאה בלתי צפויה. אנא בדוק את החיבור לאינטרנט ונסה שוב."
        );
      }
      return;
    }

    setCurrentQuestionId(next);
    setSelectedOption(null);
    setMultiSelections([]);
    setInputValue("");
  }, [
    getCurrentQuestion,
    multiSelections,
    selectedOption,
    inputValue,
    answers,
    register,
    signupData,
    navigation,
  ]);

  // אנימציית התקדמות
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // מסך טעינה משופר
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
              הבינה המלאכותית מנתחת את התשובות שלך ובונה תוכנית מותאמת אישית...
            </Text>
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
            <View style={styles.loadingSteps}>
              <Text style={styles.loadingStep}>✓ ניתוח פרופיל אישי</Text>
              <Text style={styles.loadingStep}>✓ התאמת תרגילים לרמה שלך</Text>
              <Text style={styles.loadingStep}>✓ חישוב עומסי אימון</Text>
              <Text style={styles.loadingStep}>⏳ יצירת תוכנית מותאמת</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  const q = getCurrentQuestion();
  if (!q) return null;

  const isLastQuestion =
    getQuestionIndex(currentQuestionId) + 1 === QUIZ_QUESTIONS.length ||
    !q.next;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ImageBackground
        source={require("../../../assets/images/backgrounds/welcome-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* מחוון התקדמות משופר */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressText}>
            שאלה {getQuestionIndex(currentQuestionId) + 1} מתוך{" "}
            {QUIZ_QUESTIONS.length}
          </Text>
          <Text style={styles.progressSubtext}>
            {Math.round(progressPercentage * 100)}% הושלם
          </Text>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
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
              <Ionicons name={q.icon} size={50} color={colors.primary} />
            </Animated.View>
            <Animated.View
              style={[
                styles.questionContainer,
                { transform: [{ translateY: questionSlide }] },
              ]}
            >
              <Text style={styles.questionText}>{q.text}</Text>
              {q.multiSelect && (
                <Text style={styles.multiSelectHint}>
                  💡 ניתן לבחור יותר מתשובה אחת
                </Text>
              )}
            </Animated.View>
          </Animated.View>

          <ScrollView
            style={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {!q.input ? (
              q.options?.map((option, index) => (
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
                      (q.multiSelect
                        ? multiSelections.includes(option.value)
                        : selectedOption === option.value) &&
                        styles.optionSelected,
                    ]}
                    onPress={() => handleSelectOption(option.value)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionContent}>
                      {/* תמונה לצד טקסט */}
                      {DEMO_IMAGES[
                        option.value as keyof typeof DEMO_IMAGES
                      ] && (
                        <Image
                          source={{
                            uri: DEMO_IMAGES[
                              option.value as keyof typeof DEMO_IMAGES
                            ],
                          }}
                          style={styles.optionImg}
                          resizeMode="contain"
                        />
                      )}
                      {"icon" in option && option.icon && (
                        <View
                          style={[
                            styles.optionIcon,
                            "color" in option &&
                              option.color && {
                                backgroundColor: option.color + "20",
                              },
                          ]}
                        >
                          <Ionicons
                            name={option.icon}
                            size={28}
                            color={
                              ("color" in option && option.color) || "#fff"
                            }
                          />
                        </View>
                      )}
                      <Text style={styles.optionText}>{option.text}</Text>
                      <View style={styles.optionArrow}>
                        <Ionicons
                          name={
                            q.multiSelect
                              ? multiSelections.includes(option.value)
                                ? "checkbox"
                                : "square-outline"
                              : "chevron-forward"
                          }
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>הקלד כאן:</Text>
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="פירוט נוסף..."
                  placeholderTextColor="#aaa"
                  textAlign="right"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.nextButton, isLastQuestion && styles.finishButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  isLastQuestion && styles.finishButtonText,
                ]}
              >
                {isLastQuestion ? "🎯 בנה את התוכנית שלי!" : "המשך →"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

// --- סגנונות משופרים ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },

  // Progress
  progressContainer: {
    position: "absolute",
    top: 60,
    left: 32,
    right: 32,
    zIndex: 1,
    alignItems: "center",
  },
  progressBackground: {
    height: 8, // גדול יותר קצת
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  progressText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "700",
  },
  progressSubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },

  // Content
  content: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: { alignItems: "center", marginBottom: 40 },
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
  questionContainer: { alignItems: "center" },
  questionText: {
    fontSize: 26, // קצת יותר קטן
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    lineHeight: 34,
    textShadowColor: "rgba(0, 255, 136, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  multiSelectHint: {
    color: "#fff",
    fontSize: 14,
    marginTop: 12,
    opacity: 0.7,
    textAlign: "center",
  },

  // Options
  optionsContainer: { flex: 1 },
  optionWrapper: { marginBottom: 14 }, // קצת פחות רווח
  optionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
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
    backgroundColor: "rgba(0, 255, 136, 0.12)",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    transform: [{ scale: 1.02 }],
  },
  optionContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 18, // קצת פחות padding
  },
  optionImg: {
    width: 36,
    height: 36,
    marginLeft: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  optionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  optionText: {
    flex: 1,
    fontSize: 17, // קצת יותר קטן
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "right",
    marginRight: 16,
    lineHeight: 24,
  },
  optionArrow: { opacity: 0.8 },

  // Input
  inputContainer: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    opacity: 0.9,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary + "40",
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },

  // Buttons
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 32,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  finishButton: {
    backgroundColor: "#FFD700", // זהב לכפתור סיום
    shadowColor: "#FFD700",
  },
  nextButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  finishButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "800",
  },

  // Loading
  loadingContainer: { flex: 1, backgroundColor: "#000000" },
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
  },
  loadingSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  loadingSteps: {
    marginTop: 40,
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  loadingStep: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    textAlign: "left",
    width: "100%",
  },
});

export default QuizScreen;
