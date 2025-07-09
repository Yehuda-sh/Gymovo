// src/screens/workouts/active-workout/components/SetRow.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SetRowProps, workoutColors } from "../types";
import PreviousPerformance from "./PreviousPerformance";
import SetNotes from "./SetNotes";

// 💪 רכיב סט משופר
const SetRow: React.FC<SetRowProps> = ({
  set,
  setIndex,
  exerciseId,
  onWeightChange,
  onRepsChange,
  onComplete,
  isActive,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  const getSetColor = () => {
    switch (set.status) {
      case "completed":
        return workoutColors.completed;
      case "skipped":
        return workoutColors.subtext;
      default:
        return isActive ? workoutColors.active : workoutColors.pending;
    }
  };

  useEffect(() => {
    if (set.status === "completed") {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.spring(checkmarkAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [set.status, scaleAnim, checkmarkAnim]);

  return (
    <Animated.View
      style={[
        styles.setRow,
        {
          borderColor: getSetColor(),
          transform: [{ scale: scaleAnim }],
          opacity:
            set.status === "skipped"
              ? 0.5
              : set.status === "completed"
              ? 0.8
              : 1,
        },
      ]}
    >
      <View style={styles.setHeader}>
        <View style={styles.setNumberContainer}>
          <Text style={[styles.setNumber, { color: getSetColor() }]}>
            סט {setIndex + 1}
          </Text>
          {set.status === "completed" && (
            <Animated.View style={{ transform: [{ scale: checkmarkAnim }] }}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={workoutColors.completed}
              />
            </Animated.View>
          )}
        </View>
        <SetNotes setId={set.id} />
      </View>

      {isActive && (
        <PreviousPerformance exerciseId={exerciseId} setIndex={setIndex} />
      )}

      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>משקל (קג)</Text>
          <TextInput
            style={[styles.setInput, { borderColor: getSetColor() }]}
            value={set.weight?.toString() || ""}
            onChangeText={(text) => {
              const weight = parseFloat(text) || 0;
              onWeightChange(weight);
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
            editable={set.status !== "completed"}
            textAlign="center"
          />
        </View>

        <Text style={styles.inputSeparator}>×</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>חזרות</Text>
          <TextInput
            style={[styles.setInput, { borderColor: getSetColor() }]}
            value={set.reps?.toString() || ""}
            onChangeText={(text) => {
              const reps = parseInt(text) || 0;
              onRepsChange(reps);
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
            editable={set.status !== "completed"}
            textAlign="center"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.completeButton,
          {
            backgroundColor:
              set.status === "completed"
                ? workoutColors.completed
                : workoutColors.primary,
          },
        ]}
        onPress={onComplete}
        disabled={set.status === "completed"}
      >
        <Text style={[styles.completeButtonText, { color: "#fff" }]}>
          {set.status === "completed" ? "הושלם ✓" : "סיימתי סט"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  setRow: {
    backgroundColor: workoutColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  setHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  setNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  setInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 16,
  },
  inputGroup: {
    alignItems: "center",
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: workoutColors.subtext,
    marginBottom: 8,
    textAlign: "center",
  },
  setInput: {
    backgroundColor: workoutColors.inputBg,
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    minWidth: 80,
  },
  inputSeparator: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.accent,
    marginTop: 20,
  },
  completeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SetRow;
