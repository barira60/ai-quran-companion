import { useSyncExternalStore } from "react";

export type AppLanguage = "en" | "ur";

const LANGUAGE_KEY = "qc.language";
const LANGUAGE_CHANGE_EVENT = "qc.language-change";

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === "ur" ? "ur" : "en";
}

export function setStoredLanguage(lang: AppLanguage) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, lang);
  window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: lang }));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useLanguage(): [AppLanguage, (lang: AppLanguage) => void] {
  const lang = useSyncExternalStore<AppLanguage>(
    subscribe,
    getStoredLanguage,
    () => "en"
  );

  const updateLang = (newLang: AppLanguage) => {
    setStoredLanguage(newLang);
  };

  return [lang, updateLang];
}

export const UR_PROMPTS = [
  "مجھے بے چینی اور گھبراہٹ ہو رہی ہے۔",
  "میں کسی اپنے کے بچھڑنے کے غم میں ہوں۔",
  "مجھے اس وقت صبر اور ہمت کی ضرورت ہے۔",
  "اللہ پر توکل اور بھروسہ کیسے کروں؟",
  "غم اور پریشانی سے نجات کے لیے کوئی دعا بتائیں۔",
];

export const EN_PROMPTS = [
  "I feel anxious and overwhelmed.",
  "I'm grieving a loss.",
  "I need patience right now.",
  "Help me trust Allah more (Tawakkul).",
  "Give me a dua for stress and anxiety.",
];
