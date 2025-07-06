// src/screens/common/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית כניסה מדורגת ויפה
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
        Animated.timing(loadingOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const timer = setTimeout(() => {
      dotAnimation.start();
    }, 2000);

    return () => {
      clearTimeout(timer);
      dotAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* רקע גרדיאנט (אם יש לך) */}
      <View style={styles.backgroundGradient} />

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
        <Image
          source={require("../../../assets/images/branding/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* טקסט ואנימציית טעינה */}
      <Animated.View style={[styles.bottomSection, { opacity: textOpacity }]}>
        <Text style={styles.welcomeText}>ברוכים הבאים ל-Gymovo</Text>

        {/* אנימציית טעינה */}
        <Animated.View
          style={[styles.loadingContainer, { opacity: loadingOpacity }]}
        >
          {/* אם יש לך GIF, השתמש בו */}
          <Image
            source={require("../../../assets/images/animations/loading-animation.mp4")}
            style={styles.loadingAnimation}
            resizeMode="contain"
          />
          {/* או נקודות פשוטות */}
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: loadingOpacity }]} />
            <Animated.View style={[styles.dot, { opacity: loadingOpacity }]} />
            <Animated.View style={[styles.dot, { opacity: loadingOpacity }]} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // אם תרצה גרדיאנט, נוסיף LinearGradient בהמשך
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },
  bottomSection: {
    alignItems: "center",
    position: "absolute",
    bottom: 120,
  },
  welcomeText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingAnimation: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});

export default SplashScreen;
