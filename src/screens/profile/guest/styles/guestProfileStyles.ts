// src/screens/profile/guest/styles/guestProfileStyles.ts
// סטיילים משופרים למסך פרופיל אורח

import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../../theme/colors";

const { width } = Dimensions.get("window");

export const guestProfileStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background || "#000000",
  },
  scrollContent: {
    paddingTop: 60, // מקום לבאנר
    paddingBottom: 30,
  },

  // Header styles
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
    backgroundColor: colors.warning || "#F59E0B",
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
    color: colors.text || "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || "#9CA3AF",
  },

  // CTA Card styles
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

  // Features section styles
  featuresSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text || "white",
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: colors.surface || "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border || "#374151",
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
    color: colors.text || "white",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary || "#9CA3AF",
    lineHeight: 20,
  },

  // Footer styles
  footer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted || "#6B7280",
  },

  // Legacy styles (for backward compatibility)
  legacyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background || "#f5f5f5",
  },
});
