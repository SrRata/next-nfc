import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconShape } from "./ui/icon-shape";
import { color } from "@/lib/constants/data-type";
import { NumberTicker } from "./ui/number-ticker";

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
  numberTiker?: boolean
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
  numberTiker = false
}: InfoCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "bg-white-primary rounded-primary p-6 gap-4 relative border gray-200 col-span-1",
        isCompact ? "flex items-center" : "flex flex-col",
        className,
      )}
    >
      {Icon && <IconShape size="lg" color={colorIcon} icon={Icon} />}

      <div className={cn("flex flex-col gap-2")}>
        <h3 className="text-black-secondary font-semibold">{title}</h3>

        {numberTiker ? (<NumberTicker value={Number(value)} className="text-black-primary font-bold text-3xl" />): (<p className="text-black-primary font-bold text-3xl">{value}</p>)}

        {isCompact && alert && (
          <p className={cn("font-semibold absolute top-5 right-5", alertColor === "gray" ? "text-black-secondary" : `text-${alertColor}-primary`)}>
            {alert}
          </p>
        )}
      </div>
    </div>
  );
}