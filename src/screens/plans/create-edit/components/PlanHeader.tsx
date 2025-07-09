// src/screens/plans/create-edit/components/PlanHeader.tsx
// הדר מסך יצירה ועריכה של תוכנית אימון

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Button from "../../../../components/common/Button";
import { colors } from "../../../../theme/colors";
import { RootStackParamList } from "../../../../types/navigation";

interface PlanHeaderProps {
  planId?: string;
  onSave: () => void;
  isLoading: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Header component for create/edit plan screen with navigation and save button
 */
const PlanHeader: React.FC<PlanHeaderProps> = ({
  planId,
  onSave,
  isLoading,
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerButton}
      >
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        {planId ? "עריכת תוכנית" : "יצירת תוכנית חדשה"}
      </Text>

      <Button
        title="שמור"
        onPress={onSave}
        loading={isLoading}
        style={styles.saveButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  headerButton: {
    padding: 5,
  },
  saveButton: {
    width: "auto",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 0,
  },
});

export default PlanHeader;
