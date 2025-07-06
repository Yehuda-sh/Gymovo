// src/components/common/Toast.tsx

import ToastMessage from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

// שירות גלובלי להצגת הודעות קופצות (toasts)
const show = (message: string, type: ToastType = "success") => {
  ToastMessage.show({
    type: type,
    text1: message,
    position: "bottom",
    visibilityTime: 3000,
  });
};

export const Toast = {
  show,
};
