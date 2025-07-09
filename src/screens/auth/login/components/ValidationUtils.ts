// src/screens/auth/login/components/ValidationUtils.ts

import { ValidationResult } from "../types";

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return { isValid: false, error: "נא להזין כתובת מייל" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "כתובת המייל אינה תקינה" };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length < 6) {
    return { isValid: false, error: "הסיסמה חייבת להכיל לפחות 6 תווים" };
  }

  return { isValid: true };
};

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  return { isValid: true };
};
