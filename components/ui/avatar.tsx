import { cn } from "@/lib/utils";

const avatarVariants = [
  {
    bg: "bg-blue-secondary",
    text: "text-blue-primary",
  },
  {
    bg: "bg-green-secondary",
    text: "text-green-primary",
  },
  {
    bg: "bg-purple-secondary",
    text: "text-purple-primary",
  },
  {
    bg: "bg-orange-secondary",
    text: "text-orange-primary",
  },
];

function getInitials(text?: string): string {
  if (!text || !text.trim()) return "U";

  const words = text.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getVariantFromName(name: string) {
  const hash = stringToHash(name);
  const index = hash % avatarVariants.length;
  return avatarVariants[index];
}

interface AvatarProps {
  name?: string;
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
  name = "User",
  size = "md",
  className,
  variant = "auto",
}: AvatarProps) {
  const selectedVariant =
    variant === "auto" ? getVariantFromName(name) : avatarVariants[variant];

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
      {getInitials(name)}
    </div>
  );
}

//Componente mejorado, version final
// 01-03-2026

//parametros 
///name del tipo string 
//size = sm | md | lg |