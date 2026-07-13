export const locales = ["fr", "en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  pt: "Português",
};
