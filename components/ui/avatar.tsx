"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Avatar2({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar2,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}

const avatarVariants = [
  { bg: "bg-blue-secondary", text: "text-blue-primary" },
  { bg: "bg-green-secondary", text: "text-green-primary" },
  { bg: "bg-purple-secondary", text: "text-purple-primary" },
  { bg: "bg-orange-secondary", text: "text-orange-primary" },
];

function getInitials(text: string): string {
  // Si el texto es nulo, vacío o solo espacios, devolvemos "ST" (Sin Tutor) o "?"
  if (!text || !text.trim()) return "ST";

  const words = text.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function stringToHash(str: string): number {
  let hash = 0;
  // Usamos un string vacío si llega undefined o null para evitar errores
  const safeStr = str || ""; 
  for (let i = 0; i < safeStr.length; i++) {
    hash = safeStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getVariantFromName(name: string) {
  const hash = stringToHash(name);
  const index = hash % avatarVariants.length;
  return avatarVariants[index];
}

interface AvatarProps {
  name?: string | null; // Aceptamos null explícitamente
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "auto" | number;
}

const sizeClasses = {
  sm: "size-8 text-sm",
  md: "size-12 text-lg",
  lg: "size-16 text-2xl",
  xl: "size-20 text-3xl",
};

export function Avatar({
  name,
  size = "md",
  className,
  variant = "auto",
}: AvatarProps) {
  // 1. Normalizamos el nombre: si es null/undefined, usamos "Sin Tutor"
  const safeName = name?.trim() ? name : "Sin Tutor";

  // 2. Obtenemos la variante basada en el nombre seguro
  const selectedVariant =
    variant === "auto" 
      ? getVariantFromName(safeName) 
      : avatarVariants[variant] || avatarVariants[0]; // Fallback a la primera variante

  return (
    <div
      className={cn(
        "rounded-full font-semibold grid place-content-center uppercase",
        sizeClasses[size],
        selectedVariant.bg,
        selectedVariant.text,
        className,
      )}
    >
      {getInitials(safeName)}
    </div>
  );
}