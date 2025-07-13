// src/components/GuestUserBanner.tsx - באנר משופר למשתמשי אורח

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useGuestUser } from "../stores/userStore";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GuestUserBannerProps {
  variant?: "minimal" | "full" | "warning";
  onDismiss?: () => void;
  testID?: string;
}

// קבועים לניהול אנימציות ותזמונים
const ANIMATION_CONFIG = {
  ENTRY_DURATION: 300,
  EXIT_DURATION: 200,
  SPRING_SPEED: 12,
  SPRING_BOUNCE: 8,
} as const;

// קבועים לימי התפוגה
const EXPIRY_WARNINGS = {
  CRITICAL: 3,
  WARNING: 7,
  NORMAL: 14,
} as const;

export const GuestUserBanner: React.FC<GuestUserBannerProps> = ({
  variant = "minimal",
  onDismiss,
  testID = "guest-user-banner",
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { isGuest, daysUntilExpiry } = useGuestUser();
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  // בחירה אוטומטית של וריאנט על בסיס ימים לתפוגה
  const effectiveVariant = useMemo(() => {
    if (!daysUntilExpiry) return variant;

    if (daysUntilExpiry <= EXPIRY_WARNINGS.CRITICAL) return "warning";
    if (daysUntilExpiry <= EXPIRY_WARNINGS.WARNING && variant === "minimal")
      return "full";

    return variant;
  }, [variant, daysUntilExpiry]);

  // אם לא אורח או לא גלוי, אל תציג
  if (!isGuest || !isVisible) return null;

  useEffect(() => {
    // אנימציית כניסה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.ENTRY_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: ANIMATION_CONFIG.SPRING_SPEED,
        bounciness: ANIMATION_CONFIG.SPRING_BOUNCE,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleDismiss = useCallback(() => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_CONFIG.EXIT_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: ANIMATION_CONFIG.EXIT_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  }, [fadeAnim, slideAnim, onDismiss]);

  const handleRegister = useCallback(() => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    navigation.navigate("Register");
  }, [navigation]);

  // יצירת תוכן דינמי על בסיס ימים לתפוגה
  const getDynamicContent = () => {
    if (!daysUntilExpiry)
      return { title: "משתמש אורח", subtitle: "הנתונים שלך זמניים" };

    if (daysUntilExpiry <= EXPIRY_WARNINGS.CRITICAL) {
      return {
        title: `נותרו ${daysUntilExpiry} ימים בלבד!`,
        subtitle: "הנתונים שלך עומדים להימחק",
      };
    }

    if (daysUntilExpiry <= EXPIRY_WARNINGS.WARNING) {
      return {
        title: `נותרו ${daysUntilExpiry} ימים`,
        subtitle: "הרשם עכשיו כדי לשמור את ההתקדמות",
      };
    }

    return {
      title: "משתמש אורח",
      subtitle: `${daysUntilExpiry} ימים עד למחיקת הנתונים`,
    };
  };

  const renderMinimalBanner = () => {
    const content = getDynamicContent();

    return (
      <Animated.View
        testID={`${testID}-minimal`}
        style={[
          styles.minimalContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.minimalGradient}
        >
          <TouchableOpacity
            style={styles.minimalContent}
            onPress={handleRegister}
            activeOpacity={0.8}
            accessibilityLabel="הרשם כדי לשמור את הנתונים"
            accessibilityRole="button"
          >
            <View style={styles.minimalTextContainer}>
              <Text style={styles.minimalTitle}>{content.title}</Text>
              <Text style={styles.minimalSubtitle}>{content.subtitle}</Text>
            </View>
            <TouchableOpacity
              onPress={handleDismiss}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="סגור הודעה"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderFullBanner = () => {
    const benefits = [
      { icon: "cloud-upload-outline", text: "גיבוי אוטומטי בענן" },
      { icon: "stats-chart-outline", text: "מעקב התקדמות מלא" },
      { icon: "share-social-outline", text: "שיתוף תוכניות אימון" },
      { icon: "medal-outline", text: "הישגים ותגמולים" },
    ];

    return (
      <Animated.View
        testID={`${testID}-full`}
        style={[
          styles.fullContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.cardBackground, colors.cardBorder]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fullGradient}
        >
          <View style={styles.fullContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-add-outline"
                size={32}
                color={colors.primary}
              />
            </View>

            <Text style={styles.fullTitle}>שדרג לחשבון מלא</Text>
            <Text style={styles.fullSubtitle}>
              {daysUntilExpiry
                ? `נותרו ${daysUntilExpiry} ימים בלבד!`
                : "קבל את כל היתרונות של Gymovo"}
            </Text>

            <View style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons
                    name={benefit.icon as any}
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.fullButton}
              onPress={handleRegister}
              activeOpacity={0.8}
              accessibilityLabel="הרשם עכשיו"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fullButtonGradient}
              >
                <Text style={styles.fullButtonText}>הרשם בחינם</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderWarningBanner = () => {
    return (
      <Animated.View
        testID={`${testID}-warning`}
        style={[
          styles.warningContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["#FEF2F2", "#FEE2E2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.warningGradient}
        >
          <View style={styles.warningContent}>
            <View style={styles.warningIconContainer}>
              <Ionicons name="warning-outline" size={24} color={colors.error} />
            </View>

            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>
                {daysUntilExpiry === 1
                  ? "יום אחרון!"
                  : `נותרו ${daysUntilExpiry} ימים בלבד!`}
              </Text>
              <Text style={styles.warningSubtitle}>
                הנתונים שלך יימחקו לצמיתות
              </Text>
            </View>

            <TouchableOpacity
              style={styles.warningButton}
              onPress={handleRegister}
              activeOpacity={0.8}
              accessibilityLabel="הרשם דחוף"
              accessibilityRole="button"
            >
              <Text style={styles.warningButtonText}>הרשם עכשיו</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  // בחירת הבאנר המתאים
  switch (effectiveVariant) {
    case "full":
      return renderFullBanner();
    case "warning":
      return renderWarningBanner();
    default:
      return renderMinimalBanner();
  }
};

const styles = StyleSheet.create({
  // סגנונות לבאנר מינימלי
  minimalContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 16,
    right: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 999,
  },
  minimalGradient: {
    padding: 16,
  },
  minimalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  minimalTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  minimalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  minimalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  closeButton: {
    position: "absolute",
    top: -12,
    right: -12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  // סגנונות לבאנר מלא
  fullContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  fullGradient: {
    padding: 24,
  },
  fullContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  fullTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  fullSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  benefitsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  fullButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  fullButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  fullButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // סגנונות לבאנר אזהרה
  warningContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.error,
  },
  warningGradient: {
    padding: 16,
  },
  warningContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  warningIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginBottom: 2,
  },
  warningSubtitle: {
    fontSize: 14,
    color: colors.errorDark,
  },
  warningButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  warningButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default GuestUserBanner;
