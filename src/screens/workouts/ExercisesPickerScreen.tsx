// File: src/screens/workouts/ExercisesPickerScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useDebounce } from "../../hooks/useDebounce";
import { useExercises } from "../../hooks/useExercises";
import { colors } from "../../theme/colors";
import { Exercise } from "../../types/exercise";
import { RootStackParamList } from "../../types/navigation";

type ScreenRouteProp = RouteProp<RootStackParamList, "ExercisesPicker">;

const ExercisesPickerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();
  const { initiallySelected = [], onDone } = route.params;

  const { data: allExercises = [], isLoading, isError } = useExercises();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initiallySelected.map((ex) => ex.id))
  );

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (allExercises) {
      const filtered = allExercises.filter((ex) =>
        ex.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [debouncedSearchTerm, allExercises]);

  const toggleSelect = useCallback((exerciseId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  }, []);

  const handleDone = () => {
    const selectedExercises = allExercises.filter((ex) =>
      selectedIds.has(ex.id)
    );
    onDone(selectedExercises);
    navigation.goBack();
  };

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => {
      const isSelected = selectedIds.has(item.id);
      return (
        <TouchableOpacity
          style={[styles.card, isSelected && styles.cardSelected]}
          onPress={() => toggleSelect(item.id)}
        >
          <View>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {item.muscleGroup && (
              <Text style={styles.muscleGroup}>{item.muscleGroup}</Text>
            )}
          </View>
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? colors.primary : "#ccc"}
          />
        </TouchableOpacity>
      );
    },
    [selectedIds, toggleSelect]
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }
  if (isError) {
    return <Text style={styles.centered}>שגיאה בטעינת התרגילים מהשרת.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>בחר תרגילים</Text>
      </View>
      <Input
        placeholder="חפש תרגיל..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        iconName="search"
        style={styles.searchInput}
      />

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedIds}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>לא נמצאו תרגילים</Text>
        }
      />

      <View style={styles.footer}>
        <Button
          title={`אשר בחירה (${selectedIds.size})`}
          onPress={handleDone}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  headerTitle: { fontSize: 32, fontWeight: "bold", textAlign: "right" },
  searchInput: { margin: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#eef4fc",
  },
  exerciseName: { fontSize: 16, fontWeight: "500", textAlign: "right" },
  muscleGroup: {
    fontSize: 14,
    color: "#888",
    textAlign: "right",
    marginTop: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});

export default ExercisesPickerScreen;
