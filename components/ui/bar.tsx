import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const intentClasses = {
  success: "bg-green-primary",
  error: "bg-red-primary",
  warning: "bg-yellow-primary",
  info: "bg-blue-primary",
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function getIntentFromValue(value: number) {
  if (value <= 40) return "error";
  if (value <= 75) return "warning";
  return "success";
}

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  intent?: "auto" | "success" | "error" | "warning" | "info";
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  size = "md",
  intent = "auto",
  className,
}: ProgressBarProps) {
  const safeValue = value;

  const resolvedIntent =
    intent === "auto" ? getIntentFromValue(safeValue) : intent;

  return (
    <div
      className={cn("flex flex-col gap-2 w-full", className)}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {showLabel && (
        <span className="font-semibold justify-center flex">{safeValue}%</span>
      )}

      <div
        className={cn(
          "w-full rounded-full bg-gray-200 overflow-hidden",
          sizeClasses[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            intentClasses[resolvedIntent],
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

//Componente mejorado, version final
//01-03-2026