// src/screens/profile/GuestProfileScreen.tsx
// מסך פרופיל משודרג למשתמשים אורחים

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { useGuestUser } from "../../stores/userStore";
import { GuestUserBanner } from "../../components/GuestUserBanner";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GuestProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { daysUntilExpiry } = useGuestUser();

  const handleConvertAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ConvertGuest");
  };

  const features = [
    {
      icon: "cloud-upload-outline",
      title: "גיבוי אוטומטי",
      description: "כל האימונים שלך נשמרים בענן",
      color: "#3B82F6",
    },
    {
      icon: "stats-chart-outline",
      title: "סטטיסטיקות מתקדמות",
      description: "מעקב מלא אחר ההתקדמות שלך",
      color: "#10B981",
    },
    {
      icon: "phone-portrait-outline",
      title: "סנכרון בין מכשירים",
      description: "גישה מכל מקום ובכל זמן",
      color: "#8B5CF6",
    },
    {
      icon: "trophy-outline",
      title: "הישגים ואתגרים",
      description: "מוטיבציה להמשיך ולהתקדם",
      color: "#F59E0B",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={["#000000", "#1a1a1a", "#000000"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* באנר התראה */}
      <GuestUserBanner variant="minimal" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* כותרת ראשית */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#374151", "#1F2937"]}
              style={styles.avatarGradient}
            >
              <Ionicons name="person-outline" size={40} color="#9CA3AF" />
            </LinearGradient>
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>אורח</Text>
            </View>
          </View>

          <Text style={styles.title}>משתמש אורח</Text>
          <Text style={styles.subtitle}>
            נותרו {daysUntilExpiry} ימים לשמירת הנתונים
          </Text>
        </View>

        {/* כרטיס CTA ראשי */}
        <TouchableOpacity
          style={styles.ctaCard}
          onPress={handleConvertAccount}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>🚀 שדרג את החשבון שלך</Text>
              <Text style={styles.ctaSubtitle}>
                צור חשבון בחינם ושמור את כל ההתקדמות שלך
              </Text>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>צור חשבון עכשיו</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* רשימת יתרונות */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>למה כדאי להירשם?</Text>

          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: `${feature.color}15` },
                ]}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color={feature.color}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* הערת תחתית */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ההרשמה חינמית לחלוטין • ללא כרטיס אשראי
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingTop: 60, // מקום לבאנר
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  guestBadge: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  ctaCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  ctaGradient: {
    padding: 24,
  },
  ctaContent: {
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  featuresSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default GuestProfileScreen;
