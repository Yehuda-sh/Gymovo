// src/screens/exercises/exercise-selection/components/CategoryFilter.tsx
// רכיב פילטר קטגוריות משודרג עם אנימציות וגרדיאנטים

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useEffect } from "react";
import { Animated, ScrollView, TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { muscleGroups, MuscleGroup } from "../utils/constants";
import { styles } from "../styles/exerciseSelectionStyles";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // יצירת אנימציות לכל קטגוריה
  const categoryAnimations = useRef(
    muscleGroups.map(() => ({
      scale: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  const renderCategory = (group: MuscleGroup, index: number) => {
    const isSelected = selectedCategory === group.id;
    const { scale: scaleAnim, rotate: rotateAnim } = categoryAnimations[index];

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });

      onCategoryChange(group.id);
    };

    return (
      <Animated.View
        key={group.id}
        style={{
          transform: [
            { scale: scaleAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.categoryButton,
            isSelected && styles.activeCategoryButton,
          ]}
        >
          {isSelected ? (
            <LinearGradient
              colors={[...group.gradient]}
              style={styles.categoryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={group.icon as any} size={24} color="#fff" />
              <Text style={[styles.categoryText, styles.activeCategoryText]}>
                {group.name}
              </Text>
            </LinearGradient>
          ) : (
            <>
              <Ionicons
                name={group.icon as any}
                size={24}
                color={group.color}
              />
              <Text style={styles.categoryText}>{group.name}</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {muscleGroups.map((group, index) => renderCategory(group, index))}
      </ScrollView>
    </Animated.View>
  );
};

export default CategoryFilter;
