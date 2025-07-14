// src/screens/workouts/start-workout/components/DayCard.tsx

import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../theme/colors";
import { PlanDay } from "../../../../types/plan";
import * as Haptics from "expo-haptics";

interface DayCardProps {
  day: PlanDay;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

// Fixed with displayName and dependency
const DayCard = React.memo<DayCardProps>(
  ({ day, isSelected, onPress, index }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, [index, rotateAnim]); // Fixed: Added rotateAnim to dependencies

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    };

    const rotation = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["90deg", "0deg"],
    });

    const opacity = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ scale: scaleAnim }, { rotateY: rotation }],
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <LinearGradient
            colors={
              isSelected
                ? [colors.primary, colors.secondary]
                : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.card, isSelected && styles.selectedCard]}
          >
            <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
              יום {index + 1}
            </Text>
            <Text style={[styles.dayName, isSelected && styles.selectedText]}>
              {day.name}
            </Text>
            <View style={styles.exerciseCount}>
              <Ionicons
                name="barbell-outline"
                size={16}
                color={isSelected ? "white" : "rgba(255,255,255,0.5)"}
              />
              <Text
                style={[styles.exerciseText, isSelected && styles.selectedText]}
              >
                {day.exercises?.length || 0}
              </Text>
            </View>
            {isSelected && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.day.id === nextProps.day.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

// Add display name for debugging
DayCard.displayName = "DayCard";

export { DayCard };

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  card: {
    width: 120,
    height: 140,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  selectedCard: {
    borderColor: "transparent",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  dayNumber: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  dayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginVertical: 8,
  },
  selectedText: {
    color: "white",
  },
  exerciseCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseText: {
    marginLeft: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  checkMark: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
