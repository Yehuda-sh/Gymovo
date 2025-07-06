// File: App.tsx
import React from "react";
import { I18nManager } from "react-native";
// 1. נייבא את הניווט הראשי והנכון שלנו, שמכיל את כל הלוגיקה
import AppWithProviders from "./src/navigation/RootLayout";

// 2. מפעילים ומאלצים תמיכה ב-RTL (עברית)
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function App() {
  // 3. כל מה שהקובץ הזה צריך לעשות הוא להציג את הרכיב הראשי שלנו
  return <AppWithProviders />;
}
