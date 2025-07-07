// src/constants/muscleGroups.ts - Enhanced Muscle Groups System

// 🎯 Extended Muscle Group Interface
export interface MuscleGroup {
  id: string;
  name: string;
  hebrewName: string;
  englishName: string;
  category: "primary" | "secondary" | "stabilizer";
  bodyRegion: "upper" | "lower" | "core" | "full-body";
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string; // שם האיקון מ-Expo Vector Icons
  color: string; // צבע ייחודי לקבוצת השרירים
  description: string;
  commonExercises: string[]; // תרגילים נפוצים
  synergists: string[]; // שרירים מסייעים
  antagonists: string[]; // שרירים מנגדים
  imageUrl?: string; // לתמונות מ-Sora בעתיד
  restDays: number; // ימי מנוחה מומלצים
}

// 🎨 Color Palette לקבוצות שרירים
export const muscleGroupColors = {
  chest: "#FF6B6B", // אדום חם - לב חזק
  back: "#4ECDC4", // טורקיז - גב יציב
  legs: "#45B7D1", // כחול - כוח בסיסי
  shoulders: "#FFA726", // כתום - כוח פעיל
  biceps: "#66BB6A", // ירוק - צמיחה
  triceps: "#AB47BC", // סגול - הגדרה
  core: "#FFCA28", // צהוב - מרכז כוח
  calves: "#78909C", // אפור-כחול - יציבות
  glutes: "#FF7043", // כתום-אדום - כוח עוצמה
  forearms: "#8D6E63", // חום - אחיזה
  traps: "#5C6BC0", // כחול-סגול - יציבות עליונה
  lowerBack: "#FF8A65", // אדום בהיר - תמיכה
  cardio: "#EF5350", // אדום עז - לב פועם
  flexibility: "#26C6DA", // כחול בהיר - זרימה
} as const;

