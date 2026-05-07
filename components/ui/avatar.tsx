"use client"


import { cn } from "@/lib/utils"


const avatarVariants = [
  { bg: "bg-blue-secondary", text: "text-blue-primary" },
  { bg: "bg-green-secondary", text: "text-green-primary" },
  { bg: "bg-purple-secondary", text: "text-purple-primary" },
  { bg: "bg-orange-secondary", text: "text-orange-primary" },
];

function getInitials(text: string): string {
  if (!text || !text.trim()) return "U";

  const words = text.trim().split(/\s+/);
  
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return (words[0][0] + words[2][0]).toUpperCase();
}


function stringToHash(str: string): number {
  let hash = 0;
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
  const safeName = name?.trim() ? name : "Usuario";

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