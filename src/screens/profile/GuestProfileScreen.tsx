// src/screens/profile/GuestProfileScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

// מסך המוצג בטאב "פרופיל" עבור משתמשים אורחים
const GuestProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
      <Text style={styles.title}>רוצה להפוך למקצוען?</Text>
      <Text style={styles.subtitle}>
        צור חשבון בחינם כדי לשמור את האימונים, לעקוב אחר ההתקדמות ולקבל גישה לכל
        הפיצרים.
      </Text>
      <Button
        title="צור חשבון עכשיו"
        onPress={() => navigation.navigate("Signup")}
        variant="primary"
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background || "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
});

export default GuestProfileScreen;
