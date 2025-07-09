// src/screens/auth/quiz/data/questions.ts - נתוני השאלות של השאלון

import { QuizQuestion } from "../types";

// נתוני השאלות עם אפשרויות מותאמות
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "goal",
    text: "מה המטרה העיקרית שלך?",
    icon: "trophy",
    multiSelect: false,
    options: [
      {
        text: "בניית שריר ומסה",
        value: "hypertrophy",
        icon: "fitness",
        color: "#E74C3C",
      },
      {
        text: "ירידה במשקל",
        value: "weight_loss",
        icon: "trending-down",
        color: "#3498DB",
      },
      {
        text: "בניית כוח",
        value: "strength",
        icon: "barbell",
        color: "#9B59B6",
      },
      {
        text: "שיפור סיבולת",
        value: "endurance",
        icon: "heart",
        color: "#E67E22",
      },
    ],
    next: "experience",
  },
  {
    id: "experience",
    text: "מה רמת הניסיון שלך באימונים?",
    icon: "school",
    multiSelect: false,
    options: [
      {
        text: "מתחיל (0-6 חודשים)",
        value: "beginner",
        icon: "leaf",
        color: "#27AE60",
      },
      {
        text: "בינוני (6 חודשים - 2 שנים)",
        value: "intermediate",
        icon: "trending-up",
        color: "#F39C12",
      },
      {
        text: "מתקדם (2+ שנים)",
        value: "advanced",
        icon: "trophy",
        color: "#8E44AD",
      },
    ],
    next: "equipment",
  },
  {
    id: "equipment",
    text: "איזה ציוד זמין לך?",
    icon: "hardware-chip",
    multiSelect: true,
    options: [
      {
        text: "חדר כושר מלא",
        value: "gym",
        icon: "business",
        color: "#2C3E50",
      },
      {
        text: "משקולות בבית",
        value: "dumbbells",
        icon: "barbell",
        color: "#34495E",
      },
      {
        text: "רק משקל גוף",
        value: "bodyweight",
        icon: "person",
        color: "#16A085",
      },
      {
        text: "ציוד מינימלי",
        value: "minimal",
        icon: "ellipse",
        color: "#7F8C8D",
      },
    ],
    next: "days",
  },
  {
    id: "days",
    text: "כמה ימים בשבוע תוכל להתאמן?",
    icon: "calendar",
    multiSelect: false,
    options: [
      { text: "2-3 ימים", value: 3, icon: "calendar", color: "#3498DB" },
      { text: "4-5 ימים", value: 4, icon: "calendar", color: "#E67E22" },
      { text: "6+ ימים", value: 6, icon: "calendar", color: "#E74C3C" },
    ],
    next: null,
  },
];

export default QUIZ_QUESTIONS;
