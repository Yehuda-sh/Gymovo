// src/components/common/ErrorBoundary.tsx - Error Boundary מתקדם עם דיווח ו-fallback UI

import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import { colors } from "../../theme/colors";
import Button from "./Button";
import Card from "./Card";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  enableReporting?: boolean;
  customErrorComponent?: React.ComponentType<ErrorBoundaryState>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  showDetails: boolean;
}

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Update state with error details
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service (e.g., Sentry, Bugsnag)
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Here you would integrate with your error reporting service
    // Example: Sentry, Bugsnag, Crashlytics, etc.

    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      errorCount: this.state.errorCount,
      timestamp: new Date().toISOString(),
      device: {
        platform: Platform.OS,
        version: Platform.Version,
        model: Constants.deviceName,
      },
      app: {
        version: Constants.expoConfig?.version,
        buildNumber:
          Constants.expoConfig?.ios?.buildNumber ||
          Constants.expoConfig?.android?.versionCode,
      },
    };

    // Log to console for now
    console.log("Error Report:", errorReport);

    // TODO: Send to your error tracking service
    // Example: Sentry.captureException(error, { extra: errorReport });
  };

  handleReset = async () => {
    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });

    // Optionally reload the app
    if (Updates.reloadAsync) {
      await Updates.reloadAsync();
    }
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom error component if provided
      if (this.props.customErrorComponent) {
        const CustomError = this.props.customErrorComponent;
        return <CustomError {...this.state} />;
      }

      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name="bug-outline" size={80} color={colors.error} />
              </View>
            </View>

            {/* Error Title */}
            <Text style={styles.title}>אופס! משהו השתבש</Text>

            {/* Error Message */}
            <Text style={styles.message}>
              נתקלנו בבעיה לא צפויה. אנחנו מצטערים על אי הנוחות.
            </Text>

            {/* Error Details Card */}
            {(this.props.showDetails !== false || __DEV__) && (
              <Card
                variant="outline"
                style={styles.errorCard}
                onPress={this.toggleDetails}
              >
                <View style={styles.errorHeader}>
                  <Text style={styles.errorTitle}>פרטי השגיאה</Text>
                  <Ionicons
                    name={
                      this.state.showDetails ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>

                {this.state.showDetails && (
                  <View style={styles.errorDetails}>
                    <Text style={styles.errorName}>
                      {this.state.error?.name || "Unknown Error"}
                    </Text>
                    <Text style={styles.errorMessage}>
                      {this.state.error?.message ||
                        "No error message available"}
                    </Text>

                    {__DEV__ && this.state.error?.stack && (
                      <ScrollView
                        style={styles.stackTrace}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        <Text style={styles.stackText}>
                          {this.state.error.stack}
                        </Text>
                      </ScrollView>
                    )}
                  </View>
                )}
              </Card>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button
                title="נסה שוב"
                onPress={this.handleReset}
                variant="primary"
                fullWidth
                iconName="refresh"
                size="large"
              />

              <Button
                title="חזור למסך הבית"
                onPress={() => {
                  // Navigate to home screen
                  // You would implement this based on your navigation setup
                  this.handleReset();
                }}
                variant="outline"
                fullWidth
                iconName="home"
                size="large"
                style={styles.secondaryButton}
              />
            </View>

            {/* Support Information */}
            <View style={styles.supportInfo}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.supportText}>
                אם הבעיה נמשכת, אנא צור קשר עם התמיכה שלנו
              </Text>
            </View>

            {/* Error Count (for debugging) */}
            {__DEV__ && this.state.errorCount > 1 && (
              <Text style={styles.errorCountText}>
                שגיאה מספר {this.state.errorCount}
              </Text>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

// Functional component for error fallback
export const ErrorFallback: React.FC<{
  error?: Error;
  resetError?: () => void;
}> = ({ error, resetError }) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Ionicons name="alert-circle" size={64} color={colors.error} />
      <Text style={styles.title}>משהו השתבש</Text>
      <Text style={styles.message}>{error?.message || "שגיאה לא ידועה"}</Text>
      {resetError && (
        <Button
          title="נסה שוב"
          onPress={resetError}
          variant="primary"
          style={styles.resetButton}
        />
      )}
    </View>
  </View>
);

// Hook for using error boundary
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = () => setError(null);

  const captureError = (error: Error) => {
    setError(error);
  };

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${colors.error}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  errorCard: {
    width: "100%",
    marginBottom: 32,
  },
  errorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  errorDetails: {
    marginTop: 16,
  },
  errorName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  stackTrace: {
    maxHeight: 200,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  stackText: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    width: "100%",
    marginBottom: 24,
  },
  secondaryButton: {
    marginTop: 12,
  },
  resetButton: {
    marginTop: 24,
  },
  supportInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  supportText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  errorCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 16,
    fontStyle: "italic",
  },
});

export default ErrorBoundary;
