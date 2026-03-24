"use client";

import { useLocale } from "@/lib/locale-context";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["ja", "zh", "en"];

export default function LangSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex rounded-full border border-gray-200 bg-white text-[11px]">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2 py-0.5 transition-colors first:rounded-l-full last:rounded-r-full ${
            locale === l
              ? "bg-pink-500 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
