"use client";

import { useLocale } from "@/lib/locale-context";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["ja", "zh", "en"];

export default function LangSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex rounded-full border border-warm-border bg-white text-[11px]">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2 py-0.5 transition-colors first:rounded-l-full last:rounded-r-full ${
            locale === l
              ? "bg-warm-accent text-white"
              : "text-warm-muted hover:text-warm-text"
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
