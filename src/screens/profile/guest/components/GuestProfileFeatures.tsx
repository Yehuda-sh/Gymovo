// src/screens/profile/guest/components/GuestProfileFeatures.tsx
// רכיב להצגת היתרונות של יצירת חשבון

import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface GuestProfileFeaturesProps {
  fadeAnim: Animated.Value;
  staggerDelay?: number;
}

const features: Feature[] = [
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
  {
    icon: "people-outline",
    title: "קהילת מתאמנים",
    description: "שתף והשווה עם חברים",
    color: "#EC4899",
  },
  {
    icon: "flash-outline",
    title: "AI מתקדם",
    description: "המלצות אימון חכמות ומותאמות אישית",
    color: "#14B8A6",
  },
];

const FeatureCard: React.FC<{
  feature: Feature;
  index: number;
  fadeAnim: Animated.Value;
  staggerDelay: number;
}> = ({ feature, index, fadeAnim, staggerDelay }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay: index * staggerDelay,
      useNativeDriver: true,
    }).start();
  }, [index, staggerDelay]);

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          opacity: Animated.multiply(fadeAnim, animatedValue),
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={[feature.color + "20", feature.color + "10"]}
        style={styles.featureIcon}
      >
        <Ionicons name={feature.icon as any} size={24} color={feature.color} />
      </LinearGradient>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
      <Ionicons
        name="checkmark-circle"
        size={20}
        color={feature.color}
        style={styles.checkIcon}
      />
    </Animated.View>
  );
};

const GuestProfileFeatures: React.FC<GuestProfileFeaturesProps> = ({
  fadeAnim,
  staggerDelay = 100,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>למה לשדרג?</Text>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          feature={feature}
          index={index}
          fadeAnim={fadeAnim}
          staggerDelay={staggerDelay}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
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
  checkIcon: {
    marginLeft: 8,
  },
});

export default GuestProfileFeatures;
