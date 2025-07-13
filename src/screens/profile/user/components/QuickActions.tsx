// src/screens/profile/user/components/QuickActions.tsx
// פעולות מהירות קומפקטיות עם צללים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Platform,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { QuickActionsProps } from "../types";

// צבעים בהשראת העיצוב החדש
const quickColors = {
  cardBackground: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.1)",
  iconPrimary: "#667eea",
  iconSecondary: "rgba(255, 255, 255, 0.6)",
  text: "#ffffff",
};

// אכיפת RTL
I18nManager.forceRTL(true);

const QuickActions: React.FC<QuickActionsProps> = ({
  onSettingsPress,
  onGuidesPress,
  onSupportPress,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  const menuItems = [
    {
      icon: "list-outline",
      text: "התוכניות שלי",
      onPress: onSettingsPress,
      color: "#667eea",
    },
    {
      icon: "time-outline",
      text: "היסטוריית אימונים",
      onPress: onSupportPress,
      color: "#764ba2",
    },
    {
      icon: "book-outline",
      text: "מדריכי אימון",
      onPress: onGuidesPress,
      color: "#00b894",
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handlePress(item.onPress)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.color}
                />
              </View>
              <Text style={styles.menuItemText}>{item.text}</Text>
              <Ionicons
                name="chevron-back"
                size={18}
                color={quickColors.iconSecondary}
              />
            </TouchableOpacity>

            {index < menuItems.length - 1 && (
              <View style={styles.menuDivider} />
            )}
          </React.Fragment>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10, // הקטנה מ-20
  },
  menuCard: {
    backgroundColor: quickColors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: quickColors.cardBorder,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  menuItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 10, // הקטנה מ-16
  },
  menuItemIcon: {
    width: 30, // הקטנה מ-40
    height: 30,
    borderRadius: 10, // הקטנה מ-12
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, // הקטנה מ-12
  },
  menuItemText: {
    flex: 1,
    fontSize: 12, // הקטנה מ-16
    color: quickColors.text,
    fontWeight: "400",
    textAlign: "center",
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: quickColors.cardBorder,
    marginHorizontal: 10, // הקטנה מ-16
  },
});

export default QuickActions;
