import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  intent?: "auto" | "success" | "error" | "warning" | "info"
  className?: string
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max)
}

function getIntentFromValue(value: number) {
  if (value <= 40) return "error"
  if (value <= 75) return "warning"
  return "success"
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
}

const intentClasses = {
  success: "bg-green-primary",
  error: "bg-red-primary",
  warning: "bg-yellow-primary",
  info: "bg-blue-primary",
}

export function ProgressBar({
  value,
  showLabel = true,
  size = "md",
  intent = "auto",
  className,
}: ProgressBarProps) {
  const safeValue = value

  const resolvedIntent =
    intent === "auto" ? getIntentFromValue(safeValue) : intent

  return (
    <div
      className={cn("flex flex-col gap-2 w-full", className)}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {showLabel && (
        <span className="text-sm font-semibold">
          {safeValue}%
        </span>
      )}

      <div className={cn("w-full rounded-full bg-gray-200 overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            intentClasses[resolvedIntent]
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}

//Componente mejorado, posiblemente final