// 🏋️ קבוצות שרירים מפורטות
export const muscleGroups: MuscleGroup[] = [
  // 💪 Upper Body - חלק עליון
  {
    id: "chest",
    name: "חזה",
    hebrewName: "חזה",
    englishName: "Chest",
    category: "primary",
    bodyRegion: "upper",
    difficulty: "beginner",
    icon: "fitness-outline",
    color: muscleGroupColors.chest,
    description: "שרירי החזה האחראיים על דחיפה וחיבוק",
    commonExercises: ["לחיצת חזה", "שכיבות סמיכה", "דיפס", "פתיחות"],
    synergists: ["shoulders", "triceps"],
    antagonists: ["back"],
    restDays: 1,
  },
  {
    id: "back",
    name: "גב",
    hebrewName: "גב",
    englishName: "Back",
    category: "primary",
    bodyRegion: "upper",
    difficulty: "beginner",
    icon: "arrow-back-outline",
    color: muscleGroupColors.back,
    description: "שרירי הגב האחראיים על משיכה ויציבות עמוד השדרה",
    commonExercises: ["חתירה", "משיכות", "דדליפט", "שחיינות"],
    synergists: ["biceps", "traps"],
    antagonists: ["chest"],
    restDays: 1,
  },
  {
    id: "shoulders",
    name: "כתפיים",
    hebrewName: "כתפיים",
    englishName: "Shoulders",
    category: "primary",
    bodyRegion: "upper",
    difficulty: "intermediate",
    icon: "triangle-outline",
    color: muscleGroupColors.shoulders,
    description: "שרירי הכתף המורכבים משלושה ראשים",
    commonExercises: [
      "לחיצת כתפיים",
      "הרמות צידיות",
      "הרמות קדמיות",
      "שרואגים",
    ],
    synergists: ["triceps", "traps"],
    antagonists: ["back"],
    restDays: 1,
  },
  {
    id: "biceps",
    name: "יד קדמית",
    hebrewName: "דו-ראשי",
    englishName: "Biceps",
    category: "secondary",
    bodyRegion: "upper",
    difficulty: "beginner",
    icon: "fitness-outline",
    color: muscleGroupColors.biceps,
    description: "שריר הדו-ראשי האחראי על כיפוף המרפק",
    commonExercises: ["כפיפות מרפק", "פטיש", "כפיפות על כבל", "צ'ין-אפים"],
    synergists: ["back", "forearms"],
    antagonists: ["triceps"],
    restDays: 1,
  },
  {
    id: "triceps",
    name: "יד אחורית",
    hebrewName: "תלת-ראשי",
    englishName: "Triceps",
    category: "secondary",
    bodyRegion: "upper",
    difficulty: "beginner",
    icon: "remove-outline",
    color: muscleGroupColors.triceps,
    description: "שריר התלת-ראשי האחראי על פשיטת המרפק",
    commonExercises: ["דיפס", "פשיטות על כבל", "לחיצה צרה", "קיקבקס"],
    synergists: ["chest", "shoulders"],
    antagonists: ["biceps"],
    restDays: 1,
  },

  // 🦵 Lower Body - חלק תחתון
  {
    id: "legs",
    name: "רגליים",
    hebrewName: "רגליים",
    englishName: "Legs",
    category: "primary",
    bodyRegion: "lower",
    difficulty: "beginner",
    icon: "walk-outline",
    color: muscleGroupColors.legs,
    description: "קבוצת שרירי הרגליים כולל ירך וירכיים",
    commonExercises: ["סקוואט", "לחיצת רגליים", "פרפרים", "הדדליפט"],
    synergists: ["glutes", "calves"],
    antagonists: ["core"],
    restDays: 2,
  },
  {
    id: "glutes",
    name: "ישבן",
    hebrewName: "ישבן",
    englishName: "Glutes",
    category: "primary",
    bodyRegion: "lower",
    difficulty: "beginner",
    icon: "radio-button-on-outline",
    color: muscleGroupColors.glutes,
    description: "שרירי הישבן - החזקים בגוף",
    commonExercises: ["היפ תראסט", "דדליפט רומני", "סקוואט עמוק", "גשרים"],
    synergists: ["legs", "lowerBack"],
    antagonists: ["core"],
    restDays: 2,
  },
  {
    id: "calves",
    name: "שוקיים",
    hebrewName: "שוקיים",
    englishName: "Calves",
    category: "secondary",
    bodyRegion: "lower",
    difficulty: "beginner",
    icon: "trending-up-outline",
    color: muscleGroupColors.calves,
    description: "שרירי השוק האחראיים על הליכה וקפיצה",
    commonExercises: [
      "הרמות עקב",
      "הרמות עקב בישיבה",
      "קפיצות",
      "הליכה על קצות",
    ],
    synergists: ["legs"],
    antagonists: ["forearms"],
    restDays: 0,
  },

  // 🎯 Core & Stability
  {
    id: "core",
    name: "בטן וליבה",
    hebrewName: "ליבה",
    englishName: "Core",
    category: "primary",
    bodyRegion: "core",
    difficulty: "beginner",
    icon: "diamond-outline",
    color: muscleGroupColors.core,
    description: "שרירי הליבה האחראיים על יציבות ועוצמה",
    commonExercises: ["פלאנק", "קראנצ'ים", "רוסיאן טוויסט", "הרמת רגליים"],
    synergists: ["lowerBack"],
    antagonists: ["glutes", "legs"],
    restDays: 0,
  },
  {
    id: "lowerBack",
    name: "גב תחתון",
    hebrewName: "גב תחתון",
    englishName: "Lower Back",
    category: "stabilizer",
    bodyRegion: "core",
    difficulty: "intermediate",
    icon: "arrow-down-outline",
    color: muscleGroupColors.lowerBack,
    description: "שרירי הגב התחתון התומכים בעמוד השדרה",
    commonExercises: ["גוד מורנינג", "היפרקסטנשן", "ברד דוג", "סופרמן"],
    synergists: ["glutes", "core"],
    antagonists: ["core"],
    restDays: 2,
  },

  // 🔥 Specialized Groups
  {
    id: "traps",
    name: "טרפזים",
    hebrewName: "טרפזים",
    englishName: "Trapezius",
    category: "secondary",
    bodyRegion: "upper",
    difficulty: "intermediate",
    icon: "triangle-sharp",
    color: muscleGroupColors.traps,
    description: "שריר הטרפז האחראי על תנועות הכתף והצוואר",
    commonExercises: ["שרואגים", "אפרייט רו", "פייס פולס", "הרמות מאחור"],
    synergists: ["shoulders", "back"],
    antagonists: [],
    restDays: 1,
  },
  {
    id: "forearms",
    name: "אמה",
    hebrewName: "אמה",
    englishName: "Forearms",
    category: "secondary",
    bodyRegion: "upper",
    difficulty: "beginner",
    icon: "hand-left-outline",
    color: muscleGroupColors.forearms,
    description: "שרירי האמה האחראיים על כוח אחיזה",
    commonExercises: ["ריסט קרלס", "האמר קרלס", "אחיזת בר", "פארמר ווקס"],
    synergists: ["biceps"],
    antagonists: [],
    restDays: 0,
  },

  // 🏃 Cardio & Flexibility
  {
    id: "cardio",
    name: "קרדיו",
    hebrewName: "אירובי",
    englishName: "Cardio",
    category: "primary",
    bodyRegion: "full-body",
    difficulty: "beginner",
    icon: "heart-outline",
    color: muscleGroupColors.cardio,
    description: "אימון לב-ריאה לשיפור כושר אירובי",
    commonExercises: ["ריצה", "אופניים", "חבל קפיצה", "HIIT"],
    synergists: [],
    antagonists: [],
    restDays: 0,
  },
  {
    id: "flexibility",
    name: "גמישות",
    hebrewName: "גמישות",
    englishName: "Flexibility",
    category: "stabilizer",
    bodyRegion: "full-body",
    difficulty: "beginner",
    icon: "leaf-outline",
    color: muscleGroupColors.flexibility,
    description: "תרגילי מתיחה וגמישות",
    commonExercises: ["יוגה", "מתיחות", "פילאטיס", "פואם רולינג"],
    synergists: [],
    antagonists: [],
    restDays: 0,
  },
];

