// src/screens/auth/signup/components/ValidationUtils.ts

import { ValidationResult } from "../types";

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "נא למלא כתובת מייל" };
  }

  if (!email.includes("@")) {
    return { isValid: false, error: "כתובת המייל אינה תקינה" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "כתובת המייל אינה תקינה" };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) {
    return { isValid: false, error: "נא למלא סיסמה" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "הסיסמה חייבת להכיל לפחות 6 תווים" };
  }

  return { isValid: true };
};

export const validateAge = (age: string): ValidationResult => {
  if (!age.trim()) {
    return { isValid: false, error: "נא למלא גיל" };
  }

  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum)) {
    return { isValid: false, error: "הגיל חייב להיות מספר" };
  }

  if (ageNum < 16) {
    return { isValid: false, error: "הגיל המינימלי להרשמה הוא 16" };
  }

  if (ageNum > 100) {
    return { isValid: false, error: "הגיל המקסימלי הוא 100" };
  }

  return { isValid: true };
};

export const validateSignupForm = (
  email: string,
  password: string,
  age: string
): ValidationResult => {
  // בדיקה כללית שכל השדות מלאים
  if (!email.trim() || !password.trim() || !age.trim()) {
    return { isValid: false, error: "נא למלא את כל השדות" };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  const ageValidation = validateAge(age);
  if (!ageValidation.isValid) {
    return ageValidation;
  }

  return { isValid: true };
};
