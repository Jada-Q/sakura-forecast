"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Locale, getSavedLocale, saveLocale, t as translate, tReplace as translateReplace, type TranslationKey } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  tReplace: (key: TranslationKey, replacements: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const handleSetLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    saveLocale(l);
  }, []);

  const tFn = useCallback(
    (key: TranslationKey) => translate(key, locale),
    [locale]
  );

  const tReplaceFn = useCallback(
    (key: TranslationKey, replacements: Record<string, string | number>) =>
      translateReplace(key, locale, replacements),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t: tFn, tReplace: tReplaceFn }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
