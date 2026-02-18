"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "outline" | "ghost";

type ButtonIntent =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "neutral";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  size?: ButtonSize;
  loading?: boolean;
}

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-primary font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-nowrap";

const sizeVariants: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const buttonStyles: Record<
  ButtonVariant,
  Record<ButtonIntent, string>
> = {
  solid: {
    primary: "bg-blue-primary text-white-primary hover:opacity-90",
    secondary: "bg-gray text-black-primary hover:opacity-90",
    success: "bg-green-primary text-white-primary hover:opacity-90",
    danger: "bg-red-primary text-white-primary hover:opacity-90",
    neutral: "bg-gray-200 text-black-primary hover:opacity-90",
  },
  outline: {
    primary: "border border-blue-primary text-blue-primary hover:bg-blue-secondary",
    secondary: "border border-gray text-black-primary hover:bg-gray-200",
    success: "border border-green-primary text-green-primary hover:bg-green-secondary",
    danger: "border border-red-primary text-red-primary hover:bg-red-secondary",
    neutral: "border border-gray-300 text-black-primary hover:bg-gray-100",
  },
  ghost: {
    primary: "text-blue-primary hover:bg-blue-secondary",
    secondary: "text-black-primary hover:bg-gray-200",
    success: "text-green-primary hover:bg-green-secondary",
    danger: "text-red-primary hover:bg-red-secondary",
    neutral: "text-black-primary hover:bg-gray-100",
  },
};

export function Button({
  children,
  className,
  variant = "solid",
  intent = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        baseButtonClass,
        sizeVariants[size],
        buttonStyles[variant][intent],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
}