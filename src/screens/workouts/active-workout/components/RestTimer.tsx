// src/screens/workouts/active-workout/components/RestTimer.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Vibration,
} from "react-native";
import { RestTimerProps, workoutColors } from "../types";

// ⏱️ טיימר מנוחה בין סטים
const RestTimer: React.FC<RestTimerProps> = ({
  isVisible,
  onComplete,
  onClose,
  defaultSeconds = 90,
}) => {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      setSeconds(defaultSeconds);
      setIsPaused(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && seconds > 0 && !isPaused) {
      const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && isVisible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Vibration.vibrate([0, 200, 100, 200]);
      onComplete();
    }
  }, [seconds, isVisible, isPaused]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  if (!isVisible) return null;

  return (
    <Modal transparent animationType="none">
      <Animated.View style={[styles.restTimerOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.restTimerContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={workoutColors.text} />
          </TouchableOpacity>

          <Text style={styles.restTimerTitle}>זמן מנוחה</Text>

          <View style={styles.timerCircle}>
            <Text style={styles.restTimerSeconds}>{formatTime(seconds)}</Text>
          </View>

          <View style={styles.timerControls}>
            <TouchableOpacity
              style={styles.timerButton}
              onPress={() => setSeconds((s) => Math.max(0, s - 15))}
            >
              <Text style={styles.timerButtonText}>-15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timerButton, styles.pauseButton]}
              onPress={() => setIsPaused(!isPaused)}
            >
              <Ionicons
                name={isPaused ? "play" : "pause"}
                size={24}
                color={workoutColors.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timerButton}
              onPress={() => setSeconds((s) => s + 15)}
            >
              <Text style={styles.timerButtonText}>+15s</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              setSeconds(0);
              onComplete();
            }}
          >
            <Text style={styles.skipText}>דלג על המנוחה</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  restTimerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  restTimerContainer: {
    backgroundColor: workoutColors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  restTimerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: workoutColors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: workoutColors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  restTimerSeconds: {
    fontSize: 36,
    fontWeight: "bold",
    color: workoutColors.primary,
  },
  timerControls: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  timerButton: {
    backgroundColor: workoutColors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: workoutColors.border,
  },
  pauseButton: {
    paddingHorizontal: 16,
  },
  timerButtonText: {
    fontSize: 16,
    color: workoutColors.text,
    fontWeight: "600",
    textAlign: "center",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: workoutColors.danger,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default RestTimer;
