import { cn } from "@/lib/utils";

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
