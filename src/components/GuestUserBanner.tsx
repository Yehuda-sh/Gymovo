// src/components/GuestUserBanner.tsx - באנר למשתמשי אורח

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useGuestUser } from "../stores/userStore";

const { width } = Dimensions.get("window");

interface GuestUserBannerProps {
  variant?: "minimal" | "full" | "warning";
  onDismiss?: () => void;
}

export const GuestUserBanner: React.FC<GuestUserBannerProps> = ({
  variant = "minimal",
  onDismiss,
}) => {
  const navigation = useNavigation();
  const { isGuest, daysUntilExpiry } = useGuestUser();
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-100);

  // אם לא אורח, אל תציג
  if (!isGuest || !isVisible) return null;

  useEffect(() => {
    // אנימציית כניסה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  const handleSignup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ConvertGuest" as never); // או כל מסך הרשמה שיש לך
  };

  // קבע את הצבע לפי כמות הימים שנותרו
  const getColors = () => {
    if (daysUntilExpiry <= 3) {
      return ["#EF4444", "#DC2626"]; // אדום
    } else if (daysUntilExpiry <= 7) {
      return ["#F59E0B", "#D97706"]; // כתום
    }
    return ["#3B82F6", "#2563EB"]; // כחול
  };

  // רכיב באנר מינימלי
  const MinimalBanner = () => (
    <Animated.View
      style={[
        styles.minimalContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.minimalGradient}
      >
        <View style={styles.minimalContent}>
          <Ionicons name="time-outline" size={20} color="white" />
          <Text style={styles.minimalText}>
            נותרו {daysUntilExpiry} ימים לשמירת הנתונים
          </Text>
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.minimalButton}
            activeOpacity={0.8}
          >
            <Text style={styles.minimalButtonText}>הירשם</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // רכיב באנר מלא
  const FullBanner = () => (
    <Animated.View
      style={[
        styles.fullContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={["#1F2937", "#111827"]}
        style={styles.fullGradient}
      >
        {/* כפתור סגירה */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDismiss}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* תוכן */}
        <View style={styles.fullContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={32} color="#3B82F6" />
          </View>

          <Text style={styles.fullTitle}>אתה משתמש אורח</Text>
          <Text style={styles.fullSubtitle}>
            נותרו {daysUntilExpiry} ימים עד שהנתונים שלך יימחקו
          </Text>

          <View style={styles.benefitsContainer}>
            <BenefitItem
              icon="cloud-upload-outline"
              text="גיבוי אוטומטי לענן"
            />
            <BenefitItem
              icon="phone-portrait-outline"
              text="סנכרון בין מכשירים"
            />
            <BenefitItem icon="stats-chart-outline" text="סטטיסטיקות מתקדמות" />
          </View>

          <TouchableOpacity
            style={styles.fullButton}
            onPress={handleSignup}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={getColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fullButtonGradient}
            >
              <Text style={styles.fullButtonText}>הירשם עכשיו בחינם</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // רכיב אזהרה (לימים אחרונים)
  const WarningBanner = () => (
    <Animated.View
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
        style={styles.warningGradient}
      >
        <View style={styles.warningContent}>
          <View style={styles.warningIconContainer}>
            <Ionicons name="warning" size={24} color="#DC2626" />
          </View>

          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>הנתונים שלך בסכנה!</Text>
            <Text style={styles.warningSubtitle}>
              נותרו רק {daysUntilExpiry} ימים עד למחיקת כל האימונים
            </Text>
          </View>

          <TouchableOpacity
            style={styles.warningButton}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.warningButtonText}>שמור עכשיו</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // בחר איזה באנר להציג
  if (daysUntilExpiry <= 3) {
    return <WarningBanner />;
  }

  switch (variant) {
    case "full":
      return <FullBanner />;
    case "warning":
      return <WarningBanner />;
    default:
      return <MinimalBanner />;
  }
};

// רכיב עזר להצגת יתרונות
const BenefitItem: React.FC<{ icon: string; text: string }> = ({
  icon,
  text,
}) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon as any} size={16} color="#3B82F6" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  // סגנונות לבאנר מינימלי
  minimalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  minimalGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  minimalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  minimalText: {
    flex: 1,
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  minimalButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  minimalButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // סגנונות לבאנר מלא
  fullContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  fullGradient: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(107, 114, 128, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  fullContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  fullTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  fullSubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
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
    color: "#D1D5DB",
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
    borderColor: "#FCA5A5",
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
    color: "#991B1B",
    marginBottom: 2,
  },
  warningSubtitle: {
    fontSize: 14,
    color: "#DC2626",
  },
  warningButton: {
    backgroundColor: "#DC2626",
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
