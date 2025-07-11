// src/screens/profile/user/types/index.ts
// טיפוסים עבור רכיבי מסך פרופיל משתמש

import { QuizAnswers } from "../../../../services/planGenerator";
import { QuizProgress } from "../../../../services/quizProgressService";
import { User } from "../../../../types/user";

export interface ProfileHeaderProps {
  user: User;
  getInitials: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export interface QuizStatusCardProps {
  userId: string;
  onResumeQuiz: (progress: QuizProgress) => void;
  onStartNewQuiz: () => void;
  refreshTrigger?: number; // טריגר לרענון הנתונים
}

export interface QuizResultsViewProps {
  answers: Partial<QuizAnswers>;
  completedAt?: string;
  onViewPlans: () => void;
  onRetakeQuiz: () => void;
}

export interface QuickActionsProps {
  onSettingsPress: () => void;
  onGuidesPress: () => void;
  onSupportPress: () => void;
}

export interface AccountActionsProps {
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export interface DevToolsProps {
  user: User;
  onClearQuiz: () => void;
  onCreatePartialQuiz: () => void;
  onClearAllData: () => void;
}

export interface ProfileDataHook {
  user: User | null;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleStartQuiz: () => void;
  handleResumeQuiz: (progress: QuizProgress) => void;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
  getInitials: string;
  handleClearQuiz: () => void;
  handleCreatePartialQuiz: () => void;
  handleClearAllData: () => void;
}

export interface ProfileAnimationsHook {
  fadeAnim: any;
  slideAnim: any;
}
