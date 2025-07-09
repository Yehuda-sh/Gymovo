// src/screens/plans/create-edit/components/PlanDaysList.tsx
// רשימת ימי אימון עם אפשרות גרירה וסידור מחדש

import React from "react";
import { StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import Button from "../../../../components/common/Button";
import { PlanDay } from "../../../../types/plan";
import DayCard from "./DayCard";
import PlanForm from "./PlanForm";

interface PlanDaysListProps {
  planDays: PlanDay[];
  planId?: string;
  onReorderDays: (data: PlanDay[]) => void;
  onAddNewDay: () => void;
  planFormProps: React.ComponentProps<typeof PlanForm>;
}

/**
 * List component for displaying and managing workout days with drag and drop
 */
const PlanDaysList: React.FC<PlanDaysListProps> = ({
  planDays,
  planId,
  onReorderDays,
  onAddNewDay,
  planFormProps,
}) => {
  // 🎯 רכיב רנדור יום אימון
  const renderDayItem = ({ item, drag, isActive }: any) => (
    <DayCard item={item} drag={drag} isActive={isActive} planId={planId} />
  );

  // 📝 הדר עם טופס
  const headerComponent = () => <PlanForm {...planFormProps} />;

  // 🔘 פוטר עם כפתור הוספה
  const footerComponent = () => (
    <Button title="הוסף יום אימון" variant="outline" onPress={onAddNewDay} />
  );

  return (
    <DraggableFlatList
      data={planDays}
      keyExtractor={(item) => item.id}
      renderItem={renderDayItem}
      onDragEnd={({ data }) => onReorderDays(data)}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 100,
  },
});

export default PlanDaysList;
