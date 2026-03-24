"use client";

import { STATUS_CONFIG, type BloomStatus } from "@/lib/data";

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as BloomStatus[];

export default function FilterChips({
  selected,
  onToggle,
}: {
  selected: Set<BloomStatus>;
  onToggle: (status: BloomStatus) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {ALL_STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];
        const active = selected.size === 0 || selected.has(status);
        return (
          <button
            key={status}
            onClick={() => onToggle(status)}
            className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              active
                ? "border-transparent text-gray-800 shadow-sm"
                : "border-gray-200 bg-white text-gray-400"
            }`}
            style={active ? { backgroundColor: config.color } : undefined}
          >
            {config.emoji} {config.label}
          </button>
        );
      })}
    </div>
  );
}
