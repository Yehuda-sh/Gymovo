// src/screens/exercises/exercise-selection/components/LoadingState.tsx
// רכיב מצב טעינה מעוצב למסך בחירת תרגילים

import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { designSystem } from "../../../../theme/designSystem";
import { styles } from "../styles/exerciseSelectionStyles";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "טוען תרגילים..." 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית כניסה
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // אנימציית סיבוב מתמשכת
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={designSystem.gradients.dark.colors}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View style={[loadingStyles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            loadingStyles.iconContainer,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          <Ionicons
            name="barbell"
            size={48}
            color={designSystem.colors.primary.main}
          />
        </Animated.View>
        <Text style={styles.loadingText}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
});

export default LoadingState; 