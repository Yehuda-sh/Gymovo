// src/screens/plans/create-edit/types/index.ts
// ממשקים עבור מסך יצירה ועריכה של תוכנית אימון

import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../types/navigation';
import { Plan, PlanDay } from '../../../../types/plan';

// 🎯 נתיבי ניווט
export type ScreenRouteProp = RouteProp<RootStackParamList, 'CreateOrEditPlan'>;

// 📋 פרמטרים לפונקציית שמירה
export interface SavePlanParams {
  plan: Plan;
  isEdit: boolean;
  planId?: string;
}

// 🔄 מצב עורך התוכנית
export interface PlanEditorState {
  plan: Plan | null;
  isLoading: boolean;
  hasChanges: boolean;
  validationErrors: string[];
}

// 🎨 מאפיינים לכרטיס יום אימון
export interface DayCardProps {
  item: PlanDay;
  drag: () => void;
  isActive: boolean;
  onPress: () => void;
  isEditable: boolean;
}

// 📝 מאפיינים לטופס
export interface PlanFormProps {
  plan: Plan;
  onUpdateDetails: (details: Partial<Plan>) => void;
  validationErrors: string[];
}

// 📊 סטטיסטיקות תוכנית
export interface PlanStats {
  totalDays: number;
  totalExercises: number;
  estimatedDuration: number;
  difficulty: string;
} 