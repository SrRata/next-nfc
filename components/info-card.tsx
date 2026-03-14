import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconShape } from "./ui/icon-shape";
import { color } from "@/lib/constants/data-type";

type AlertColor = "red" | "green" | "neutral";
type InfoCardVariant = "default" | "compact";

interface InfoCardProps {
  variant?: InfoCardVariant;
  className?: string;
  colorIcon?: color;
  icon?: LucideIcon;
  title: string;
  value: string | number;
  alert?: string;
  alertColor?: color;
}


export function InfoCard({
  variant = "default",
  className,
  colorIcon,
  icon: Icon,
  title,
  value,
  alert,
  alertColor = "gray",
}: InfoCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "bg-white-primary rounded-primary p-6 gap-4",
        isCompact ? "flex items-center" : "flex flex-col",
        className,
      )}
    >
      {Icon && <IconShape size="lg" color={colorIcon} icon={Icon} />}

      <div className={cn("flex flex-col gap-2")}>
        <h3 className="text-black-secondary font-semibold">{title}</h3>

        <p className="text-black-primary font-bold text-3xl capitalize">
          {value}
        </p>

        {isCompact && alert && (
          <p className={cn("font-semibold", alertColor === "gray" ? "text-black-secondary" : `text-${alertColor}-primary`)}>
            {alert}
          </p>
        )}
      </div>
    </div>
  );
}

//Componente mejorado, version final
//01-03-2026
