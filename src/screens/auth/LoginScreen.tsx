// src/screens/auth/LoginScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

// מסך ההתחברות לאפליקציה
const LoginScreen = ({ navigation }: Props) => {
  // קבלת פונקציית ההתחברות מה-store המרכזי
  const login = useUserStore((state: UserState) => state.login);

  // ניהול מצב מקומי עבור הטופס
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // פונקציה המטפלת בלוגיקת ההתחברות
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("נא למלא את כל השדות");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await login(email, password);
      // אם ההתחברות נכשלה, הצג שגיאה
      if (!res.success) {
        const errorMessage = res.error || "התחברות נכשלה, נסה שוב";
        setError(errorMessage);
        Toast.show(errorMessage, "error");
      }
      // אם ההתחברות הצליחה, הניווט יתבצע אוטומטית על ידי RootLayout
    } catch (e) {
      const errorMessage = "אירעה שגיאה בלתי צפויה";
      setError(errorMessage);
      Toast.show(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>התחברות</Text>
      <View style={styles.form}>
        <Input
          label="מייל"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          iconName="mail-outline"
        />
        <Input
          label="סיסמה"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          iconName="lock-closed-outline"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007aff" />
          ) : (
            <>
              <Button
                title="התחבר"
                onPress={handleLogin}
                disabled={isLoading}
                variant="primary"
              />
              <Button
                title="חזור"
                onPress={() => navigation.goBack()}
                disabled={isLoading}
                variant="outline"
              />
            </>
          )}
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

export default LoginScreen;
