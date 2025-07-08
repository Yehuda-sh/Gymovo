// src/components/common/SplashScreen.tsx - עם Design System החדש
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { Typography } from "../ui";
import { theme } from "../../theme";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
  showLoading?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 3000,
  showLoading = true,
}) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  // אנימציות לנקודות
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // אנימציית רקע
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // אנימציית כניסה מדורגת
    Animated.sequence([
      // לוגו מופיע וגדל
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // טקסט מופיע
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // אנימציית loading מופיעה
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציה מתמשכת לנקודות
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const animationTimer = setTimeout(() => {
      if (showLoading) {
        dotAnimation.start();
      }
    }, 2000);

    // קריאה ל-callback בסיום
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(completeTimer);
      dotAnimation.stop();
    };
  }, [
    duration,
    onComplete,
    showLoading,
    backgroundOpacity,
    loadingOpacity,
    logoOpacity,
    logoScale,
    textOpacity,
    dot1Opacity,
    dot2Opacity,
    dot3Opacity,
  ]);

  return (
    <View style={styles.container}>
      {/* רקע עם גרדיאנט */}
      <Animated.View
        style={[styles.backgroundGradient, { opacity: backgroundOpacity }]}
      >
        {/* רקע כהה עם גרדיאנט קל */}
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </Animated.View>

      {/* לוגו עם אנימציה */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        {/* אם אין תמונת לוגו, נשתמש בטקסט */}
        <View style={styles.logoPlaceholder}>
          <Typography
            variant="h1"
            color={theme.colors.primary}
            style={styles.logoText}
          >
            GYMOVO
          </Typography>
        </View>
        {/* אם יש תמונת לוגו, אפשר להחליף את הView למעלה ב:
        <Image
          source={require("../../../assets/images/branding/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        */}
      </Animated.View>

      {/* טקסט ואנימציית טעינה */}
      <Animated.View style={[styles.bottomSection, { opacity: textOpacity }]}>
        <Typography
          variant="h3"
          color={theme.colors.text}
          align="center"
          style={styles.welcomeText}
        >
          ברוכים הבאים ל-Gymovo
        </Typography>

        <Typography
          variant="body"
          color={theme.colors.textSecondary}
          align="center"
          style={styles.tagline}
        >
          האפליקציה החכמה שלך לאימון מושלם
        </Typography>

        {/* אנימציית טעינה */}
        {showLoading && (
          <Animated.View
            style={[styles.loadingContainer, { opacity: loadingOpacity }]}
          >
            <View style={styles.dotsContainer}>
              <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
              <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
              <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
            </View>
          </Animated.View>
        )}
      </Animated.View>

      {/* גרסה ומידע נוסף */}
      <View style={styles.footer}>
        <Typography
          variant="small"
          color={theme.colors.textSecondary}
          align="center"
        >
          גרסה 1.0.0
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: theme.colors.background,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: theme.colors.surface,
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl * 2,
  },
  logoPlaceholder: {
    width: width * 0.6,
    height: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.lg,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 2,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },
  bottomSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  welcomeText: {
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    marginBottom: theme.spacing.xl * 2,
  },
  loadingContainer: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  footer: {
    position: "absolute",
    bottom: theme.spacing.xl * 2,
  },
});

export default SplashScreen;
