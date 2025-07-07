// src/components/common/ErrorBoundary.tsx - Error Boundary מתקדם

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: (string | number)[];
  resetOnPropsChange?: boolean;
  isolate?: boolean; // אם true, לא יפיל את כל האפליקציה
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  showDetails: boolean;
  isRetrying: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      showDetails: false,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // עדכון state כדי שהרינדור הבא יציג fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log השגיאה
    console.error("🚨 ErrorBoundary caught an error:", error, errorInfo);

    // עדכון state עם פרטי השגיאה
    this.setState({
      errorInfo,
    });

    // Haptic feedback
    if (this.props.isolate !== true) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // קריאה לפונקציית callback אם קיימת
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // דיווח לשירות analytics (בעתיד)
    if (__DEV__) {
      console.group("🔍 Error Details:");
      console.error("Error:", error);
      console.error("Component Stack:", errorInfo.componentStack);
      console.error("Error Boundary Props:", this.props);
      console.groupEnd();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // בדיקה אם צריך לאפס על פי שינוי ב-resetKeys
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, i) => prevProps.resetKeys?.[i] !== key)) {
        this.resetErrorBoundary();
      }
    }

    // איפוס אוטומטי על שינוי בProps
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      isRetrying: false,
    });
  };

  handleRetry = () => {
    const { retryCount } = this.state;

    // הגבלת מספר ניסיונות
    if (retryCount >= 3) {
      Alert.alert(
        "יותר מדי ניסיונות",
        "האפליקציה נתקלת בשגיאה חוזרת. אנא צור קשר עם התמיכה.",
        [{ text: "הבנתי", style: "default" }]
      );
      return;
    }

    this.setState({
      isRetrying: true,
      retryCount: retryCount + 1,
    });

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // דחיית האיפוס כדי לתת למשתמש לראות שמשהו קורה
    this.resetTimeoutId = setTimeout(() => {
      this.resetErrorBoundary();
    }, 500) as any;
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  render() {
    const {
      hasError,
      error,
      errorInfo,
      errorId,
      retryCount,
      showDetails,
      isRetrying,
    } = this.state;
    const { children, fallback, isolate } = this.props;

    if (hasError) {
      // אם יש fallback מותאם אישית, השתמש בו
      if (fallback) {
        return fallback;
      }

      // UI ברירת מחדל לשגיאה
      return (
        <View style={[styles.container, isolate && styles.isolatedContainer]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* אייקון שגיאה */}
            <View style={styles.iconContainer}>
              <Ionicons
                name="warning-outline"
                size={isolate ? 32 : 48}
                color={colors.error}
              />
            </View>

            {/* כותרת השגיאה */}
            <Text style={[styles.title, isolate && styles.isolatedTitle]}>
              {isolate ? "שגיאה ברכיב" : "אופס! משהו השתבש"}
            </Text>

            {/* תיאור השגיאה */}
            <Text style={[styles.message, isolate && styles.isolatedMessage]}>
              {retryCount > 0
                ? `אירעה שגיאה חוזרת (ניסיון ${retryCount})`
                : isolate
                ? "רכיב זה נתקל בשגיאה."
                : "אירעה שגיאה בלתי צפויה. אנא נסה שוב."}
            </Text>

            {/* מזהה שגיאה */}
            {errorId && !isolate && (
              <Text style={styles.errorId}>
                מזהה שגיאה: {errorId.slice(-12)}
              </Text>
            )}

            {/* פרטי שגיאה למפתחים */}
            {showDetails && error && !isolate && (
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
                  isolate && styles.isolatedButton,
                ]}
                onPress={this.handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <Text style={styles.retryingText}>מנסה שוב...</Text>
                ) : (
                  <>
                    <Ionicons name="refresh" size={20} color="#ffffff" />
                    <Text style={styles.retryText}>נסה שוב</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* כפתור הצגת פרטים (רק במצב לא-isolate) */}
              {!isolate && (
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={this.toggleDetails}
                >
                  <Text style={styles.detailsText}>
                    {showDetails ? "הסתר פרטים" : "הצג פרטים"}
                  </Text>
                  <Ionicons
                    name={showDetails ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* מידע נוסף למפתחים */}
            {__DEV__ && !isolate && (
              <View style={styles.devInfo}>
                <Text style={styles.devInfoText}>
                  🔧 מצב פיתוח: ראה console לפרטים נוספים
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
  isolatedContainer: {
    minHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  isolatedTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  isolatedMessage: {
    fontSize: 14,
    marginBottom: 12,
  },
  errorId: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "monospace",
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: 6,
  },
  errorDetails: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    maxHeight: 200,
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
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  isolatedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryingButton: {
    backgroundColor: colors.textSecondary,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  retryingText: {
    color: "#ffffff",
    fontSize: 16,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  detailsText: {
    color: colors.primary,
    fontSize: 14,
  },
  devInfo: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
  },
  devInfoText: {
    fontSize: 12,
    color: "#FF8C00",
    textAlign: "center",
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
