import { getRelativeTime } from "@/lib/relative-time";
import { RadioIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { ProgressBar } from "./ui/bar";
import { Metrics } from "@/types/metrics";
import { usePolling } from "@/hooks/usePolling";

interface SystemStatusCardProps {
  attendance: number;
  metricsUrl: string;
}




export function SystemStatusCard({
  attendance,
  metricsUrl
}: SystemStatusCardProps) {

  const { data: metrics, loading: mLoading } = usePolling<Metrics>(metricsUrl);
  const pct = metrics?.percentage ?? 0;


  return (
    <div className="bg-blue-primary rounded-primary p-8 overflow-hidden relative flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl text-white-primary/80">
            Estado del sistema hoy
          </p>
        </div>

        <div>
          <p className="font-bold text-4xl text-white-primary">{pct}%</p>
          <p className="text-xl font-medium text-white-primary/80">
            Asistencia hoy
          </p>
        </div>

        <ProgressBar
          value={pct}
          size="lg"
          showLabel={false}
          className="max-w-60"
        />

      </div>

      <RadioIcon
        size={125}
        className="text-white-primary/50 absolute -right-5 -bottom-5"
      />
    </div>
  );
}