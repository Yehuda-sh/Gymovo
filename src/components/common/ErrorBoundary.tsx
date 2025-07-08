// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { colors } from "../../theme/colors";

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

      // console.log('Would send to error service:', errorData);
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
        <Text style={styles.errorMessage}>{error.toString()}</Text>
        {error.stack && (
          <View style={styles.stackContainer}>
            <Text style={styles.stackTitle}>Stack Trace:</Text>
            <Text style={styles.stackTrace}>{error.stack}</Text>
          </View>
        )}
        {errorInfo.componentStack && (
          <View style={styles.stackContainer}>
            <Text style={styles.stackTitle}>Component Stack:</Text>
            <Text style={styles.componentStack}>
              {errorInfo.componentStack}
            </Text>
          </View>
        )}
        <View style={styles.errorMetadata}>
          <Text style={styles.errorMetadataText}>
            זמן: {new Date().toLocaleString("he-IL")}
          </Text>
          <Text style={styles.errorMetadataText}>
            מספר שגיאות: {this.state.errorCount}
          </Text>
          <Text style={styles.errorMetadataText}>
            נסיונות חוזרים: {this.state.retryCount}
          </Text>
        </View>
      </ScrollView>
    );
  };

  render() {
    const { hasError, isRetrying } = this.state;
    const {
      fallback,
      children,
      customTitle,
      customMessage,
      showDetails,
      allowRetry,
    } = this.props;

    if (hasError) {
      // אם יש fallback component מותאם אישית
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="warning-outline" size={80} color={colors.error} />
            </View>

            <Text style={styles.title}>
              {customTitle || "אופס! משהו השתבש"}
            </Text>
            <Text style={styles.message}>
              {customMessage ||
                "התרחשה שגיאה בלתי צפויה. אנחנו מצטערים על אי הנוחות."}
            </Text>

            {/* כפתורי פעולה */}
            <View style={styles.actionButtons}>
              {allowRetry && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    isRetrying && styles.disabledButton,
                  ]}
                  onPress={this.handleRetry}
                  disabled={isRetrying}
                  activeOpacity={0.8}
                >
                  {isRetrying ? (
                    <Text style={styles.buttonText}>מנסה מחדש...</Text>
                  ) : (
                    <>
                      <Ionicons name="refresh-outline" size={20} color="#fff" />
                      <Text style={styles.buttonText}>נסה שוב</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleReload}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="reload-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.secondaryButtonText}>רענן אפליקציה</Text>
              </TouchableOpacity>
            </View>

            {/* הצגת פרטי שגיאה בסביבת פיתוח */}
            {__DEV__ && showDetails && (
              <TouchableOpacity
                style={styles.detailsToggle}
                onPress={this.toggleErrorDetails}
              >
                <Text style={styles.detailsToggleText}>
                  {this.state.showErrorDetails
                    ? "הסתר פרטי שגיאה"
                    : "הצג פרטי שגיאה"}
                </Text>
                <Ionicons
                  name={
                    this.state.showErrorDetails ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}

            {__DEV__ &&
              showDetails &&
              this.state.showErrorDetails &&
              this.renderErrorDetails()}

            {/* מידע למפתחים */}
            {__DEV__ && (
              <View style={styles.devInfo}>
                <Ionicons name="bug-outline" size={16} color="#FF8C00" />
                <Text style={styles.devInfoText}>
                  מצב Development - פרטי השגיאה גלויים
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionButtons: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  detailsToggleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorDetailsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: "100%",
    maxHeight: 300,
  },
  errorDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  errorDetailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.error,
  },
  copyButton: {
    padding: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  stackContainer: {
    marginTop: 12,
  },
  stackTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  stackTrace: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 14,
  },
  componentStack: {
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
