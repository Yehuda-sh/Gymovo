// File: src/screens/dashboard/HomeScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

const GuestBanner = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.guestBanner}>
      <Text style={styles.guestBannerText}>רוצה לשמור את ההתקדמות שלך?</Text>
      <Button
        title="הירשם בחינם"
        onPress={() => navigation.navigate("Signup")}
        variant="primary"
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const HomeScreen = () => {
  const user = useUserStore((state: UserState) => state.user);
  const status = useUserStore((state: UserState) => state.status);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {status === "guest" && <GuestBanner />}

      <Text style={styles.title}>
        {user?.name ? `ברוך שובך, ${user.name}!` : "ברוך הבא ל-Gymovo!"}
      </Text>

      <Text style={styles.subtitle}>מה הולכים לעשות היום?</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="התחל אימון חדש"
          onPress={() => navigation.navigate("SelectPlan")}
          variant="primary"
        />
        <Button
          title="צפה בתוכניות שלי"
          onPress={() => navigation.navigate("Main", { screen: "Plans" })}
          variant="secondary"
        />
        <Button
          title="היסטוריית אימונים"
          onPress={() => navigation.navigate("Main", { screen: "Workouts" })}
          variant="outline"
        />
      </View>

      <Text style={styles.tip}>💡 טיפ יומי: עקביות היא המפתח להצלחה.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background || "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#444",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  tip: {
    fontSize: 15,
    color: "#777",
    marginTop: 40,
    fontStyle: "italic",
  },
  guestBanner: {
    position: "absolute",
    top: 80,
    width: "100%",
    padding: 16,
    backgroundColor: colors.secondary || "#3498db",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  guestBannerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
