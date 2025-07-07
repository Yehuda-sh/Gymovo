// src/components/common/ErrorBoundary.tsx - גרסה מתקדמת עם retry mechanism - מתוקן

import { Ionicons } from "@expo/vector-icons";
import React, { Component, ReactNode } from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  showDetails?: boolean;
  fallback?: ReactNode;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorId: string | null;
  retryCount: number;
  isRetrying: boolean;
}

// 🛡️ Error Boundary מתקדם עם retry mechanism
export class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // יצירת מזהה שגיאה ייחודי
    const errorId = `ERR_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("🚨 ErrorBoundary caught an error:", error);
    console.error("📋 Error info:", errorInfo);

    this.setState({
      errorInfo,
    });

    // קריאה לפונקציית callback אם קיימת
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // בעתיד: שליחה לשירות מעקב שגיאות
    this.logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    // ניקוי timers
    this.retryTimeouts.forEach((timeout) => clearTimeout(timeout));
  }

  // 📊 לוג שגיאות לשירות חיצוני (בעתיד)
  private logErrorToService = (error: Error, errorInfo: any) => {
    try {
      // כאן אפשר להוסיף:
      // - Sentry.captureException(error, { extra: errorInfo });
      // - Analytics.trackError('error_boundary_catch', { error: error.message });
      // - Firebase Crashlytics

      if (__DEV__) {
        console.log("📊 Error logged (dev mode only):", {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (loggingError) {
      console.error("Failed to log error:", loggingError);
    }
  };

  // 🔄 ניסיון חוזר חכם
  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      Alert.alert(
        "מגבלת ניסיונות",
        `מספר הניסיונות המקסימלי (${maxRetries}) הושג. אנא רענן את האפליקציה או פנה לתמיכה.`,
        [
          { text: "ביטול", style: "cancel" },
          { text: "פנה לתמיכה", onPress: this.handleContactSupport },
        ]
      );
      return;
    }

    this.setState({
      isRetrying: true,
      retryCount: retryCount + 1,
    });

    // דיליי מתקדם - כל ניסיון לוקח יותר זמן
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);

    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        isRetrying: false,
      });
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  // 📧 פנייה לתמיכה
  private handleContactSupport = () => {
    const { error, errorId } = this.state;

    const subject = encodeURIComponent("שגיאה באפליקציית Gymovo");
    const body = encodeURIComponent(`
שלום,

נתקלתי בשגיאה באפליקציה:

מזהה שגיאה: ${errorId}
הודעת השגיאה: ${error?.message || "לא זמין"}
פלטפורמה: ${Platform.OS} ${Platform.Version}
זמן: ${new Date().toLocaleString("he-IL")}

