// src/screens/common/SplashScreen.tsx

import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

// מסך הפתיחה הראשוני של האפליקציה, מציג את הלוגו בזמן טעינת הנתונים
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
      <Text style={styles.loadingText}>טוען...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef4fc",
  },
  logo: { width: 120, height: 120, marginBottom: 24 },
  spinner: { transform: [{ scale: 1.5 }] },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.primary },
});

export default SplashScreen;
