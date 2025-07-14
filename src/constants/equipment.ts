// src/constants/equipment.ts
// 🏋️ קבועי ציוד לאימונים עם אייקונים וצבעים

import { colors } from "../theme/colors";

/**
 * 🎯 Equipment Type Definition
 */
export interface EquipmentType {
  id: string;
  name: string;
  nameEnglish: string;
  icon: string;
  color: string;
  description: string;
  category:
    | "free-weights"
    | "machines"
    | "bodyweight"
    | "cardio"
    | "accessories";
  wgerId?: number; // WGER API ID mapping
}

/**
 * 🏋️ Equipment Types
 * רשימת כל סוגי הציוד באפליקציה
 */
export const EQUIPMENT_TYPES: Record<string, EquipmentType> = {
  // משקולות חופשיות
  BARBELL: {
    id: "barbell",
    name: "מוט",
    nameEnglish: "Barbell",
    icon: "weight",
    color: colors.primary,
    description: "מוט ארוך עם משקולות בשני הצדדים",
    category: "free-weights",
    wgerId: 2,
  },
  DUMBBELL: {
    id: "dumbbell",
    name: "משקולת",
    nameEnglish: "Dumbbell",
    icon: "dumbbell",
    color: colors.accent,
    description: "משקולת יד בודדת",
    category: "free-weights",
    wgerId: 1,
  },
  KETTLEBELL: {
    id: "kettlebell",
    name: "קטלבל",
    nameEnglish: "Kettlebell",
    icon: "kettlebell",
    color: colors.accentOrange,
    description: "משקולת כדורית עם ידית",
    category: "free-weights",
    wgerId: 7,
  },
  EZ_BAR: {
    id: "ez-bar",
    name: "מוט EZ",
    nameEnglish: "EZ Bar",
    icon: "weight",
    color: colors.accentPurple,
    description: "מוט מעוקל לאימוני זרועות",
    category: "free-weights",
  },

  // משקל גוף
  BODYWEIGHT: {
    id: "bodyweight",
    name: "משקל גוף",
    nameEnglish: "Bodyweight",
    icon: "human",
    color: colors.success,
    description: "תרגילים ללא ציוד נוסף",
    category: "bodyweight",
    wgerId: 5,
  },
  PULL_UP_BAR: {
    id: "pull-up-bar",
    name: "מוט מתח",
    nameEnglish: "Pull-up Bar",
    icon: "arrow-up-bold",
    color: colors.info,
    description: "מוט למשיכות ומתח",
    category: "bodyweight",
  },
  PARALLEL_BARS: {
    id: "parallel-bars",
    name: "מקבילים",
    nameEnglish: "Parallel Bars",
    icon: "minus",
    color: colors.warning,
    description: "מוטות מקבילים לדיפים",
    category: "bodyweight",
  },

  // מכונות
  MACHINE: {
    id: "machine",
    name: "מכונה",
    nameEnglish: "Machine",
    icon: "cog",
    color: colors.secondary,
    description: "מכונת כושר עם מסלול קבוע",
    category: "machines",
    wgerId: 3,
  },
  CABLE: {
    id: "cable",
    name: "כבלים",
    nameEnglish: "Cable",
    icon: "vector-bezier",
    color: colors.primaryDark,
    description: "מכונת כבלים",
    category: "machines",
    wgerId: 4,
  },
  SMITH_MACHINE: {
    id: "smith-machine",
    name: "סמית",
    nameEnglish: "Smith Machine",
    icon: "grid",
    color: colors.accentBlue,
    description: "מכונת סמית עם מוט מונחה",
    category: "machines",
  },

  // אביזרים
  RESISTANCE_BAND: {
    id: "resistance-band",
    name: "גומיות",
    nameEnglish: "Resistance Band",
    icon: "rubber-stamp",
    color: colors.accentPink,
    description: "גומיות התנגדות",
    category: "accessories",
    wgerId: 8,
  },
  MEDICINE_BALL: {
    id: "medicine-ball",
    name: "כדור כוח",
    nameEnglish: "Medicine Ball",
    icon: "basketball",
    color: colors.dangerDark,
    description: "כדור כבד לאימונים",
    category: "accessories",
    wgerId: 6,
  },
  FOAM_ROLLER: {
    id: "foam-roller",
    name: "פומרולר",
    nameEnglish: "Foam Roller",
    icon: "cylinder",
    color: colors.infoDark,
    description: "גליל קצף לעיסוי עצמי",
    category: "accessories",
  },
  TRX: {
    id: "trx",
    name: "TRX",
    nameEnglish: "TRX",
    icon: "rope",
    color: colors.warningDark,
    description: "רצועות TRX",
    category: "accessories",
  },

  // קרדיו
  TREADMILL: {
    id: "treadmill",
    name: "הליכון",
    nameEnglish: "Treadmill",
    icon: "run",
    color: colors.exerciseCardio,
    description: "מכונת ריצה/הליכה",
    category: "cardio",
  },
  BIKE: {
    id: "bike",
    name: "אופניים",
    nameEnglish: "Bike",
    icon: "bike",
    color: colors.successDark,
    description: "אופני כושר",
    category: "cardio",
  },
  ROWER: {
    id: "rower",
    name: "חתירה",
    nameEnglish: "Rower",
    icon: "rowing",
    color: colors.primaryLight,
    description: "מכונת חתירה",
    category: "cardio",
  },
};

