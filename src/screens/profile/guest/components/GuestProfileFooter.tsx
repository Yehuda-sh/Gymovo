// src/screens/profile/guest/components/GuestProfileFooter.tsx
// רכיב כותרת תחתונה עם מידע נוסף

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GuestProfileFooterProps {
  onAlternativeSignup?: () => void;
  fadeAnim: Animated.Value;
}

const GuestProfileFooter: React.FC<GuestProfileFooterProps> = ({
  onAlternativeSignup,
  fadeAnim,
}) => {
  return (
    <Animated.View
      style={[
        styles.footer,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.trustBadges}>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={16} color="#10B981" />
          <Text style={styles.badgeText}>מאובטח</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="lock-closed" size={16} color="#10B981" />
          <Text style={styles.badgeText}>פרטי</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="star" size={16} color="#10B981" />
          <Text style={styles.badgeText}>חינם</Text>
        </View>
      </View>

      <Text style={styles.footerText}>הצטרף לאלפי המתאמנים שכבר שדרגו</Text>

      <View style={styles.faqSection}>
        <TouchableOpacity style={styles.faqItem}>
          <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.faqText}>שאלות נפוצות</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <Text style={styles.faqText}>צור קשר</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        * כל הנתונים נשמרים בצורה מאובטחת ופרטית
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  trustBadges: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  faqSection: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  faqText: {
    fontSize: 14,
    color: "#6B7280",
  },
  disclaimer: {
    fontSize: 12,
    color: "#4B5563",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default GuestProfileFooter;
