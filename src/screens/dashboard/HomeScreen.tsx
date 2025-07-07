// 🏠 HomeScreen מקצועי ברמה עולמית עם עיצוב ספורטיבי כהה ואנימציות - גרסה מתוקנת
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
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWorkoutHistory } from "../../hooks/useWorkoutHistory";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

// 🎨 ערכת צבעים ספורטיבית כהה (תואמת ל-ActiveWorkout)
const homeColors = {
  background: "#0a0a0a", // שחור עמוק
  cardBg: "#1a1a1a", // אפור כהה לכרטיסים
  accent: "#00ff88", // ירוק זוהר (מאוד בולט)
  secondary: "#ffaa00", // כתום לאקסנטים
  danger: "#ff4444", // אדום להתראות
  text: "#ffffff", // טקסט לבן
  subtext: "#cccccc", // טקסט משני
  border: "#333333", // גבולות
  glassBg: "rgba(26, 26, 26, 0.8)", // רקע זכוכית
};

// 🌟 רכיב באנר אורח מתקדם עם אנימציות - ללא LinearGradient
const AdvancedGuestBanner = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית pulse
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // אנימציית זוהר
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [pulseAnim, glowAnim]);

  return (
    <Animated.View
      style={[
        styles.guestBanner,
        {
          transform: [{ scale: pulseAnim }],
          shadowColor: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [homeColors.accent, "#ffffff"],
          }),
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.8],
          }),
        },
      ]}
    >
      {/* רקע גרדיאנט מותאם עם View */}
      <View style={styles.guestBannerGradient}>
        <View style={styles.guestBannerContent}>
          <Ionicons name="diamond-outline" size={24} color="#000" />
          <Text style={styles.guestBannerTitle}>שדרג לחשבון מלא</Text>
          <Text style={styles.guestBannerSubtitle}>
            שמור התקדמות, סטטיסטיקות ועוד
          </Text>

          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Signup");
            }}
          >
            <Text style={styles.upgradeButtonText}>הירשם חינם</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// 📊 רכיב סטטיסטיקות מהירות
