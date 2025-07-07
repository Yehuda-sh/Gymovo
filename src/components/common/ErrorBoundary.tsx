// src/components/common/ErrorBoundary.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { Component, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  showDetails?: boolean; // להציג פרטי שגיאה גם בפרודקשן
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string; // מזהה ייחודי לשגיאה
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // רטט כדי להודיע למשתמש על הבעיה
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // בעתיד - שליחה לsentry או crashlytics
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    console.log("🔄 User requested retry for error:", this.state.errorId);
    this.setState({ hasError: false, error: undefined, errorId: undefined });

    // רטט קל לאישור
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  handleReportError = () => {
    // בעתיד - פתיחת מסך דיווח שגיאה או שליחת מייל
    console.log("📧 User wants to report error:", this.state.errorId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const showDetails = this.props.showDetails || __DEV__;

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Ionicons
              name="warning-outline"
              size={64}
              color={colors.danger}
              style={styles.icon}
            />
            <Text style={styles.title}>אופס! משהו השתבש</Text>
            <Text style={styles.subtitle}>
              אירעה שגיאה בלתי צפויה. אנא נסה שוב.
            </Text>

            {this.state.errorId && (
              <Text style={styles.errorId}>
                מזהה שגיאה: {this.state.errorId.slice(-8)}
              </Text>
            )}

            {showDetails && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>פרטי השגיאה (למפתחים):</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={this.handleRetry}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retryText}>נסה שוב</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportButton}
                onPress={this.handleReportError}
              >
                <Ionicons
                  name="bug-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={styles.reportText}>דווח על בעיה</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  errorId: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  errorDetails: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "monospace",
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
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
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
    borderColor: colors.border,
    gap: 8,
  },
  reportText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