// 🔄 Muscle Group Categories
export const muscleGroupCategories = {
  primary: muscleGroups.filter((mg) => mg.category === "primary"),
  secondary: muscleGroups.filter((mg) => mg.category === "secondary"),
  stabilizer: muscleGroups.filter((mg) => mg.category === "stabilizer"),
  upper: muscleGroups.filter((mg) => mg.bodyRegion === "upper"),
  lower: muscleGroups.filter((mg) => mg.bodyRegion === "lower"),
  core: muscleGroups.filter((mg) => mg.bodyRegion === "core"),
  fullBody: muscleGroups.filter((mg) => mg.bodyRegion === "full-body"),
  beginner: muscleGroups.filter((mg) => mg.difficulty === "beginner"),
  intermediate: muscleGroups.filter((mg) => mg.difficulty === "intermediate"),
  advanced: muscleGroups.filter((mg) => mg.difficulty === "advanced"),
};

// 📊 Workout Split Templates
export const workoutSplits = {
  fullBody: {
    name: "גוף מלא",
    description: "אימון כל השרירים בכל אימון",
    frequency: 3,
    muscleGroups: ["chest", "back", "legs", "shoulders", "core"],
    difficulty: "beginner",
  },
  upperLower: {
    name: "עליון-תחתון",
    description: "חילוק בין חלק עליון לתחתון",
    frequency: 4,
    upper: ["chest", "back", "shoulders", "biceps", "triceps"],
    lower: ["legs", "glutes", "calves", "core"],
    difficulty: "intermediate",
  },
  pushPullLegs: {
    name: "דחיפה-משיכה-רגליים",
    description: "חלוקה לפי סוג התנועה",
    frequency: 6,
    push: ["chest", "shoulders", "triceps"],
    pull: ["back", "biceps", "traps"],
    legs: ["legs", "glutes", "calves", "core"],
    difficulty: "advanced",
  },
  bodyPart: {
    name: "חלק גוף יומי",
    description: "התמקדות בחלק גוף אחד ביום",
    frequency: 5,
    split: [
      ["chest", "triceps"],
      ["back", "biceps"],
      ["shoulders", "traps"],
      ["legs", "glutes"],
      ["core", "calves", "forearms"],
    ],
    difficulty: "advanced",
  },
};

// 🎯 Muscle Group Recovery Matrix
export const recoveryMatrix = {
  chest: ["triceps", "shoulders"],
  back: ["biceps", "traps"],
  legs: ["glutes", "calves"],
  shoulders: ["triceps", "traps"],
  biceps: ["forearms"],
  triceps: [],
  core: [],
  glutes: ["lowerBack"],
  calves: [],
  traps: [],
  forearms: [],
  lowerBack: ["glutes"],
  cardio: [],
  flexibility: [],
};

