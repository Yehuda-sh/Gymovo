// File: src/types/exercise.ts
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  // שינינו את שם השדה לבהירות, כדי שיהיה ברור שזו כתובת תמונה
  imageUrl?: string;
  // הוספנו מערך של הוראות ביצוע
  instructions?: string[];
}
