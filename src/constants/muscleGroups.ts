// src/constants/muscleGroups.ts

// הגדרת טיפוס עבור אובייקט של קבוצת שרירים
export interface MuscleGroup {
  id: string;
  name: string;
}

// שדרוג למערך של אובייקטים, המאפשר גמישות ועקביות
// TODO: בעתיד, נוכל להוסיף לכל אובייקט גם תמונה של השריר
export const muscleGroups: MuscleGroup[] = [
  { id: "chest", name: "חזה" },
  { id: "back", name: "גב" },
  { id: "legs", name: "רגליים" },
  { id: "shoulders", name: "כתפיים" },
  { id: "biceps", name: "יד קדמית" },
  { id: "triceps", name: "יד אחורית" },
  { id: "calves", name: "שוקיים" },
  { id: "lower_back", name: "גב תחתון" },
];
