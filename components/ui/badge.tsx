import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type BadgeColor =
  | "green"
  | "red"
  | "yellow"
  | "blue"
  | "gray"
  | "orange"
  | "sky"
  | "purple"

type BadgeVariant = "solid" | "soft" | "outline"

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
  variant?: BadgeVariant
  className?: string
}

const badgeStyles: Record<
  BadgeColor,
  Record<BadgeVariant, string>
> = {
  green: {
    solid: "bg-green-primary text-white",
    soft: "bg-green-secondary text-green-primary",
    outline: "border border-green-primary text-green-primary bg-transparent",
  },
  red: {
    solid: "bg-red-primary text-white",
    soft: "bg-red-secondary text-red-primary",
    outline: "border border-red-primary text-red-primary bg-transparent",
  },
  yellow: {
    solid: "bg-yellow-primary text-white",
    soft: "bg-yellow-secondary text-yellow-primary",
    outline: "border border-yellow-primary text-yellow-primary bg-transparent",
  },
  blue: {
    solid: "bg-blue-primary text-white",
    soft: "bg-blue-secondary text-blue-primary",
    outline: "border border-blue-primary text-blue-primary bg-transparent",
  },
  gray: {
    solid: "bg-black-secondary text-white",
    soft: "bg-gray text-black-secondary",
    outline: "border border-gray text-black-secondary bg-transparent",
  },
  orange: {
    solid: "bg-orange-primary text-white",
    soft: "bg-orange-secondary text-orange-primary",
    outline: "border border-orange-primary text-orange-primary bg-transparent",
  },
  sky: {
    solid: "bg-sky-primary text-white",
    soft: "bg-sky-secondary text-sky-primary",
    outline: "border border-sky-primary text-sky-primary bg-transparent",
  },
  purple: {
    solid: "bg-purple-primary text-white",
    soft: "bg-purple-secondary text-purple-primary",
    outline: "border border-purple-primary text-purple-primary bg-transparent",
  }
}

export function Badge({
  children,
  color = "gray",
  variant = "soft",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold capitalize w-fit transition-colors cursor-pointer",
        badgeStyles[color][variant],
        className
      )}
    >
      {children}
    </span>
  )
}

interface BadgeCircleProps {
  pulse?: boolean
  size?: "sm" | "md"
  className?: string
}

const circleSizes = {
  sm: "size-2",
  md: "size-3",
}

export function BadgeCircle({
  pulse = false,
  size = "sm",
  className,
}: BadgeCircleProps) {
  return (
    <span
      className={cn(
        circleSizes[size],
        "rounded-full bg-current",
        pulse && "animate-pulse",
        className
      )}
    />
  )
}

//Componente mejorado, posiblemente final