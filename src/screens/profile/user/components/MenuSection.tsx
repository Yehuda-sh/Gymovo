// src/screens/profile/user/components/MenuSection.tsx
// תפריט פעולות ראשיות בעיצוב מודרני

import React from "react";
import { View, StyleSheet } from "react-native";
import QuickActions from "./QuickActions";

interface MenuSectionProps {
  onMyPlansPress: () => void;
  onHistoryPress: () => void;
  onGuidesPress: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  onMyPlansPress,
  onHistoryPress,
  onGuidesPress,
}) => {
  // נשתמש ב-QuickActions הקיים עם התאמות
  return (
    <View style={styles.section}>
      <QuickActions
        onSettingsPress={onMyPlansPress} // התוכניות שלי במקום הגדרות
        onGuidesPress={onGuidesPress}
        onSupportPress={onHistoryPress} // היסטוריה במקום תמיכה
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
});

export default MenuSection;
