"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

interface AttendanceGaugeProps {
  rate: number;
}

function rateColor(rate: number) {
  if (rate >= 90) return "#10b981"; // emerald
  if (rate >= 75) return "#f59e0b"; // amber
  return "#f43f5e"; // rose
}

export function AttendanceGauge({ rate }: AttendanceGaugeProps) {
  const color = rateColor(rate);
  const data = [{ value: rate, fill: color }];

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="relative h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={14}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: "#e5e7eb" }}
              dataKey="value"
              cornerRadius={8}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {rate}
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">
            %
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-muted-foreground">
        Tasa de asistencia
      </p>
    </div>
  );
}