// WelcomeScreen.tsx - גרסה מקצועית ברמה עולמית

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  DevSettings,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { demoUsers } from "../../constants/demoUsers";
import { clearAllData } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen = ({ navigation }: Props) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

  // אנימציות מתקדמות ומקצועיות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.5)).current;
  const titleSlide = useRef(new Animated.Value(-50)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;
  const particleFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית כניסה קינמטית מקצועית
    Animated.sequence([
      // Phase 1: Logo Entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Title Animation
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Phase 3: Subtitle
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Phase 4: Buttons
      Animated.spring(buttonsSlide, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציות מתמשכות
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.5,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    const particleAnimation = Animated.loop(
      Animated.timing(particleFloat, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    const timer = setTimeout(() => {
      glowAnimation.start();
      particleAnimation.start();
    }, 2000);

    return () => {
      clearTimeout(timer);
      glowAnimation.stop();
      particleAnimation.stop();
    };
  }, []);

  const handleGuestContinue = () => {
    becomeGuest();
  };

  const handleDeveloperReset = async () => {
    await clearAllData();
    DevSettings.reload();
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const particleY = particleFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* רקע דינמי עם שכבות */}
      <ImageBackground
        source={require("../../../assets/images/backgrounds/welcome-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Animated background particles */}
        <Animated.View
          style={[
            styles.particles,
            {
              transform: [{ translateY: particleY }],
              opacity: particleFloat,
            },
          ]}
        />

        {/* אוברליי מקצועי עם גרדיאנט */}
        <View style={styles.primaryOverlay} />
        <View style={styles.secondaryOverlay} />

        {/* Grid pattern עדין */}
        <View style={styles.gridPattern} />

        {/* תוכן ראשי */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Logo Section עם אפקטים מתקדמים */}
          <View style={styles.logoSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [
                    { scale: logoScale },
                    { rotate: logoRotateInterpolate },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.logoGlow,
                  {
                    opacity: glowPulse,
                    transform: [{ scale: glowPulse }],
                  },
                ]}
              />
              <View style={styles.logoFrame}>
                <View style={styles.logoInnerFrame}>
                  <Image
                    style={styles.logo}
                    source={require("../../../assets/images/branding/logo.png")}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Brand Section */}
          <View style={styles.brandSection}>
            <Animated.View
              style={[
                styles.titleContainer,
                { transform: [{ translateY: titleSlide }] },
              ]}
            >
              <Text style={styles.brandTitle}>GYMOVO</Text>
              <View style={styles.brandUnderline} />
            </Animated.View>

            <Animated.View
              style={[
                styles.taglineContainer,
                { transform: [{ translateY: subtitleSlide }] },
              ]}
            >
              <Text style={styles.tagline}>TRAIN • TRACK • TRIUMPH</Text>
              <Text style={styles.subtitle}>
                האפליקציה המקצועית לאימונים מתקדמים
              </Text>
              <Text style={styles.description}>
                טכנולוגיה מתקדמת למעקב ושיפור ביצועים
              </Text>
            </Animated.View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionsSection,
              { transform: [{ translateY: buttonsSlide }] },
            ]}
          >
            <View style={styles.primaryActions}>
              <Button
                title="התחבר"
                onPress={() => navigation.navigate("Login")}
                variant="primary"
                style={styles.primaryButton}
              />
              <Button
                title="הירשם"
                onPress={() => navigation.navigate("Signup")}
                variant="secondary"
                style={styles.secondaryButton}
              />
            </View>

            <Button
              title="המשך כאורח"
              onPress={handleGuestContinue}
              variant="outline"
              style={styles.guestButton}
            />

            {/* Developer Panel */}
            {__DEV__ && (
              <View style={styles.devPanel}>
                <View style={styles.devHeader}>
                  <View style={styles.devIndicator} />
                  <Text style={styles.devTitle}>DEVELOPER MODE</Text>
                  <View style={styles.devIndicator} />
                </View>
                <View style={styles.devActions}>
                  {demoUsers.map((demoUser, index) => (
                    <Button
                      key={demoUser.id}
                      title={(demoUser.name || "User")
                        .split(" ")[0]
                        .toUpperCase()}
                      onPress={() => loginAsDemoUser(demoUser)}
                      variant="success"
                      style={styles.devButton}
                    />
                  ))}
                </View>
                <Button
                  title="SYSTEM RESET"
                  onPress={handleDeveloperReset}
                  variant="danger"
                  style={styles.resetButton}
                />
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 255, 136, 0.02)",
  },
  primaryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  secondaryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 20, 40, 0.6)",
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    // ניתן להוסיף תמונת grid או ליצור עם borders
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 50,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0, 255, 136, 0.2)",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  logoFrame: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 8,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 136, 0.6)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  logoInnerFrame: {
    flex: 1,
    borderRadius: 72,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 8,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
    textShadowColor: "rgba(0, 255, 136, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 16,
  },
  brandUnderline: {
    width: 160,
    height: 4,
    backgroundColor: "#00ff88",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  taglineContainer: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "800",
    color: "#00ff88",
    textAlign: "center",
    letterSpacing: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Hebrew" : "sans-serif",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Hebrew" : "sans-serif",
  },
  spacer: {
    flex: 1,
  },
  actionsSection: {
    width: "100%",
  },
  primaryActions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#00ff88",
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.8)",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 18,
  },
  guestButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 20,
  },
  devPanel: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  devIndicator: {
    width: 20,
    height: 2,
    backgroundColor: "#ff6b35",
    marginHorizontal: 8,
  },
  devTitle: {
    color: "#ff6b35",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  devActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    gap: 8,
  },
  devButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 0,
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 0,
  },
});

export default WelcomeScreen;
