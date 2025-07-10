// src/constants/demo-users/data/types.ts
// 📝 טיפוסים עבור נתוני משתמשי דמו

import { User } from "../../../types/user";

/**
 * 🎯 טיפוס מותאם למשתמש דמו
 * מרחיב את הטיפוס הבסיסי עם תכונות ספציפיות
 */
export interface DemoUserData extends User {
  isGuest: false; // משתמשי דמו תמיד רשומים
  createdAt: string;
  joinedAt: string;
  stats: Required<User["stats"]>; // כל הסטטיסטיקות חובה
}
