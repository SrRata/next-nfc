import { getRelativeTime } from "@/lib/relative-time";
import { RadioIcon } from "lucide-react";
import { Badge, BadgeCircle } from "./ui/badge";

interface SystemStatusCardProps {
  lastReading: Date | string;
  attendance: number;
  course: string;
  isOnline: boolean;
}

export function SystemStatusCard({
  lastReading,
  attendance,
  course,
  isOnline,
}: SystemStatusCardProps) {
  return (
    <div className="bg-blue-primary rounded-primary p-8 overflow-hidden relative flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl text-white-primary/80">
            Estado del sistema
          </p>

          <Badge color={isOnline ? "green" : "red"} variant="solid">
            <BadgeCircle pulse={isOnline} />
            {isOnline ? "En línea" : "Fuera de línea"}
          </Badge>
        </div>

        <div>
          <p className="font-bold text-4xl text-white-primary">{attendance}%</p>
          <p className="text-xl font-medium text-white-primary/80">
            Asistencia hoy
          </p>
        </div>
      </div>

      <p className="text-white-primary/80 font-medium">
        Última lectura {getRelativeTime(lastReading)} - {course}
      </p>

      <RadioIcon
        size={125}
        className="text-white-primary/50 absolute -right-5 -bottom-5"
      />
    </div>
  );
}

//Componente mejorado, version final
//01-03-2026
