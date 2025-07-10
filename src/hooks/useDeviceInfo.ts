// src/hooks/useDeviceInfo.ts
// Hook לזיהוי מידע על המכשיר ותאימות מובייל

import { useState, useEffect } from "react";
import { Dimensions, PixelRatio } from "react-native";

interface DeviceInfo {
  width: number;
  height: number;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  pixelDensity: number;
  fontScale: number;
  orientation: "portrait" | "landscape";
}

interface ResponsiveBreakpoints {
  sm: number; // טלפונים קטנים
  md: number; // טלפונים רגילים
  lg: number; // טלפונים גדולים
  xl: number; // טאבלטים
}

const BREAKPOINTS: ResponsiveBreakpoints = {
  sm: 320, // iPhone SE, אנדרואידים קטנים
  md: 375, // iPhone רגיל
  lg: 414, // iPhone Plus
  xl: 768, // טאבלטים
};

/**
 * Hook לקבלת מידע על המכשיר ותאימות responsive
 */
export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const { width, height } = Dimensions.get("window");
    const pixelDensity = PixelRatio.get();
    const fontScale = PixelRatio.getFontScale();

    return {
      width,
      height,
      isSmallDevice: width < BREAKPOINTS.md,
      isMediumDevice: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isLargeDevice: width >= BREAKPOINTS.lg,
      pixelDensity,
      fontScale,
      orientation: width > height ? "landscape" : "portrait",
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      const { width, height } = window;
      const pixelDensity = PixelRatio.get();
      const fontScale = PixelRatio.getFontScale();

      setDeviceInfo({
        width,
        height,
        isSmallDevice: width < BREAKPOINTS.md,
        isMediumDevice: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isLargeDevice: width >= BREAKPOINTS.lg,
        pixelDensity,
        fontScale,
        orientation: width > height ? "landscape" : "portrait",
      });
    });

    return () => subscription?.remove();
  }, []);

  return deviceInfo;
};

/**
 * Hook לקבלת גדלים responsive
 */
export const useResponsiveDimensions = () => {
  const { width, isSmallDevice, isMediumDevice, isLargeDevice } =
    useDeviceInfo();

  return {
    // גדלי קארדים
    cardWidth: isSmallDevice ? width * 0.42 : width * 0.45,
    cardPadding: isSmallDevice ? 12 : 16,
    cardGap: isSmallDevice ? 6 : 8,

    // גדלי פונטים
    titleFontSize: isSmallDevice ? 24 : 26,
    headerFontSize: isSmallDevice ? 28 : 30,
    bodyFontSize: isSmallDevice ? 15 : 17,

    // רווחים
    screenPadding: isSmallDevice ? 16 : 24,
    sectionSpacing: isSmallDevice ? 24 : 32,

    // אייקונים
    iconSize: isSmallDevice ? 20 : 24,
    iconContainerSize: isSmallDevice ? 44 : 48,

    // טאבים
    tabBarHeight: isSmallDevice ? 60 : 70,
    tabIconSize: isSmallDevice ? 22 : 24,

    // משתנים לוגיים
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    width,
  };
};

export { BREAKPOINTS };
