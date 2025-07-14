// src/screens/auth/signup/components/LoginPrompt.tsx
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LoginPromptProps, signupColors } from "../types";

const LoginPrompt: React.FC<LoginPromptProps> = React.memo(
  ({ onLoginPress }) => {
    // Haptic feedback למובייל
    const handlePress = useCallback(() => {
      if (Platform.OS === "ios") {
        // הוספת haptic feedback ב-iOS
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onLoginPress();
    }, [onLoginPress]);

    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>יש לך כבר חשבון? </Text>
        <TouchableOpacity
          onPress={handlePress}
          accessibilityRole="link"
          accessibilityLabel="התחבר כאן"
          accessibilityHint="לחץ כדי לעבור למסך ההתחברות"
          style={styles.loginLinkTouchable}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.loginLink}>התחבר כאן</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

LoginPrompt.displayName = "LoginPrompt";

const styles = StyleSheet.create({
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 4,
  },
  loginText: {
    color: signupColors.loginText,
    fontSize: 15,
    fontWeight: "400",
  },
  loginLink: {
    color: signupColors.primary,
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  loginLinkTouchable: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 2,
  },
});

export default LoginPrompt;
