"use client";

import { DISPLAY_STATUS_CONFIG, DISPLAY_TO_BLOOM, type BloomStatus, type DisplayStatus } from "@/lib/data";
import { useLocale } from "@/lib/locale-context";
import type { TranslationKey } from "@/lib/i18n";

const ALL_DISPLAY = Object.keys(DISPLAY_STATUS_CONFIG) as DisplayStatus[];

export default function FilterChips({
  selected,
  onToggle,
}: {
  selected: Set<BloomStatus>;
  onToggle: (status: BloomStatus) => void;
}) {
  const { t } = useLocale();

  const handleToggle = (display: DisplayStatus) => {
    const bloomStatuses = DISPLAY_TO_BLOOM[display];
    // Toggle all raw statuses in this group
    bloomStatuses.forEach((s) => onToggle(s));
  };

  const isActive = (display: DisplayStatus) => {
    if (selected.size === 0) return true;
    return DISPLAY_TO_BLOOM[display].some((s) => selected.has(s));
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {ALL_DISPLAY.map((display) => {
        const config = DISPLAY_STATUS_CONFIG[display];
        const active = isActive(display);
        return (
          <button
            key={display}
            onClick={() => handleToggle(display)}
            className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              active
                ? "border-transparent text-white shadow-sm"
                : "border-warm-border bg-warm-peach text-warm-muted"
            }`}
            style={active ? { backgroundColor: config.color } : undefined}
          >
            {config.emoji} {t(display as TranslationKey)}
          </button>
        );
      })}
    </div>
  );
}
