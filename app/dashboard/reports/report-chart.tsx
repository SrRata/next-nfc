"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import data from "./data-chart.json";
import { ChartTooltip } from "@/components/ui/chart-tooltip";

export function ReportChart() {
  return (
    <div className="bg-white-primary rounded-primary p-8 col-span-full w-full h-150 max-h-150 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-black-primary text-2xl font-bold">
            Tendencia de asistencia
          </p>
          <p className="text-black-secondary font-medium">
            Porcentaje de asistencia por semana
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-blue-primary"></div>
            <p className="text-black-secondary font-medium">Asistencia %</p>
          </div>
        </div>
      </div>
      <div className="size-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 8, fill: "#6b7280" }}
              padding={{ left: 8, right: 8 }}
              angle={0}
              interval={0}
              textAnchor="start"
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="natural"
              dataKey="assists"
              stroke="#0F49BD"
              fill="#0F49BD"
              fillOpacity={0.2}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
