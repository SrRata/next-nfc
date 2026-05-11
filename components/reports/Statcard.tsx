"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "emerald" | "rose" | "amber" | "sky" | "violet";
  suffix?: string;
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50",
    value: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-100 dark:border-emerald-900",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    icon: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50",
    value: "text-rose-700 dark:text-rose-300",
    border: "border-rose-100 dark:border-rose-900",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50",
    value: "text-amber-700 dark:text-amber-300",
    border: "border-amber-100 dark:border-amber-900",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    icon: "text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50",
    value: "text-sky-700 dark:text-sky-300",
    border: "border-sky-100 dark:border-sky-900",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    icon: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/50",
    value: "text-violet-700 dark:text-violet-300",
    border: "border-violet-100 dark:border-violet-900",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "sky",
  suffix,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 flex items-center gap-4 transition-all hover:shadow-md",
        c.bg,
        c.border
      )}
    >
      <div className={cn("rounded-xl p-3 shrink-0", c.icon)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
          {label}
        </p>
        <p className={cn("text-2xl font-bold tabular-nums leading-tight", c.value)}>
          {value}
          {suffix && (
            <span className="text-base font-semibold ml-0.5">{suffix}</span>
          )}
        </p>
      </div>
    </div>
  );
}