const QuickStatsCard = () => {
  const { data: workoutHistory } = useWorkoutHistory();
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const stats = useMemo(() => {
    if (!workoutHistory) return { total: 0, thisWeek: 0, streak: 0 };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeekWorkouts = workoutHistory.filter(
      (w) => new Date(w.date) > weekAgo
    ).length;

    // חישוב רצף פשוט
    let streak = 0;
    const sortedWorkouts = workoutHistory
      .map((w) => new Date(w.date).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedWorkouts.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (sortedWorkouts[0] === today || sortedWorkouts[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < sortedWorkouts.length; i++) {
          const current = new Date(sortedWorkouts[i]);
          const previous = new Date(sortedWorkouts[i - 1]);
          const dayDiff =
            Math.abs(current.getTime() - previous.getTime()) /
            (1000 * 60 * 60 * 24);

          if (dayDiff <= 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      total: workoutHistory.length,
      thisWeek: thisWeekWorkouts,
      streak,
    };
  }, [workoutHistory]);

  useEffect(() => {
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
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.quickStatsCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.statsTitle}>הסטטיסטיקות שלך</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons
            name="barbell-outline"
            size={24}
            color={homeColors.accent}
          />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>סהכ אימונים</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color={homeColors.secondary}
          />
          <Text style={styles.statNumber}>{stats.thisWeek}</Text>
          <Text style={styles.statLabel}>השבוע</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Ionicons name="flame-outline" size={24} color={homeColors.danger} />
          <Text style={styles.statNumber}>{stats.streak}</Text>
          <Text style={styles.statLabel}>רצף ימים</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// 🎯 רכיב פעולות מהירות עם אנימציות
const QuickActions = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const animValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Stagger animation
    const animations = animValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, [animValues]);

  const actions = [
    {
      icon: "play-circle",
      title: "התחל אימון",
      subtitle: "אימון חדש עכשיו",
      color: homeColors.accent,
      onPress: () => navigation.navigate("SelectPlan"),
    },
    {
      icon: "library-outline",
      title: "התוכניות שלי",
      subtitle: "נהל תוכניות אימון",
      color: homeColors.secondary,
      onPress: () => navigation.navigate("Main", { screen: "Plans" }),
    },
    {
      icon: "stats-chart",
      title: "היסטוריה",
      subtitle: "צפה בהתקדמות",
      color: homeColors.danger,
      onPress: () => navigation.navigate("Main", { screen: "Workouts" }),
    },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>פעולות מהירות</Text>

      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <Animated.View
            key={action.title}
            style={[
              styles.actionCard,
              {
                opacity: animValues[index],
                transform: [
                  {
                    translateY: animValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: animValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                action.onPress();
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: `${action.color}20` },
                ]}
              >
                <Ionicons
                  name={action.icon as any}
                  size={28}
                  color={action.color}
                />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// 💡 רכיב טיפ יומי אינטראקטיבי
const DailyTip = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const tips = [
    "💪 עקביות היא המפתח להצלחה - אימון קצר עדיף על אי-אימון",
    "🥤 שתיית מים לפני, במהלך ואחרי האימון חיונית לביצועים",
    "😴 שינה איכותית משפרת התאוששות ובניית שריר",
    "🎯 תעדו את ההתקדמות - כל סט וחזרה חשובים",
    "🏃‍♂️ התחממות נכונה מונעת פציעות ומשפרת ביצועים",
  ];

  const cycleTip = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    Haptics.selectionAsync();
  }, [fadeAnim, tips.length]);

  return (
    <TouchableOpacity
      style={styles.dailyTipCard}
      onPress={cycleTip}
      activeOpacity={0.8}
    >
      <View style={styles.tipHeader}>
        <Ionicons name="bulb-outline" size={20} color={homeColors.secondary} />
        <Text style={styles.tipTitle}>טיפ יומי</Text>
        <TouchableOpacity onPress={cycleTip}>
          <Ionicons
            name="refresh-outline"
            size={16}
            color={homeColors.subtext}
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// 🏠 המסך הראשי המשופר
const HomeScreen = () => {
  const user = useUserStore((state: UserState) => state.user);
  const status = useUserStore((state: UserState) => state.status);

  // אנימציות כניסה
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(-50)).current;

  // ברכה דינמית לפי שעה
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    const name = user?.name || "אלוף";

    if (hour < 6) return `לילה טוב, ${name}! 🌙`;
    if (hour < 12) return `בוקר טוב, ${name}! ☀️`;
    if (hour < 17) return `צהריים טובים, ${name}! ⚡`;
    if (hour < 21) return `ערב טוב, ${name}! 🌅`;
    return `לילה טוב, ${name}! 🌙`;
  }, [user?.name]);

  const getMotivation = useCallback(() => {
    const motivations = [
      "בואו נהפוך את היום לאימון מדהים!",
      "כל יום הוא הזדמנות להיות חזק יותר!",
      "ההצלחה מתחילה בצעד הראשון!",
      "הגוף שלך יכול - התמיד רק הנפש לוותר!",
      "כל אימון מקרב אותך למטרה!",
    ];

    return motivations[Math.floor(Math.random() * motivations.length)];
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(titleSlideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, titleSlideAnim]);

  return (
    <View style={styles.container}>
      {/* רקע גרדיאנט דינמי מותאם */}
      <View style={styles.backgroundGradient} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* באנר אורח (אם רלוונטי) */}
        {status === "guest" && <AdvancedGuestBanner />}

        {/* Header מרכזי עם ברכה */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: titleSlideAnim }],
            },
          ]}
        >
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.motivationText}>{getMotivation()}</Text>
        </Animated.View>

        {/* סטטיסטיקות מהירות */}
        <QuickStatsCard />

        {/* פעולות מהירות */}
        <QuickActions />

        {/* טיפ יומי */}
        <DailyTip />

        {/* רווח תחתון */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

// 🎨 סטיילים מתקדמים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: homeColors.background,
    // ניתן להוסיף עוד שכבות צבע כאן במקום גרדיאנט
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60, // בגלל ה-SafeArea
  },

  // Guest Banner
  guestBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowRadius: 20,
    elevation: 10,
  },
  guestBannerGradient: {
    backgroundColor: homeColors.accent, // רקע אחיד במקום גרדיאנט
    padding: 20,
  },
  guestBannerContent: {
    alignItems: "center",
  },
  guestBannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    textAlign: "center",
  },
  guestBannerSubtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.7)",
    marginTop: 4,
    textAlign: "center",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },

  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: homeColors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: homeColors.subtext,
    textAlign: "center",
    lineHeight: 24,
  },

  // Quick Stats
  quickStatsCard: {
    backgroundColor: homeColors.cardBg,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: homeColors.border,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: homeColors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: homeColors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: homeColors.subtext,
    marginTop: 4,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: homeColors.border,
  },

  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: homeColors.text,
    marginBottom: 16,
    textAlign: "right",
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: homeColors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: homeColors.border,
    overflow: "hidden",
  },
  actionButton: {
    padding: 20,
    alignItems: "center",
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: homeColors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: homeColors.subtext,
    textAlign: "center",
  },

  // Daily Tip
  dailyTipCard: {
    backgroundColor: homeColors.cardBg,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: homeColors.border,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: homeColors.text,
    flex: 1,
    textAlign: "center",
  },
  tipText: {
    fontSize: 14,
    color: homeColors.subtext,
    lineHeight: 20,
    textAlign: "center",
  },

  // Spacer
  bottomSpacer: {
    height: 100, // רווח תחתון לטאבים
  },
});

export default HomeScreen;
