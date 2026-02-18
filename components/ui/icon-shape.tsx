import { LucideIcon } from "lucide-react";

export type IconColor =
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "purple"
  | "orange"
  | "gray";

type IconShapeVariant = "circle" | "rounded" | "square";
type IconShapeSize = "xs" | "sm" | "md" | "lg" | "xl";

interface IconShapeProps {
  icon: LucideIcon;
  className?: string;
  color?: IconColor;
  shape?: IconShapeVariant;
  size?: IconShapeSize;
}

const colorVariants: Record<IconColor, string> = {
  red: "bg-red-secondary text-red-primary",
  green: "bg-green-secondary text-green-primary",
  yellow: "bg-yellow-secondary text-yellow-primary",
  blue: "bg-blue-secondary text-blue-primary",
  purple: "bg-purple-secondary text-purple-primary",
  orange: "bg-orange-secondary text-orange-primary",
  gray: "bg-gray text-black-primary",
};

const shapeVariants: Record<IconShapeVariant, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

const sizeVariants: Record<
  IconShapeSize,
  { container: string; icon: number }
> = {
  xs: { container: "w-8 h-8 min-h-8 min-w-8", icon: 14 },
  sm: { container: "w-10 h-10 min-h-10 min-w-10", icon: 18 },
  md: { container: "w-12 h-12 min-h-12 min-w-12", icon: 22 },
  lg: { container: "w-14 h-14 min-h-14 min-w-14", icon: 26 },
  xl: { container: "w-16 h-16 min-h-16 min-w-16", icon: 30 },
};

export function IconShape({
  icon: Icon,
  className = "",
  color = "gray",
  shape = "rounded",
  size = "md",
}: IconShapeProps) {

  const { container, icon: iconSize } = sizeVariants[size];

  return (
    <span
      className={`
        ${container}
        grid place-content-center
        ${colorVariants[color]}
        ${shapeVariants[shape]}
        ${className}
      `}
    >
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  );
}