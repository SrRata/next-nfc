import { ChevronRight, Nfc } from "lucide-react";
import { InternalLink } from "./ui/link";
import { IconShape } from "./ui/icon-shape";
import { getRelativeTime } from "@/lib/relative-time";

interface LastRegisterProps {
  lastStudent: string;
  createdAt: Date | string;
  href: string;
  className?: string;
}

export function LastRegister({
  lastStudent,
  createdAt,
  href,
  className,
}: LastRegisterProps) {
  const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  const relativeTime = getRelativeTime(date);

  return (
    <section
      className={`flex justify-between items-center p-6 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <IconShape size="sm" icon={Nfc} color="blue" shape="circle" />

        <p className="text-black-secondary font-medium">
          Último registro {relativeTime}: <strong>{lastStudent}</strong>
        </p>
      </div>

      <InternalLink href={href}>
        Ver listado completo
        <ChevronRight />
      </InternalLink>
    </section>
  );
}


//Componente mejorado, version final
//01-03-2026

