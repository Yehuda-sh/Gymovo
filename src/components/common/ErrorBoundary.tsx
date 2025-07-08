// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // כאן תוכל להוסיף לוגינג לשירות חיצוני כמו Sentry
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // אם יש לך שירות אנליטיקס:
    // analytics.logError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Ionicons name="warning-outline" size={64} color={colors.error} />

            <Text style={styles.title}>אופס! משהו השתבש</Text>
            <Text style={styles.message}>
              התרחשה שגיאה בלתי צפויה. אנחנו מצטערים על אי הנוחות.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>
                  פרטי השגיאה (Development):
                </Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>נסה שוב</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => {
                // כאן תוכל להוסיף ניווט למסך הבית
                this.handleReset();
              }}
            >
              <Text style={styles.homeButtonText}>חזור למסך הבית</Text>
            </TouchableOpacity>
          </ScrollView>
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
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: "100%",
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.error,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: "monospace",
  },
  stackTrace: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: "monospace",
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  homeButtonText: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default ErrorBoundary;

// Hook לשימוש ב-Error Boundary
export const useErrorHandler = () => {
  return (error: Error) => {
    throw error;
  };
};
