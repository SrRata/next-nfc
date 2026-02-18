import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { IconShape } from "./ui/icon-shape";
import type { IconColor } from "./ui/icon-shape"; 
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type AlertVariant = "info" | "error" | "success" | "warning";

interface AlertProps {
  description: string;
  variant: AlertVariant;
}

interface AlertConfig {
  icon: LucideIcon;
  color: IconColor;
}

const alertConfig: Record<AlertVariant, AlertConfig> = {
  info: {
    icon: AlertCircle,
    color: "blue",
  },
  success: {
    icon: CheckCircle,
    color: "green",
  },
  warning: {
    icon: AlertTriangle,
    color: "yellow",
  },
  error: {
    icon: XCircle,
    color: "red",
  },
};

export function Alert({ description, variant }: AlertProps) {
  const { icon: Icon, color } = alertConfig[variant];

  return (
    <div
      className={cn(
        "p-6 rounded-primary flex items-start gap-4 col-span-full bg-white-primary",
      )}
    >
      <IconShape icon={Icon} shape="circle" size="lg" color={color} />

      <p className="leading-primary font-medium text-black-secondary">
        {description}
      </p>
    </div>
  );
}


//posible vision final