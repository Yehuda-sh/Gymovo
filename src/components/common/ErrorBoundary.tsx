// src/components/common/ErrorBoundary.tsx - ✅ רכיב מקיף לטיפול בשגיאות עם כל הפיצ'רים

import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import Button from "./Button";

const { width } = Dimensions.get("window");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  enableReload?: boolean;
  customMessage?: string;
  customTitle?: string;
  allowRetry?: boolean;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showErrorDetails: boolean;
  isRetrying: boolean;
  errorCount: number;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showErrorDetails: false,
      isRetrying: false,
      errorCount: 0,
      retryCount: 0,
    };
  }

  static defaultProps = {
    showDetails: true,
    enableReload: true,
    allowRetry: true,
    maxRetries: 3,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // לוג לקונסול בסביבת פיתוח
    if (__DEV__) {
      console.error("🚨 ErrorBoundary caught an error:", error, errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
    }

    // קריאה ל-callback אם קיים
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // שמירת מידע על השגיאה
    this.setState({
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    // לוג לשירות monitoring בסביבת production
    if (!__DEV__) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // כאן אפשר להוסיף שליחה ל-Sentry, Bugsnag וכו'
    try {
      const errorData = {
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
        version: Platform.Version,
      };

      // console.log("Would send to error service:", errorData);
      // Sentry.captureException(error, { extra: errorData });
    } catch (e) {
      console.error("Failed to log error to service:", e);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showErrorDetails: false,
      isRetrying: false,
      retryCount: 0,
    });
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount >= maxRetries) {
      Alert.alert(
        "מגבלת נסיונות",
        `ניסינו ${maxRetries} פעמים ללא הצלחה. אנא נסה לסגור ולפתוח את האפליקציה מחדש.`,
        [{ text: "אישור" }]
      );
      return;
    }

    this.setState(
      {
        retryCount: this.state.retryCount + 1,
        isRetrying: true,
      },
      () => {
        setTimeout(() => {
          this.handleReset();
        }, 500);
      }
    );
  };

  handleReload = async () => {
    this.setState({ isRetrying: true });

    try {
      // בדוק אם יש עדכונים זמינים
      if (this.props.enableReload) {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          } else {
            // אין עדכון - פשוט נסה לאפס
            setTimeout(() => {
              this.handleReset();
            }, 1000);
          }
        } catch {
          // אם Updates לא זמין (למשל ב-Expo Go), פשוט אפס
          setTimeout(() => {
            this.handleReset();
          }, 1000);
        }
      } else {
        setTimeout(() => {
          this.handleReset();
        }, 1000);
      }
    } catch (e) {
      Alert.alert(
        "שגיאה",
        "לא הצלחנו לרענן את האפליקציה. אנא נסה לסגור ולפתוח מחדש.",
        [{ text: "אישור" }]
      );
      this.setState({ isRetrying: false });
    }
  };

  toggleErrorDetails = () => {
    this.setState((prevState) => ({
      showErrorDetails: !prevState.showErrorDetails,
    }));
  };

  copyErrorToClipboard = () => {
    const { error, errorInfo } = this.state;
    if (!error) return;

    const errorText = `
Error: ${error.toString()}
Stack: ${error.stack}
Component Stack: ${errorInfo?.componentStack || "N/A"}
Time: ${new Date().toISOString()}
Platform: ${Platform.OS} ${Platform.Version}
    `.trim();

    // React Native doesn't have built-in clipboard API
    // You would need to install @react-native-clipboard/clipboard
    Alert.alert("העתקה", "פרטי השגיאה הוכנו להעתקה");
  };

  renderErrorDetails = () => {
    const { error, errorInfo } = this.state;
    if (!error || !errorInfo) return null;

    return (
      <ScrollView style={styles.errorDetailsContainer}>
        <View style={styles.errorDetailsHeader}>
          <Text style={styles.errorDetailsTitle}>פרטי השגיאה:</Text>
          <TouchableOpacity
            onPress={this.copyErrorToClipboard}
            style={styles.copyButton}
          >
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.errorSection}>
          <Text style={styles.errorSectionTitle}>הודעת שגיאה:</Text>
          <Text style={styles.errorMessage}>{error.toString()}</Text>
        </View>

        {error.stack && (
          <View style={styles.errorSection}>
            <Text style={styles.errorSectionTitle}>Stack Trace:</Text>
            <Text style={styles.errorStack}>{error.stack}</Text>
          </View>
        )}

        <View style={styles.errorSection}>
          <Text style={styles.errorSectionTitle}>Component Stack:</Text>
          <Text style={styles.errorStack}>{errorInfo.componentStack}</Text>
        </View>

        <View style={styles.errorMetadata}>
          <Text style={styles.errorMetadataText}>
            זמן: {new Date().toLocaleString("he-IL")}
          </Text>
          <Text style={styles.errorMetadataText}>
            פלטפורמה: {Platform.OS} {Platform.Version}
          </Text>
          <Text style={styles.errorMetadataText}>
            ניסיונות: {this.state.retryCount}/{this.props.maxRetries || 3}
          </Text>
        </View>
      </ScrollView>
    );
  };

  render() {
    if (this.state.hasError) {
      // אם יש fallback מותאם אישית
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const {
        customTitle,
        customMessage,
        allowRetry,
        maxRetries = 3,
      } = this.props;
      const { retryCount } = this.state;

      // ממשק ברירת מחדל
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            {/* אייקון שגיאה עם אנימציה */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name="alert-circle" size={80} color={colors.error} />
              </View>
            </View>

            {/* כותרת */}
            <Text style={styles.title}>
              {customTitle || "אופס! משהו השתבש"}
            </Text>

            {/* תיאור */}
            <Text style={styles.description}>
              {customMessage ||
                "נתקלנו בבעיה לא צפויה. אנחנו מצטערים על אי הנוחות."}
            </Text>

            {/* מידע על ניסיונות חוזרים */}
            {retryCount > 0 && (
              <Text style={styles.retryInfo}>
                ניסיון {retryCount} מתוך {maxRetries}
              </Text>
            )}

            {/* כפתורי פעולה */}
            <View style={styles.buttonsContainer}>
              {allowRetry && retryCount < (this.props.maxRetries || 3) && (
                <Button
                  title={this.state.isRetrying ? "מנסה שוב..." : "נסה שוב"}
                  onPress={this.handleRetry}
                  variant="primary"
                  disabled={this.state.isRetrying}
                  style={styles.retryButton}
                />
              )}

              <Button
                title="רענן אפליקציה"
                onPress={this.handleReload}
                variant="secondary"
                disabled={this.state.isRetrying}
                style={styles.reloadButton}
              />

              {this.props.showDetails !== false && (
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={this.toggleErrorDetails}
                >
                  <Text style={styles.detailsText}>
                    {this.state.showErrorDetails ? "הסתר" : "הצג"} פרטים טכניים
                  </Text>
                  <Ionicons
                    name={
                      this.state.showErrorDetails
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* פרטי שגיאה */}
            {this.state.showErrorDetails && this.renderErrorDetails()}

            {/* הודעה למפתחים */}
            {__DEV__ && (
              <View style={styles.devInfo}>
                <Ionicons name="construct" size={16} color="#FF8C00" />
                <Text style={styles.devInfoText}>
                  מצב פיתוח: שגיאה #{this.state.errorCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    maxWidth: 400,
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.error}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  retryInfo: {
    fontSize: 14,
    color: colors.warning,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
    marginTop: 16,
  },
  retryButton: {
    width: "100%",
  },
  reloadButton: {
    width: "100%",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
    alignSelf: "center",
  },
  detailsText: {
    color: colors.primary,
    fontSize: 14,
  },
  errorDetailsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    maxHeight: 300,
    width: "100%",
  },
  errorDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  errorDetailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  copyButton: {
    padding: 4,
  },
  errorSection: {
    marginBottom: 16,
  },
  errorSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: colors.error,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  errorStack: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 14,
  },
  errorMetadata: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  errorMetadataText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  devInfo: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  devInfoText: {
    fontSize: 12,
    color: "#FF8C00",
  },
});

// Hook לשימוש קל יותר
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// HOC לעטיפת רכיבים
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

export default ErrorBoundary;
