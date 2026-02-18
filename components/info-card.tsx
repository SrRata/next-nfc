import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconColor, IconShape } from "./ui/icon-shape";

type AlertColor = "red" | "green" | "neutral";
type InfoCardVariant = "default" | "compact";

interface InfoCardProps {
  variant?: InfoCardVariant;
  className?: string;
  colorIcon?: IconColor;
  icon?: LucideIcon;
  title: string;
  value: string | number;
  alert?: string;
  alertColor?: AlertColor;
}

function getAlertColor(color?: AlertColor): string {
  switch (color) {
    case "red":
      return "text-red-primary";
    case "green":
      return "text-green-primary";
    default:
      return "text-black-secondary";
  }
}

export function InfoCard({
  variant = "default",
  className,
  colorIcon,
  icon: Icon,
  title,
  value,
  alert,
  alertColor = "neutral",
}: InfoCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "bg-white-primary rounded-primary p-6 gap-4",
        isCompact
          ? "flex items-center"
          : "flex flex-col",
        className
      )}
    >
      {Icon && <IconShape size="lg" color={colorIcon} icon={Icon} />}

      <div className={cn("flex flex-col gap-2")}>
        <h3 className="text-black-secondary font-semibold">
          {title}
        </h3>

        <p className="text-black-primary font-bold text-3xl capitalize">
          {value}
        </p>

        {isCompact && alert && (
          <p className={cn("font-semibold", getAlertColor(alertColor))}>
            {alert}
          </p>
        )}
      </div>
    </div>
  );
}


//posible version final