/**
 * 📦 Equipment Categories
 */
export const EQUIPMENT_CATEGORIES = {
  "free-weights": {
    name: "משקולות חופשיות",
    icon: "weight-lifter",
    equipment: ["barbell", "dumbbell", "kettlebell", "ez-bar"],
  },
  bodyweight: {
    name: "משקל גוף",
    icon: "human",
    equipment: ["bodyweight", "pull-up-bar", "parallel-bars"],
  },
  machines: {
    name: "מכונות",
    icon: "cog",
    equipment: ["machine", "cable", "smith-machine"],
  },
  accessories: {
    name: "אביזרים",
    icon: "bag-personal",
    equipment: ["resistance-band", "medicine-ball", "foam-roller", "trx"],
  },
  cardio: {
    name: "קרדיו",
    icon: "heart-pulse",
    equipment: ["treadmill", "bike", "rower"],
  },
};

/**
 * 🔧 Helper Functions
 */
export const equipmentHelpers = {
  // קבלת ציוד לפי ID
  getById: (id: string): EquipmentType | undefined => {
    return EQUIPMENT_TYPES[id.toUpperCase().replace("-", "_")];
  },

  // קבלת ציוד לפי קטגוריה
  getByCategory: (category: string): EquipmentType[] => {
    return Object.values(EQUIPMENT_TYPES).filter(
      (equipment) => equipment.category === category
    );
  },

  // קבלת ציוד לפי WGER ID
  getByWgerId: (wgerId: number): EquipmentType | undefined => {
    return Object.values(EQUIPMENT_TYPES).find(
      (equipment) => equipment.wgerId === wgerId
    );
  },

  // המרת רשימת IDs לרשימת ציוד
  getMultiple: (ids: string[]): EquipmentType[] => {
    return ids
      .map((id) => equipmentHelpers.getById(id))
      .filter(Boolean) as EquipmentType[];
  },

  // קבלת אייקון לפי ID
  getIcon: (id: string): string => {
    return equipmentHelpers.getById(id)?.icon || "help-circle";
  },

  // קבלת צבע לפי ID
  getColor: (id: string): string => {
    return equipmentHelpers.getById(id)?.color || colors.text;
  },

  // קבלת שם בעברית
  getName: (id: string): string => {
    return equipmentHelpers.getById(id)?.name || id;
  },

  // יצירת רשימה לבחירה
  getSelectOptions: () => {
    return Object.values(EQUIPMENT_TYPES).map((equipment) => ({
      value: equipment.id,
      label: equipment.name,
      icon: equipment.icon,
      color: equipment.color,
    }));
  },
};

/**
 * 🎯 Common Equipment Combinations
 * צירופי ציוד נפוצים לתרגילים
 */
export const EQUIPMENT_COMBOS = {
  HOME_BASIC: ["bodyweight", "resistance-band"],
  HOME_ADVANCED: ["bodyweight", "dumbbell", "resistance-band", "pull-up-bar"],
  GYM_BASIC: ["barbell", "dumbbell", "machine", "cable"],
  GYM_FULL: Object.keys(EQUIPMENT_TYPES).map((key) =>
    key.toLowerCase().replace("_", "-")
  ),
  CROSSFIT: ["barbell", "dumbbell", "kettlebell", "pull-up-bar", "bodyweight"],
};

// Type exports
export type EquipmentId = keyof typeof EQUIPMENT_TYPES;
export type EquipmentCategory = keyof typeof EQUIPMENT_CATEGORIES;
