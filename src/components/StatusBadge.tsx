import { STATUS_CONFIG, type BloomStatus } from "@/lib/data";

export default function StatusBadge({
  status,
  size = "sm",
}: {
  status: BloomStatus;
  size?: "sm" | "md";
}) {
  const config = STATUS_CONFIG[status];
  if (!config) return <span className="text-xs text-gray-400">{status}</span>;

  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: config.color, color: "#333" }}
    >
      {config.emoji && <span>{config.emoji}</span>}
      {config.label}
    </span>
  );
}
