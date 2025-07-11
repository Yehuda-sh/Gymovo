// src/components/dev/CleanDuplicatesHelper.tsx
// 🧹 רכיב עזר לניקוי תוכניות כפולות - להוסיף זמנית במסך כלשהו

import React from "react";
import { View, Button, Alert, Text } from "react-native";
import { PlanCleaner } from "../../services/cleanDuplicatePlans";
import { useUserStore } from "../../stores/userStore";

export const CleanDuplicatesHelper: React.FC = () => {
  const user = useUserStore((state) => state.user);

  const handleAnalyze = async () => {
    if (!user?.id) {
      Alert.alert("שגיאה", "משתמש לא מחובר");
      return;
    }

    try {
      const analysis = await PlanCleaner.analyze(user.id);
      const report = await PlanCleaner.report(user.id);

      Alert.alert(
        "ניתוח תוכניות כפולות",
        `סה"כ תוכניות: ${analysis.totalPlans}\n` +
          `תוכניות ייחודיות: ${analysis.uniquePlans}\n` +
          `כפילויות למחיקה: ${analysis.recommendedToDelete.length}`,
        [
          { text: "ביטול", style: "cancel" },
          {
            text: "הצג דוח מפורט",
            onPress: () => Alert.alert("דוח מפורט", report),
          },
        ]
      );
    } catch (error) {
      Alert.alert("שגיאה", "לא ניתן לנתח את התוכניות");
    }
  };

  const handleCleanDryRun = async () => {
    if (!user?.id) {
      Alert.alert("שגיאה", "משתמש לא מחובר");
      return;
    }

    try {
      const result = await PlanCleaner.clean(user.id, true);

      Alert.alert(
        "הדמיית ניקוי",
        `תוכניות שיימחקו: ${result.deletedCount}\n` +
          `תוכניות שיישארו: ${result.keptCount}\n` +
          `מקום שיתפנה: ${(result.freedSpace / 1024).toFixed(2)} KB`,
        [
          { text: "ביטול", style: "cancel" },
          {
            text: "בצע ניקוי אמיתי",
            style: "destructive",
            onPress: handleCleanReal,
          },
        ]
      );
    } catch (error) {
      Alert.alert("שגיאה", "לא ניתן לבצע הדמיה");
    }
  };

  const handleCleanReal = async () => {
    if (!user?.id) {
      Alert.alert("שגיאה", "משתמש לא מחובר");
      return;
    }

    Alert.alert(
      "אישור סופי",
      "האם אתה בטוח שברצונך למחוק את כל התוכניות הכפולות?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק כפילויות",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await PlanCleaner.clean(user.id, false);

              Alert.alert(
                "ניקוי הושלם! ✅",
                `נמחקו: ${result.deletedCount} תוכניות כפולות\n` +
                  `נשארו: ${result.keptCount} תוכניות ייחודיות\n` +
                  `התפנו: ${(result.freedSpace / 1024).toFixed(2)} KB\n\n` +
                  `כדאי לרענן את מסך התוכניות`,
                [{ text: "אישור" }]
              );
            } catch (error) {
              Alert.alert("שגיאה", "הניקוי נכשל");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = async () => {
    if (!user?.id) {
      Alert.alert("שגיאה", "משתמש לא מחובר");
      return;
    }

    Alert.alert(
      "⚠️ אזהרה חמורה",
      "פעולה זו תמחק את כל התוכניות שלך ללא יכולת שחזור!",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "אני מבין, מחק הכל",
          style: "destructive",
          onPress: () => {
            Alert.alert("אישור סופי", "האם אתה בטוח לחלוטין?", [
              { text: "ביטול", style: "cancel" },
              {
                text: "מחק הכל",
                style: "destructive",
                onPress: async () => {
                  try {
                    await PlanCleaner.deleteAll(user.id);
                    Alert.alert("הושלם", "כל התוכניות נמחקו");
                  } catch (error) {
                    Alert.alert("שגיאה", "המחיקה נכשלה");
                  }
                },
              },
            ]);
          },
        },
      ]
    );
  };

  // רכיב זה מיועד לשימוש זמני בלבד!
  // הוסף אותו למסך פרופיל או הגדרות
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        margin: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🛠️ כלי ניקוי תוכניות כפולות
      </Text>

      <Button title="🔍 נתח תוכניות" onPress={handleAnalyze} color="#2196F3" />

      <View style={{ height: 10 }} />

      <Button
        title="🧪 הדמיית ניקוי"
        onPress={handleCleanDryRun}
        color="#FF9800"
      />

      <View style={{ height: 10 }} />

      <Button
        title="🧹 נקה כפילויות"
        onPress={handleCleanReal}
        color="#4CAF50"
      />

      <View style={{ height: 20 }} />

      <Button
        title="🗑️ מחק את כל התוכניות"
        onPress={handleDeleteAll}
        color="#F44336"
      />
    </View>
  );
};
