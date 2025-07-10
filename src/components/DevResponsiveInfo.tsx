// src/components/DevResponsiveInfo.tsx
// רכיב לפיתוח - מידע על responsive ומסך

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDeviceInfo, useResponsiveDimensions } from "../hooks/useDeviceInfo";
import { theme } from "../theme";

/**
 * רכיב פיתוח להצגת מידע על המסך והתאמות responsive
 * יוצג רק במצב פיתוח (__DEV__)
 */
export const DevResponsiveInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const deviceInfo = useDeviceInfo();
  const responsiveDims = useResponsiveDimensions();

  if (!__DEV__) {
    return null;
  }

  return (
    <>
      {/* כפתור הפעלה/כיבוי */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.toggleText}>📐</Text>
      </TouchableOpacity>

      {/* פאנל המידע */}
      {isVisible && (
        <View style={styles.infoPanel}>
          <Text style={styles.title}>📱 מידע על המסך</Text>

          {/* מידע בסיסי */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מידות:</Text>
            <Text style={styles.infoText}>
              רוחב: {deviceInfo.width}px | גובה: {deviceInfo.height}px
            </Text>
            <Text style={styles.infoText}>
              צפיפות: {deviceInfo.pixelDensity.toFixed(1)} | פונט:{" "}
              {deviceInfo.fontScale.toFixed(1)}
            </Text>
            <Text style={styles.infoText}>
              כיוון: {deviceInfo.orientation === "portrait" ? "לאורך" : "לרוחב"}
            </Text>
          </View>

          {/* קטגוריית מכשיר */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>קטגוריה:</Text>
            <Text
              style={[
                styles.categoryText,
                deviceInfo.isSmallDevice && styles.smallDevice,
                deviceInfo.isMediumDevice && styles.mediumDevice,
                deviceInfo.isLargeDevice && styles.largeDevice,
              ]}
            >
              {deviceInfo.isSmallDevice && "📱 מכשיר קטן"}
              {deviceInfo.isMediumDevice && "📱 מכשיר בינוני"}
              {deviceInfo.isLargeDevice && "📱 מכשיר גדול"}
            </Text>
          </View>

          {/* גדלים responsive */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>גדלים responsive:</Text>
            <Text style={styles.infoText}>
              פדינג מסך: {responsiveDims.screenPadding}px
            </Text>
            <Text style={styles.infoText}>
              גובה טאב: {responsiveDims.tabBarHeight}px
            </Text>
            <Text style={styles.infoText}>
              גודל אייקון: {responsiveDims.iconSize}px
            </Text>
            <Text style={styles.infoText}>
              פונט כותרת: {responsiveDims.titleFontSize}px
            </Text>
          </View>

          {/* כפתור סגירה */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}
          >
            <Text style={styles.closeText}>✖️ סגור</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
  },
  toggleText: {
    fontSize: 20,
  },
  infoPanel: {
    position: "absolute",
    top: 150,
    right: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    zIndex: 9998,
    elevation: 9,
    maxHeight: "70%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textAlign: "right",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  smallDevice: {
    backgroundColor: "#FF6B35",
    color: "white",
  },
  mediumDevice: {
    backgroundColor: "#00E676",
    color: "white",
  },
  largeDevice: {
    backgroundColor: "#007AFF",
    color: "white",
  },
  closeButton: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  closeText: {
    color: "white",
    fontWeight: "600",
  },
});

export default DevResponsiveInfo;
