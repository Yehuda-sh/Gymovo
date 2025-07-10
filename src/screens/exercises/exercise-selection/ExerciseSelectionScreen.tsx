// src/screens/exercises/exercise-selection/ExerciseSelectionScreen.tsx
// מסך בחירת תרגילים מרופקטר ומאורגן

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Components
import {
  CategoryFilter,
  ExerciseItem,
  LoadingState,
  ErrorState,
} from "./components";

// Types & Utils
import { colors } from "../../../theme/colors";
import { RootStackParamList } from "../../../types/navigation";
import { Exercise } from "../../../types/exercise";
import { designSystem } from "../../../theme/designSystem";

// Hooks & Utils
import { useExerciseSelection } from "./hooks";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExerciseSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const {
    // Data
    filteredExercises,
    isLoading,
    isError,

    // State
    selectedExercises,
    selectedCategory,
    searchQuery,

    // Animations
    fadeAnim,
    searchAnim,

    // Actions
    setSelectedCategory,
    setSearchQuery,
    toggleExercise,
    clearSelection,
    handleStartWorkout,
  } = useExerciseSelection();

  // פונקציית רינדור תרגיל
  const renderExercise = ({
    item,
    index,
  }: {
    item: Exercise;
    index: number;
  }) => (
    <ExerciseItem
      exercise={item}
      isSelected={selectedExercises.some((e) => e.id === item.id)}
      onToggle={() => toggleExercise(item)}
      index={index}
    />
  );

  // מצבי טעינה ושגיאה
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <LinearGradient
      colors={designSystem.gradients.dark.colors}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>בחירת תרגילים</Text>

        {selectedExercises.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
            <Text style={styles.clearButtonText}>נקה</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Search */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scale: searchAnim }],
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={designSystem.colors.neutral.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="חפש תרגיל..."
          placeholderTextColor={designSystem.colors.neutral.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.searchClearButton}
            onPress={() => setSearchQuery("")}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={designSystem.colors.neutral.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Selected Counter */}
      {selectedExercises.length > 0 && (
        <View style={styles.selectedCounter}>
          <Text style={styles.selectedCounterText}>
            נבחרו {selectedExercises.length} תרגילים
          </Text>
        </View>
      )}

      {/* Exercises List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExercise}
        style={styles.exercisesList}
        contentContainerStyle={styles.exercisesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={64}
              color={designSystem.colors.neutral.text.tertiary}
            />
            <Text style={styles.emptyTitle}>לא נמצאו תרגילים</Text>
            <Text style={styles.emptyText}>
              נסה לשנות את הפילטרים או החיפוש
            </Text>
          </View>
        }
      />

      {/* Bottom Section */}
      <LinearGradient
        colors={[
          "transparent",
          designSystem.colors.background.primary + "CC",
          designSystem.colors.background.primary,
        ]}
        style={styles.bottomGradient}
      />

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.startButton,
            selectedExercises.length === 0 && styles.startButtonDisabled,
          ]}
          onPress={handleStartWorkout}
          disabled={selectedExercises.length === 0}
        >
          <LinearGradient
            colors={
              selectedExercises.length > 0
                ? designSystem.gradients.primary.colors
                : ["#666", "#444"]
            }
            style={styles.startButtonGradient}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.startButtonText}>
              התחל אימון ({selectedExercises.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ExerciseSelectionScreen;