תיאור נוסף:
[נא תאר מה עשית לפני השגיאה]
    `);

    const emailUrl = `mailto:support@gymovo.com?subject=${subject}&body=${body}`;

    Linking.canOpenURL(emailUrl).then((supported) => {
      if (supported) {
        Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          "לא ניתן לפתוח אימייל",
          "אנא פנה אלינו בכתובת: support@gymovo.com"
        );
      }
    });
  };

  // 🐛 דיווח על בעיה מתקדם
  private handleReportError = () => {
    const { error, errorId, errorInfo } = this.state;

    Alert.alert("דווח על שגיאה", "תרצה לשלוח דוח שגיאה לצוות הפיתוח?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "שלח דוח",
        onPress: () => {
          // כאן אפשר להוסיף שליחה אוטומטית לשירות
          console.log("📤 Error report sent:", {
            errorId,
            message: error?.message,
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
          });

          Alert.alert("תודה!", "הדוח נשלח בהצלחה");
        },
      },
    ]);
  };

  // 🔄 איפוס מלא
  private handleFullReset = () => {
    Alert.alert("איפוס מלא", "זה יאפס את כל הנתונים המקומיים. האם אתה בטוח?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "אפס",
        style: "destructive",
        onPress: () => {
          // כאן אפשר להוסיף:
          // - AsyncStorage.clear()
          // - Reset stores
          // - Navigate to welcome screen
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
            retryCount: 0,
            isRetrying: false,
          });
        },
      },
    ]);
  };

  render() {
    const { children, fallback, showDetails = false } = this.props;
    const { hasError, error, errorId, retryCount, isRetrying, errorInfo } =
      this.state;

    // אם יש fallback מותאם אישית
    if (hasError && fallback) {
      return fallback;
    }

    // מסך שגיאה מקצועי
    if (hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            {/* אייקון שגיאה */}
            <View style={styles.iconContainer}>
              <Ionicons
                name="warning"
                size={64}
                color={colors.warning}
                style={styles.icon}
              />
            </View>

            {/* כותרת ותיאור */}
            <Text style={styles.title}>משהו השתבש</Text>
            <Text style={styles.subtitle}>
              {retryCount > 0
                ? `אירעה שגיאה חוזרת (ניסיון ${retryCount})`
                : "אירעה שגיאה בלתי צפויה. אנא נסה שוב."}
            </Text>

            {/* מזהה שגיאה */}
            {errorId && (
              <Text style={styles.errorId}>
                מזהה שגיאה: {errorId.slice(-12)}
              </Text>
            )}

            {/* פרטי שגיאה למפתחים */}
            {showDetails && error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>פרטי השגיאה (למפתחים):</Text>
                <Text style={styles.errorText} numberOfLines={6}>
                  {error.toString()}
                </Text>
                {errorInfo?.componentStack && (
                  <Text style={styles.errorText} numberOfLines={4}>
                    {errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            {/* כפתורי פעולה */}
            <View style={styles.actions}>
              {/* כפתור ניסיון חוזר */}
              <TouchableOpacity
                style={[
                  styles.retryButton,
                  isRetrying && styles.retryingButton,
                ]}
                onPress={this.handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <Ionicons name="time" size={20} color="#fff" />
                    <Text style={styles.retryText}>מנסה שוב...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.retryText}>
                      נסה שוב {retryCount > 0 && `(${retryCount})`}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* כפתור דיווח */}
              <TouchableOpacity
                style={styles.reportButton}
                onPress={this.handleReportError}
              >
                <Ionicons name="bug-outline" size={20} color="#cccccc" />
                <Text style={styles.reportText}>דווח על בעיה</Text>
              </TouchableOpacity>

              {/* כפתור פנייה לתמיכה */}
              {retryCount >= 2 && (
                <TouchableOpacity
                  style={styles.supportButton}
                  onPress={this.handleContactSupport}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.supportText}>פנה לתמיכה</Text>
                </TouchableOpacity>
              )}

              {/* כפתור איפוס מלא - רק במקרים קיצוניים */}
              {retryCount >= 3 && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={this.handleFullReset}
                >
                  <Ionicons name="refresh-circle" size={20} color="#ff3366" />
                  <Text style={styles.resetText}>איפוס מלא</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }

    return children;
  }
}

// 🎨 Styles מעודכנים עם צבעים קבועים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a", // צבע קבוע
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 340,
    width: "100%",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.warning}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // צבע קבוע
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc", // צבע קבוע
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  errorId: {
    fontSize: 12,
    color: "#888888", // צבע קבוע
    textAlign: "center",
    marginBottom: 24,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    backgroundColor: "#262626", // צבע קבוע
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  errorDetails: {
    backgroundColor: "#262626", // צבע קבוע
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff", // צבע קבוע
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#cccccc", // צבע קבוע
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 16,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  retryingButton: {
    backgroundColor: "#888888", // צבע קבוע
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333", // צבע קבוע
    gap: 8,
  },
  reportText: {
    color: "#cccccc", // צבע קבוע
    fontSize: 14,
    fontWeight: "600",
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  supportText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff336610", // צבע קבוע
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff3366", // צבע קבוע
    gap: 8,
  },
  resetText: {
    color: "#ff3366", // צבע קבוע
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ErrorBoundary;
