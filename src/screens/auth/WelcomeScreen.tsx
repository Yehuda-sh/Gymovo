// src/screens/auth/WelcomeScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { DevSettings, Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import { demoUsers } from "../../constants/demoUsers";
import { clearAllData } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

// מסך הפתיחה של האפליקציה למשתמשים לא מחוברים
const WelcomeScreen = ({ navigation }: Props) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

  const handleGuestContinue = () => {
    becomeGuest();
  };
  const handleDeveloperReset = async () => {
    await clearAllData();
    DevSettings.reload();
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../../assets/logo.png")} />
      <Text style={styles.title}>ברוכים הבאים ל- Gymovo</Text>
      <Text style={styles.desc}>האפליקציה שתגרום לך להתמיד ולנצח!</Text>
      <View style={styles.buttonGroup}>
        <Button
          title="התחבר"
          onPress={() => navigation.navigate("Login")}
          variant="primary"
        />
        <Button
          title="הרשמה"
          onPress={() => navigation.navigate("Signup")}
          variant="secondary"
        />
        <Button
          title="המשך כאורח"
          onPress={handleGuestContinue}
          variant="outline"
        />

        {/* אזור למפתחים בלבד, לא יופיע בגרסה הסופית */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <Text style={styles.devSectionTitle}>-- מצב מפתחים --</Text>
            {demoUsers.map((demoUser) => (
              <Button
                key={demoUser.id}
                title={`התחבר בתור ${demoUser.name}`}
                onPress={() => loginAsDemoUser(demoUser)}
                variant="success"
              />
            ))}
            <Button
              title="איפוס אפליקציה"
              onPress={handleDeveloperReset}
              variant="danger"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#eef4fc",
  },
  logo: { width: 120, height: 120, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8, color: "#222" },
  desc: { fontSize: 16, marginBottom: 32, color: "#444" },
  buttonGroup: { width: "100%", alignItems: "center", gap: 4 },
  devSection: {
    marginTop: 24,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 16,
    gap: 8,
  },
  devSectionTitle: {
    textAlign: "center",
    marginBottom: 8,
    color: "#777",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
