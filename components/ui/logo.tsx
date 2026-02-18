import { Nfc } from "lucide-react";
import { IconShape } from "./icon-shape";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  title?: string;
}

export function Logo({ className, title }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <IconShape
        icon={Nfc}
        color="blue"
        shape="rounded"
        iconSize={22}
        className="w-11 h-11"
      />

      <div>
        <h2 className="text-blue-primary font-bold text-2xl leading-tight">
          siaeNFC
        </h2>
        {title && (
          <p className="text-black-secondary font-medium text-sm">
            {title}
          </p>
        )}
      </div>
    </div>
  );
}

//Componente mejorado, posiblemente final