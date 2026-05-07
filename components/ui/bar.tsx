import { cn } from "@/lib/utils";
import { useEffect, useState } from "react"; // 1. Importar hooks


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


// ... (tus sizeClasses e intentClasses se mantienen igual)

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

export function ProgressBar({
  value,
  showLabel = true,
  size = "md",
  intent = "auto",
  className,
}: ProgressBarProps) {
  // 2. Estado para controlar la animación
  const [displayValue, setDisplayValue] = useState(0);

  // 3. Efecto para disparar la animación al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(clamp(value));
    }, 100); // Pequeño delay para asegurar que el DOM esté listo
    return () => clearTimeout(timer);
  }, [value]);

  const resolvedIntent =
    intent === "auto" ? getIntentFromValue(displayValue) : intent;

  return (
    <div
      className={cn("flex flex-col gap-2 w-full", className)}
      role="progressbar"
      aria-valuenow={displayValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {showLabel && (
        <span className="font-semibold justify-center flex">
          {displayValue}%
        </span>
      )}

      <div
        className={cn(
          "w-full rounded-full bg-gray-200 overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out", // 4. Ajustar duración y suavizado
            intentClasses[resolvedIntent]
          )}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}
