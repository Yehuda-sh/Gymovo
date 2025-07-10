# שיטת רפקטורינג לקבצים גדולים - Gymovo

## עקרונות יסוד

### 1. מגבלת גודל קובץ

- **מקסימום 200 שורות לקובץ** (לפי העדפת המשתמש למניעת תגובות AI איטיות)
- **מינימום ארגון הגיוני** (לא לפצל יותר מדי כדי לא ליצור בלגן)

### 2. שמירה על תאימות לאחור (Backward Compatibility)

- כל export קיים חייב להמשיך לעבוד
- אין שינוי בממשקים חיצוניים (APIs)
- imports קיימים ממשיכים לעבוד ללא שינוי

### 3. חלוקה לפי תחומי אחריות (Separation of Concerns)

- כל מודול מטפל בתחום אחד ספציפי
- הפרדה ברורה בין פונקציונליות שונות
- מיקוד בעקרון Single Responsibility

## תהליך הרפקטורינג (4 שלבים)

### שלב 0: בדיקת צורך בקובץ ⚠️ **חדש!**
**לפני כל רפקטורינג - לבדוק אם הקובץ נחוץ כלל!**

```bash
# בדיקת שימוש בקובץ
grep -r "import.*[FileName]" src/
grep -r "from.*[FileName]" src/
grep -r "[ComponentName]" src/

# דוגמה: WorkoutFilterModal
grep -r "WorkoutFilterModal" src/
```

**סימנים לקובץ מיותר:**
- ✅ אין imports לקובץ
- ✅ יש קבצים דומים עם אותה פונקציונליות
- ✅ הקובץ לא משומש בפועל ברכיבים אחרים

**פעולות:**
1. 🔍 חפש כל הפניות לקובץ
2. 📋 בדוק אם יש כפילויות
3. 🗑️ מחק קבצים מיותרים לפני רפקטורינג
4. ✅ ודא שלא נשברו imports

### שלב 1: ניתוח וזיהוי אזורים

```typescript
// דוגמה: designSystem.ts (515 שורות)
// זיהיו 9 אזורים:
1. מערכת רווחים (spacing)
2. טיפוגרפיה (typography)
3. צללים (shadows)
4. אנימציות (animations)
5. רכיבים (components)
6. טוקנים בסיסיים (tokens)
7. צבעי סטטוס (status)
8. טוקנים לכושר (fitness)
9. פונקציות עזר (helpers)
```

### שלב 2: יצירת מבנה מודולרי

```
src/theme/design/
├── spacing/index.ts          (מערכת רווחים)
├── typography/index.ts       (טיפוגרפיה)
├── shadows/index.ts          (צללים)
├── animations/index.ts       (אנימציות)
├── components/index.ts       (סגנונות רכיבים)
├── tokens/index.ts           (טוקנים בסיסיים)
├── status/index.ts           (צבעי סטטוס)
├── fitness/index.ts          (טוקנים לכושר)
└── index.ts                  (נקודת כניסה מרכזית)
```

### שלב 3: יצירת נקודת כניסה מרכזית

```typescript
// design/index.ts - מרכז הכל
export * from "./spacing";
export * from "./typography";
// ... etc

// אובייקט מרכזי
export const designSystem = {
  spacing,
  typography,
  shadows,
  // ... etc
};

// פונקציות עזר
export const helpers = {
  getSpacing,
  getTypography,
  getShadow,
  // ... etc
};
```

## דוגמאות מעשיות

### 1. networkUtils.ts (252 → 7 מודולים)

**לפני:**

```
networkUtils.ts (252 שורות) - כל הפונקציונליות ביחד
```

**אחרי:**

```
src/utils/network/
├── types/index.ts           (Interfaces)
├── connection/index.ts      (בדיקת חיבור)
├── retry/index.ts           (לוגיקת retry)
├── api/index.ts             (קריאות API)
├── hooks/index.ts           (React hooks)
├── errors/index.ts          (טיפול בשגיאות)
├── cancelable/index.ts      (ביטול בקשות)
└── index.ts                 (20 שורות - re-exports)
```

### 2. designSystem.ts (515 → 8 מודולים)

**פירוט המודולים:**

#### spacing/index.ts (~150 שורות)

```typescript
// מערכת רווחים מבוססת 8px
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const componentSpacing = {
  button: { padding: 16, margin: 8 },
  card: { padding: 16, margin: 8 },
};

export const getSpacing = (size: keyof typeof spacing) => spacing[size];
export const getCustomSpacing = (multiplier: number) => multiplier * 8;
export const calculateGridItemWidth = (columns: number, padding: number) => {
  return (Dimensions.get("window").width - padding * (columns + 1)) / columns;
};
```

#### typography/index.ts (~180 שורות)

