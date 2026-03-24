"use client";

import { DISPLAY_STATUS_CONFIG, getDisplayStatus, type BloomStatus } from "@/lib/data";
import { useLocale } from "@/lib/locale-context";
import type { TranslationKey } from "@/lib/i18n";

export default function StatusBadge({
  status,
  size = "sm",
}: {
  status: BloomStatus;
  size?: "sm" | "md";
}) {
  const { t } = useLocale();
  const display = getDisplayStatus(status);
  const config = DISPLAY_STATUS_CONFIG[display];

  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: config.color, color: "#fff" }}
    >
      {config.emoji && <span>{config.emoji}</span>}
      {t(display as TranslationKey)}
    </span>
  );
}
