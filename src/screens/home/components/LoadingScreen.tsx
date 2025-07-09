// src/screens/home/components/LoadingScreen.tsx
// מסך טעינה עם skeletons מפורטים

import React from "react";
import { View } from "react-native";

import { LoadingSkeleton, ScreenLayout, Spacer } from "../../../components/ui";
import { theme } from "../../../theme";

/**
 * Loading screen component with detailed skeleton placeholders
 */
const LoadingScreen: React.FC = () => {
  return (
    <ScreenLayout scrollable>
      {/* Header skeleton */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <LoadingSkeleton width={100} height={28} />
          <Spacer size="xs" />
          <LoadingSkeleton width={150} height={20} />
        </View>
        <LoadingSkeleton width={44} height={44} borderRadius={22} />
      </View>

      <Spacer size="xl" />

      {/* סטטיסטיקות skeleton */}
      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.sm,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ flex: 1 }}>
            <LoadingSkeleton height={100} />
          </View>
        ))}
      </View>

      <Spacer size="xl" />

      {/* תוכניות skeleton */}
      <LoadingSkeleton height={200} />
      <Spacer size="md" />
      <LoadingSkeleton height={200} />
    </ScreenLayout>
  );
};

export default LoadingScreen;
