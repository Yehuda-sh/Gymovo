// src/screens/profile/user/components/DevTools.tsx
// כלי פיתוח בעיצוב מודרני

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Animated,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { DevToolsProps } from "../types";

// צבעים לעיצוב החדש
const devColors = {
  cardBackground: "rgba(255, 167, 38, 0.05)",
  cardBorder: "rgba(255, 167, 38, 0.2)",
  headerIcon: "#ffa726",
  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  buttonBackground: "rgba(255, 255, 255, 0.05)",
  buttonBorder: "rgba(255, 255, 255, 0.1)",

  // צבעי כפתורים
  resetColor: "#667eea",
  randomColor: "#00b894",
  deleteColor: "#ff3366",
};

// אכיפת RTL
I18nManager.forceRTL(true);

const DevTools: React.FC<DevToolsProps> = ({
  user,
  onClearQuiz,
  onCreatePartialQuiz,
  onClearAllData,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const expandAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, expandAnim]);

  if (!__DEV__) return null;

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  const devActions = [
    {
      icon: "refresh",
      text: "איפוס שאלון",
      color: devColors.resetColor,
      onPress: onClearQuiz,
    },
    {
      icon: "shuffle",
      text: "החלפת תוכנית (אקראי)",
      color: devColors.randomColor,
      onPress: onCreatePartialQuiz,
    },
    {
      icon: "trash",
      text: "מחיקת כל הנתונים",
      color: devColors.deleteColor,
      onPress: onClearAllData,
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="construct" size={18} color={devColors.headerIcon} />
          </View>
          <Text style={styles.headerText}>כלי פיתוח</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DEV</Text>
          </View>
        </View>
        <Animated.View
          style={{
            transform: [
              {
                rotate: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name="chevron-down"
            size={20}
            color={devColors.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.buttonsContainer,
          {
            maxHeight: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 300],
            }),
            opacity: expandAnim,
          },
        ]}
      >
        <View style={styles.divider} />

        {devActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.devButton}
            onPress={() => handlePress(action.onPress)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.buttonIcon,
                { backgroundColor: `${action.color}15` },
              ]}
            >
              <Ionicons
                name={action.icon as any}
                size={20}
                color={action.color}
              />
            </View>
            <Text style={styles.buttonText}>{action.text}</Text>
            <Ionicons
              name="chevron-back"
              size={16}
              color={devColors.textSecondary}
            />
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Ionicons
            name="information-circle"
            size={14}
            color={devColors.textSecondary}
          />
          <Text style={styles.footerText}>
            משתמש: {user.name} ({user.id.substring(0, 8)}...)
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: devColors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: devColors.cardBorder,
    overflow: "hidden",
    marginTop: 20,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${devColors.headerIcon}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: devColors.text,
  },
  badge: {
    backgroundColor: devColors.headerIcon,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000",
  },
  buttonsContainer: {
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: devColors.cardBorder,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  devButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 16,
    paddingVertical: 14,
    backgroundColor: devColors.buttonBackground,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: devColors.buttonBorder,
  },
  buttonIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  buttonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: devColors.text,
  },
  footer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: devColors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});

export default DevTools;
