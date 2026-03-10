"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { ChartTooltip } from "@/components/ui/chart-tooltip";

type AreaConfig = { 
  dataKey: string;
  name: string;
  stroke: string;
  fill: string;
  fillOpacity?: number;
  strokeWidth?: number;
};

interface ReportChartProps {
  title: string;
  description?: string;
  data: any[];
  areas: AreaConfig[];
}

export function Chart({
  title,
  description,
  data,
  areas,
}: ReportChartProps) {
  return (
    <div className="bg-white-primary rounded-primary p-8 col-span-full w-full h-160 max-h-150 flex flex-col gap-4">
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-black-primary text-2xl font-bold">
            {title}
          </p>
          {description && (
            <p className="text-black-secondary font-medium">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {areas.map((area) => (
            <div key={area.dataKey} className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: area.stroke }}
              />
              <p className="text-black-secondary font-medium">
                {area.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="size-full">
        <ResponsiveContainer className="size-full">
          <AreaChart data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 8, fill: "#6b7280" }}
              padding={{ left: 8, right: 8 }}
              interval={0}
              textAnchor="start"
            />
            <Tooltip content={<ChartTooltip />} />

            {areas.map((area) => (
              <Area
                key={area.dataKey}
                type="natural"
                dataKey={area.dataKey}
                stroke={area.stroke}
                fill={area.fill}
                fillOpacity={area.fillOpacity ?? 0.2}
                strokeWidth={area.strokeWidth ?? 2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