```typescript
// מערכת טיפוגרפיה מלאה
export const typography = {
  h1: { fontSize: 32, fontWeight: "bold", lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: "bold", lineHeight: 36 },
  // ... 13 סוגי פונטים
};

export const fitnessTypography = {
  exerciseName: { fontSize: 18, fontWeight: "600" },
  setCount: { fontSize: 16, fontWeight: "500" },
};

export const getTypography = (variant: string) => typography[variant];
export const createTypographyStyle = (variant: string, overrides: object) => ({
  ...typography[variant],
  ...overrides,
});
```

#### shadows/index.ts (~120 שורות)

```typescript
// מערכת צללים 6 רמות
export const shadows = {
  none: { shadowOpacity: 0 },
  xs: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1 },
  sm: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  // ... עד xl
};

export const componentShadows = {
  card: shadows.sm,
  modal: shadows.lg,
  button: shadows.xs
};

export const getShadow = (level: string) => shadows[level];
export const createCustomShadow = (config: ShadowConfig) => ({ ... });
```

## עקרונות TypeScript

### 1. טיפוסים מלאים

```typescript
// כל מודול כולל interfaces
interface SpacingConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface TypographyVariant {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing?: number;
}
```

### 2. פונקציות עזר מוטיפסות

```typescript
export const getSpacing = (size: keyof typeof spacing): number => spacing[size];
export const getTypography = (
  variant: keyof typeof typography
): TypographyVariant => typography[variant];
```

### 3. as const לקבוצים

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  // ...
} as const;
```

## תיעוד בעברית

### 1. הערות מסבירות

```typescript
/**
 * מערכת רווחים מבוססת 8px grid
 * כל הרווחים הם כפולות של 8 לעקביות מקסימלית
 */
export const spacing = { ... };

/**
 * חישוב רוחב פריט ברשת
 * @param columns מספר עמודות
 * @param padding רווח בין פריטים
 * @returns רוחב פריט בפיקסלים
 */
export const calculateGridItemWidth = (columns: number, padding: number): number => {
  // ...
};
```

### 2. שמות משתנים בעברית במקום המתאים

```typescript
// קבוצות צבעים עם שמות בעברית
export const difficultyColors = {
  קל: "#4ADE80", // ירוק
  בינוני: "#FBBF24", // צהוב
  קשה: "#F87171", // אדום
  מתקדם: "#8B5CF6", // סגול
};
```

## יתרונות השיטה

### 1. ביצועים

- קריאה מהירה של קבצים קטנים
- טעינה חלקית (lazy loading) אפשרית
- AI response מהיר יותר

### 2. תחזוקה

- קל למצוא קוד ספציפי
- שינויים מקומיים לא משפיעים על השאר
- בדיקות יחידה פשוטות יותר

### 3. שיתוף פעולה

- מפתחים יכולים לעבוד על מודולים שונים במקביל
- פחות קונפליקטים ב-git
- הבנה מהירה של הקוד

### 4. גמישות

- הוספת מודולים חדשים פשוטה
- הסרת מודולים לא בשימוש
- שדרוגים הדרגתיים

## צ'קליסט לרפקטורינג

### ☑️ לפני תחילת העבודה

- [ ] זיהוי אזורי אחריות במקור
- [ ] תכנון מבנה תיקיות
- [ ] וידוא שכל export מזוהה

### ☑️ בזמן הרפקטורינג

- [ ] כל מודול מתחת ל-200 שורות
- [ ] interfaces ו-types מלאים
- [ ] פונקציות עזר עם טיפוסים
- [ ] תיעוד בעברית

### ☑️ אחרי הרפקטורינג

- [ ] כל import קיים עובד
- [ ] TypeScript compile בהצלחה
- [ ] קובץ index מרכזי עם כל exports
- [ ] בדיקת תאימות לאחור מלאה

## שימוש בכלים

### Todo List למעקב

```typescript
// דוגמה לרשימת משימות
[
  {
    id: "analyze",
    content: "ניתוח designSystem.ts לזיהוי אזורים",
    status: "completed",
  },
  { id: "structure", content: "יצירת מבנה תיקיות", status: "completed" },
  { id: "spacing", content: "חילוץ מערכת רווחים", status: "in_progress" },
  // ...
];
```

### בדיקת TypeScript

```bash
# וידוא שהכל מקמפל
npx tsc --noEmit
```

## דוגמה למעבר הדרגתי

### שלב 1: יצירת מודול חדש

```typescript
// src/theme/design/spacing/index.ts
export const spacing = {
  /* ... */
};
```

### שלב 2: עדכון index הראשי

```typescript
// src/theme/design/index.ts
export * from "./spacing";
export { spacing } from "./spacing";
```

### שלב 3: עדכון קובץ המקור

```typescript
// src/theme/designSystem.ts
export { spacing } from "./design/spacing";
```

### שלב 4: הסרת קוד ישן

```typescript
// הסרת ההגדרה הישנה מ-designSystem.ts
// const spacing = { ... }; // <- מוסר
```

---

**הערה:** השיטה הזו מתאימה לכל קובץ גדול (מעל 200 שורות) עם אחריות מעורבת. התאם את המבנה לצרכים הספציפיים של הפרויקט שלך.
