// src/components/cards/workout-card/WorkoutCardSkeleton.tsx
// רכיב אנימציית טעינה עבור WorkoutCard - אפקט שלד מתקדם

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

/**
 * 💀 רכיב Skeleton Loading עם אנימציה מדורגת
 * מציג אפקט טעינה אלגנטי בזמן שהנתונים נטענים
 */
interface WorkoutCardSkeletonProps {
  /** אינדקס לאנימציה מדורגת */
  index?: number;
}

export const WorkoutCardSkeleton: React.FC<WorkoutCardSkeletonProps> = ({
  index = 0,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // אנימציה מדורגת
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]).start();
  }, [pulseAnim, slideAnim, index]);

  const skeletonOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* כותרת Skeleton */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.title,
            {
              opacity: skeletonOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.badge,
            {
              opacity: skeletonOpacity,
            },
          ]}
        />
      </View>

      {/* תאריך Skeleton */}
      <Animated.View
        style={[
          styles.date,
          {
            opacity: skeletonOpacity,
          },
        ]}
      />

      {/* סטטיסטיקות Skeleton */}
      <View style={styles.stats}>
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.stat,
              {
                opacity: skeletonOpacity,
              },
            ]}
          />
        ))}
      </View>

      {/* הערות Skeleton */}
      <Animated.View
        style={[
          styles.notes,
          {
            opacity: skeletonOpacity,
          },
        ]}
      />

      {/* שרירים Skeleton */}
      <View style={styles.muscles}>
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.muscleTag,
              {
                opacity: skeletonOpacity,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    height: 20,
    borderRadius: 4,
    width: "60%",
    backgroundColor: "#444444",
  },
  badge: {
    height: 16,
    borderRadius: 8,
    width: 50,
    backgroundColor: "#444444",
  },
  date: {
    height: 14,
    borderRadius: 4,
    marginBottom: 12,
    width: "30%",
    alignSelf: "flex-end",
    backgroundColor: "#444444",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 12,
  },
  stat: {
    height: 12,
    borderRadius: 4,
    width: 60,
    backgroundColor: "#444444",
  },
  notes: {
    height: 32,
    borderRadius: 4,
    marginBottom: 12,
    width: "80%",
    alignSelf: "flex-end",
    backgroundColor: "#444444",
  },
  muscles: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
  muscleTag: {
    height: 20,
    borderRadius: 10,
    width: 50,
    backgroundColor: "#444444",
  },
});
