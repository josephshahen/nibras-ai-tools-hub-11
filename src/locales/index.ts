
import { ar } from './ar';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export const locales = {
  ar,
  en,
  es,
  fr,
  de: en, // Fallback to English for now
  it: en, // Fallback to English for now
  pt: es, // Portuguese can use Spanish as fallback
  ru: en, // Fallback to English for now
  zh: en, // Fallback to English for now
  ja: en, // Fallback to English for now
  ko: en, // Fallback to English for now
  hi: en, // Fallback to English for now
  ur: ar, // Urdu can use Arabic as fallback
  fa: ar, // Persian can use Arabic as fallback
  tr: en, // Fallback to English for now
  nl: en, // Fallback to English for now
  sv: en, // Fallback to English for now
  da: en, // Fallback to English for now
  no: en, // Fallback to English for now
  fi: en, // Fallback to English for now
  pl: en, // Fallback to English for now
  cs: en, // Fallback to English for now
  hu: en, // Fallback to English for now
  ro: en, // Fallback to English for now
  th: en, // Fallback to English for now
  vi: en, // Fallback to English for now
  id: en, // Fallback to English for now
  ms: en, // Fallback to English for now
  bn: en, // Fallback to English for now
  ta: en, // Fallback to English for now
  he: en, // Fallback to English for now
  sw: en, // Fallback to English for now
};

export type SupportedLanguage = keyof typeof locales;
export type TranslationKeys = typeof ar;
