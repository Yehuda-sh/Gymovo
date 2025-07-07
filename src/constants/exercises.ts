// src/constants/exercises.ts - תיקון הטיפוסים

import { Exercise } from "../types/exercise";

export const exercises: Exercise[] = [
  // חזה
  {
    id: "ex1",
    name: "לחיצת חזה מישור",
    description: "תרגיל בסיסי לחיזוק שרירי החזה",
    category: "חזה",
    targetMuscleGroups: ["chest"],
    difficulty: "intermediate", // ✅ תיקון
    equipment: ["מוט"], // ✅ תיקון - מערך
    instructions: [
      // ✅ תיקון - רק מערך
      "שכב על הספסל עם הגב ישר",
      "אחוז את המוט ברוחב כתפיים",
      "הורד את המוט לחזה באופן שליט",
      "דחוף חזרה למעלה בכוח",
    ],
  },
  {
    id: "ex2",
    name: "שכיבות סמיכה",
    description: "תרגיל משקל גוף לחיזוק החזה",
    category: "חזה",
    targetMuscleGroups: ["chest"],
    difficulty: "beginner", // ✅ תיקון
    equipment: ["משקל גוף"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "התיצב במנח מישור",
      "ידיים ברוחב כתפיים",
      "שמור על הגב ישר",
      "רד עד שהחזה נוגע בקרקע",
    ],
  },

  // גב
  {
    id: "ex3",
    name: "משיכות לסנטר",
    description: "תרגיל מעולה לחיזוק הגב העליון",
    category: "גב",
    targetMuscleGroups: ["back"],
    difficulty: "advanced", // ✅ תיקון
    equipment: ["מוט משיכות"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "תלוי על מוט עם כפות פונות קדימה",
      "משוך את הגוף למעלה",
      "הסנטר צריך לגעת במוט",
      "רד באופן שליט",
    ],
  },
  {
    id: "ex4",
    name: "חתירה עם משקולות",
    description: "תרגיל חתירה לחיזוק שרירי הגב",
    category: "גב",
    targetMuscleGroups: ["back"],
    difficulty: "intermediate", // ✅ תיקון
    equipment: ["משקולות"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "כופף קלות את הברכיים",
      "נטה קדימה עם הגב ישר",
      "משוך את המשקולות לבטן",
      "שמור על הכתפיים יציבות",
    ],
  },

  // רגליים
  {
    id: "ex5",
    name: "סקוואט",
    description: "תרגיל הבסיס לחיזוק הרגליים",
    category: "רגליים",
    targetMuscleGroups: ["legs"],
    difficulty: "intermediate", // ✅ תיקון
    equipment: ["מוט"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "עמוד עם רגליים ברוחב כתפיים",
      "רד כאילו יושב על כיסא",
      "שמור על הגב ישר",
      "עלה חזרה למעלה",
    ],
  },
  {
    id: "ex6",
    name: "דדליפט",
    description: "תרגיל כוח מרכזי לכל הגוף",
    category: "רגליים",
    targetMuscleGroups: ["legs", "back"],
    difficulty: "advanced", // ✅ תיקון
    equipment: ["מוט"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "עמוד מול המוט",
      "כופף ברכיים ותפוס המוט",
      "הרם עם הרגליים והגב",
      "שמור על הגב ישר",
    ],
  },

  // כתפיים
  {
    id: "ex7",
    name: "לחיצת כתפיים",
    description: "תרגיל בסיסי לחיזוק הכתפיים",
    category: "כתפיים",
    targetMuscleGroups: ["shoulders"],
    difficulty: "intermediate", // ✅ תיקון
    equipment: ["משקולות"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "עמוד זקוף עם משקולות בידיים",
      "הרם את המשקולות מעל הראש",
      "רד באופן שליט",
      "שמור על הליבה מתוחה",
    ],
  },

  // זרועות
  {
    id: "ex8",
    name: "כפיפת זרועות",
    description: "תרגיל לחיזוק הביצפס",
    category: "זרועות",
    targetMuscleGroups: ["arms"],
    difficulty: "beginner", // ✅ תיקון
    equipment: ["משקולות"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "אחוז משקולות בידיים",
      "כופף את המרפקים",
      "הרם את המשקולות לכתפיים",
      "רד באופן שליט",
    ],
  },

  // ליבה
  {
    id: "ex9",
    name: "פלאנק",
    description: "תרגיל יציבות לחיזוק הליבה",
    category: "ליבה",
    targetMuscleGroups: ["core"],
    difficulty: "intermediate", // ✅ תיקון
    equipment: ["משקל גוף"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "התיצב במנח על המרפקים",
      "שמור על הגב ישר",
      "התאמץ עם שרירי הבטן",
      "החזק את המצב",
    ],
  },
  {
    id: "ex10",
    name: "כפיפות בטן",
    description: "תרגיל קלאסי לשרירי הבטן",
    category: "ליבה",
    targetMuscleGroups: ["core"],
    difficulty: "beginner", // ✅ תיקון
    equipment: ["משקל גוף"], // ✅ תיקון
    instructions: [
      // ✅ תיקון
      "שכב על הגב עם ברכיים כפופות",
      "ידיים מאחורי הראש",
      "הרם את הכתפיים מהקרקע",
      "רד באופן שליט",
    ],
  },
];
