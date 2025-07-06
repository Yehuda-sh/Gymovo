// src/screens/auth/SignupScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

// מסך ההרשמה, השלב הראשון לפני השאלון
const SignupScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  // פונקציה הבודקת את תקינות הקלט ומנווטת לשאלון
  const handleProceedToQuiz = () => {
    setError(null);
    const ageNum = parseInt(age, 10);

    // בדיקות ולידציה לפני המעבר
    if (!email.trim() || !password.trim() || !age.trim()) {
      setError("נא למלא את כל השדות");
      return;
    }
    if (!email.includes("@")) {
      setError("כתובת המייל אינה תקינה");
      return;
    }
    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    if (isNaN(ageNum) || ageNum < 16) {
      setError("הגיל המינימלי להרשמה הוא 16");
      return;
    }

    // ניווט למסך השאלון עם פרטי ההרשמה
    navigation.navigate("Quiz", {
      signupData: { email, password, age: ageNum },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>הרשמה</Text>
      <View style={styles.form}>
        <Input
          label="מייל"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail-outline"
        />
        <Input
          label="סיסמה (6 תווים לפחות)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          iconName="lock-closed-outline"
        />
        <Input
          label="גיל"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          iconName="body-outline"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttonContainer}>
          <Button
            title="המשך לשאלון"
            onPress={handleProceedToQuiz}
            variant="primary"
          />
          <Button
            title="חזור"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#333",
  },
  form: { width: "100%" },
  error: { color: "red", marginBottom: 16, textAlign: "center" },
  buttonContainer: { marginTop: 16, gap: 12 },
});

export default SignupScreen;
