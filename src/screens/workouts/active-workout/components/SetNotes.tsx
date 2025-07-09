// src/screens/workouts/active-workout/components/SetNotes.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SetNotesProps, workoutColors } from "../types";

// 📝 הערות מהירות לסט
const SetNotes: React.FC<SetNotesProps> = ({ setId, initialNote = "" }) => {
  const [note, setNote] = useState(initialNote);
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View style={styles.notesContainer}>
      <TouchableOpacity
        style={[styles.notesButton, note ? styles.notesButtonActive : null]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Ionicons
          name={note ? "chatbubble" : "chatbubble-outline"}
          size={20}
          color={note ? workoutColors.primary : workoutColors.subtext}
        />
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[styles.noteInputContainer, { opacity: fadeAnim }]}
        >
          <TextInput
            style={styles.noteInput}
            placeholder="הערה לסט..."
            placeholderTextColor={workoutColors.subtext}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={100}
            onBlur={() => setIsOpen(false)}
            autoFocus
            textAlign="right"
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notesContainer: {
    position: "relative",
  },
  notesButton: {
    padding: 4,
  },
  notesButtonActive: {
    backgroundColor: workoutColors.primary + "10",
    borderRadius: 16,
  },
  noteInputContainer: {
    position: "absolute",
    top: 40,
    left: 0, // שינוי ל-left במקום right
    width: 200,
    backgroundColor: workoutColors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: workoutColors.border,
    padding: 8,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteInput: {
    fontSize: 14,
    color: workoutColors.text,
    minHeight: 60,
    textAlign: "right",
  },
});

export default SetNotes;