// 🛠️ Utility Functions
export const muscleGroupUtils = {
  // מציאת קבוצת שרירים לפי ID
  findById: (id: string): MuscleGroup | undefined => {
    return muscleGroups.find((mg) => mg.id === id);
  },

  // קבלת כל השרירים לפי אזור גוף
  getByBodyRegion: (region: MuscleGroup["bodyRegion"]): MuscleGroup[] => {
    return muscleGroups.filter((mg) => mg.bodyRegion === region);
  },

  // קבלת כל השרירים לפי רמת קושי
  getByDifficulty: (difficulty: MuscleGroup["difficulty"]): MuscleGroup[] => {
    return muscleGroups.filter((mg) => mg.difficulty === difficulty);
  },

  // בדיקה אם שני שרירים מתנגשים (זקוקים למנוחה)
  areConflicting: (muscle1: string, muscle2: string): boolean => {
    const mg1 = muscleGroups.find((mg) => mg.id === muscle1);
    const mg2 = muscleGroups.find((mg) => mg.id === muscle2);

    if (!mg1 || !mg2) return false;

    return (
      mg1.synergists.includes(muscle2) ||
      mg2.synergists.includes(muscle1) ||
      mg1.antagonists.includes(muscle2) ||
      mg2.antagonists.includes(muscle1)
    );
  },

  // קבלת המלצה לשרירים מסייעים
  getSynergists: (muscleId: string): MuscleGroup[] => {
    const muscle = muscleGroups.find((mg) => mg.id === muscleId);
    if (!muscle) return [];

    return muscle.synergists
      .map((id) => muscleGroups.find((mg) => mg.id === id))
      .filter(Boolean) as MuscleGroup[];
  },

  // יצירת סדר אימונים אופטימלי
  createOptimalSplit: (
    frequency: number,
    experience: "beginner" | "intermediate" | "advanced"
  ): string[][] => {
    if (frequency <= 3) return [["chest", "back", "legs", "shoulders", "core"]];
    if (frequency === 4)
      return [
        ["chest", "shoulders", "triceps"],
        ["back", "biceps"],
        ["legs", "glutes"],
        ["core", "calves", "forearms"],
      ];
    // Push-Pull-Legs split
    return [
      workoutSplits.pushPullLegs.push,
      workoutSplits.pushPullLegs.pull,
      workoutSplits.pushPullLegs.legs,
    ];
  },

  // המלצה לימי מנוחה
  getRestDayRecommendation: (muscleId: string): number => {
    const muscle = muscleGroups.find((mg) => mg.id === muscleId);
    return muscle?.restDays || 1;
  },
};

// 📱 UI Helpers
export const muscleGroupUIHelpers = {
  // קבלת צבע לפי ID
  getColor: (muscleId: string): string => {
    return (
      muscleGroupColors[muscleId as keyof typeof muscleGroupColors] || "#666"
    );
  },

  // קבלת אייקון לפי ID
  getIcon: (muscleId: string): string => {
    const muscle = muscleGroups.find((mg) => mg.id === muscleId);
    return muscle?.icon || "fitness-outline";
  },

  // קבלת שם בעברית
  getHebrewName: (muscleId: string): string => {
    const muscle = muscleGroups.find((mg) => mg.id === muscleId);
    return muscle?.hebrewName || muscleId;
  },

  // קבלת רשימה מסוננת לUI
  getFilteredForUI: (
    category?: MuscleGroup["category"],
    bodyRegion?: MuscleGroup["bodyRegion"],
    difficulty?: MuscleGroup["difficulty"]
  ): MuscleGroup[] => {
    let filtered = muscleGroups;

    if (category) filtered = filtered.filter((mg) => mg.category === category);
    if (bodyRegion)
      filtered = filtered.filter((mg) => mg.bodyRegion === bodyRegion);
    if (difficulty)
      filtered = filtered.filter((mg) => mg.difficulty === difficulty);

    return filtered;
  },
};

// 🎯 Export everything
export default {
  muscleGroups,
  muscleGroupColors,
  muscleGroupCategories,
  workoutSplits,
  recoveryMatrix,
  muscleGroupUtils,
  muscleGroupUIHelpers,
};
