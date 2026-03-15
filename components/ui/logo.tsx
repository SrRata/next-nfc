import { Nfc } from "lucide-react";
import { IconShape } from "./icon-shape";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "Docente" | "Admin"
}

export function Logo({ className, variant }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <IconShape
        icon={Nfc}
        color="blue"
        shape="rounded"
        className="w-11 h-11"
      />

      <div>
        <h2 className="text-blue-primary font-bold text-2xl leading-tight">
          siaeNFC
        </h2>
        {variant && (
          <p className="text-black-secondary font-medium text-sm">
            {variant}
          </p>
        )}
      </div>
    </div>
  );
}

//Componente mejorado, version final
//01-03-2026