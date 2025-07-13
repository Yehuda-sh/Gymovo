// src/screens/home/components/HomeHeader.tsx
// כותרת אולטרה קומפקטית

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../../../types/user";

interface HomeHeaderProps {
  user: User | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  const getUserName = () => {
    if (!user || user.isGuest) return "אורח";
    return user.name || user.email.split("@")[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={["rgba(102, 126, 234, 0.3)", "rgba(118, 75, 162, 0.3)"]}
          style={styles.avatar}
        >
          <Ionicons
            name={user?.isGuest ? "person-outline" : "person"}
            size={18}
            color="#fff"
          />
        </LinearGradient>
      </View>
      <Text style={styles.greeting}>
        {getGreeting()}, {getUserName()} 💪
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 4,
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.5)",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
});

export default HomeHeader;
