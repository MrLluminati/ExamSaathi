export const languages = ["en", "hi"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "en";

export const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
};

export function isValidLanguage(lang: string): lang is Language {
  return languages.includes(lang as Language);
}
