// src/screens/workouts/start-workout/components/PlansLoadingSkeleton.tsx

import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonItem = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)"]}
        style={styles.gradient}
      >
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export const PlansLoadingSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <SkeletonItem key={key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  skeletonCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
  },
  skeletonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  skeletonTitle: {
    width: "60%",
    height: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    width: "40%",
    height: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
});
