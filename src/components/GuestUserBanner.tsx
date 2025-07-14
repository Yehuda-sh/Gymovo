// src/components/GuestUserBanner.tsx - באנר משופר למשתמשי אורח

import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useUserStore, useIsGuest } from "../stores/userStore";
import { colors } from "../theme/colors";

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
  const user = useUserStore((state) => state.user);
  const isGuest = useIsGuest();
  const getGuestExpiryDate = useUserStore((state) => state.getGuestExpiryDate);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  // חישוב ימים לתפוגה
  const daysUntilExpiry = useMemo(() => {
    const expiryDate = getGuestExpiryDate();
    if (!expiryDate) return 0;

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [getGuestExpiryDate]);

  // בחירה אוטומטית של וריאנט על בסיס ימים לתפוגה
  const effectiveVariant = useMemo(() => {
    if (!daysUntilExpiry) return variant;

    if (daysUntilExpiry <= EXPIRY_WARNINGS.CRITICAL) return "warning";
    if (daysUntilExpiry <= EXPIRY_WARNINGS.WARNING && variant === "minimal")
      return "full";

    return variant;
  }, [variant, daysUntilExpiry]);

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
      onDismiss?.();
    });
  }, [fadeAnim, slideAnim, onDismiss]);

  const handleSignUpPress = useCallback(() => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    navigation.navigate("ConvertGuest");
  }, [navigation]);

  // אם המשתמש לא אורח, לא להציג את הבאנר
  if (!isGuest) {
    return null;
  }

  // תוכן הבאנר לפי הוריאנט
  const renderContent = () => {
    switch (effectiveVariant) {
      case "minimal":
        return (
          <TouchableOpacity
            style={styles.minimalContainer}
            onPress={handleSignUpPress}
            activeOpacity={0.9}
            testID={`${testID}-minimal`}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.minimalGradient}
            >
              <View style={styles.minimalContent}>
                <View style={styles.minimalTextContainer}>
                  <Text style={styles.minimalTitle}>משתמש אורח</Text>
                  <Text style={styles.minimalSubtitle}>
                    {daysUntilExpiry
                      ? `${daysUntilExpiry} ימים נותרו`
                      : "הרשם לשמירת הנתונים"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.minimalButton}
                  onPress={handleSignUpPress}
                >
                  <Text style={styles.minimalButtonText}>הרשמה</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
              {onDismiss && (
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={handleDismiss}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </TouchableOpacity>
        );

      case "full":
        return (
          <View style={styles.fullContainer} testID={`${testID}-full`}>
            <LinearGradient
              colors={["#F3F4F6", "#E5E7EB"]}
              style={styles.fullGradient}
            >
              <View style={styles.fullContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="person-outline"
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.fullTitle}>אתה משתמש אורח</Text>
                <Text style={styles.fullSubtitle}>
                  {daysUntilExpiry
                    ? `נותרו ${daysUntilExpiry} ימים עד שהנתונים יימחקו`
                    : "הרשם עכשיו כדי לשמור את כל ההתקדמות שלך"}
                </Text>

                <View style={styles.benefitsContainer}>
                  <View style={styles.benefitItem}>
                    <Ionicons
                      name="cloud-upload"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.benefitText}>גיבוי אוטומטי בענן</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="sync" size={20} color={colors.primary} />
                    <Text style={styles.benefitText}>סנכרון בין מכשירים</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons
                      name="trending-up"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.benefitText}>מעקב התקדמות מתקדם</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.fullButton}
                  onPress={handleSignUpPress}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={styles.fullButtonGradient}
                  >
                    <Text style={styles.fullButtonText}>הרשם עכשיו</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        );

      case "warning":
        return (
          <View style={styles.warningContainer} testID={`${testID}-warning`}>
            <LinearGradient
              colors={["#FEF2F2", "#FEE2E2"]}
              style={styles.warningGradient}
            >
              <View style={styles.warningContent}>
                <View style={styles.warningIconContainer}>
                  <Ionicons name="warning" size={24} color={colors.error} />
                </View>
                <View style={styles.warningTextContainer}>
                  <Text style={styles.warningTitle}>
                    נותרו {daysUntilExpiry} ימים בלבד!
                  </Text>
                  <Text style={styles.warningSubtitle}>
                    הנתונים שלך יימחקו לצמיתות
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.warningButton}
                  onPress={handleSignUpPress}
                >
                  <Text style={styles.warningButtonText}>הרשם עכשיו</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // סגנונות לבאנר מינימלי
  minimalContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  minimalGradient: {
    padding: 16,
    position: "relative",
  },
  minimalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  minimalTextContainer: {
    flex: 1,
  },
  minimalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 2,
  },
  minimalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  minimalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  minimalButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  dismissButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
  },

  // סגנונות לבאנר מלא
  fullContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
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
    color: colors.text,
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
    color: colors.text,
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
