"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { ChartTooltip } from "@/components/ui/chart-tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartVariant = "area" | "bar" | "line" | "bar-stacked";

type SeriesConfig = {
  dataKey: string;
  name: string;
  color: string;
  /** Area only – opacity of the gradient fill (default 0.15) */
  fillOpacity?: number;
  /** Line / Area stroke width (default 2) */
  strokeWidth?: number;
};

interface ChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  /** Key in `data` used as the X-axis label (default "date") */
  xKey?: string;
  series: SeriesConfig[];
  variant?: ChartVariant;
  className?: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Legend({ series }: { series: SeriesConfig[] }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {series.map((s) => (
        <div key={s.dataKey} className="flex items-center gap-2">
          <div
            className="size-2.5 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          <span className="text-black-secondary font-medium">
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Shared axis / grid props ─────────────────────────────────────────────────

const xAxisProps = (xKey: string) => ({
  dataKey: xKey,
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: "#9ca3af" },
  padding: { left: 8, right: 8 } as { left: number; right: number },
});

const yAxisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: "#9ca3af" },
  width: 40,
};

const gridProps = {
  strokeDasharray: "3 3",
  stroke: "#f3f4f6",
  vertical: false,
};

// ─── Variant renderers ────────────────────────────────────────────────────────

function AreaVariant({
  data,
  xKey,
  series,
}: Pick<ChartProps, "data" | "xKey" | "series">) {
  return (
    <AreaChart data={data}>
      <defs>
        {series.map((s) => (
          <linearGradient
            key={s.dataKey}
            id={`grad-${s.dataKey}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={s.color} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid {...gridProps} />
      <XAxis {...xAxisProps(xKey!)} />
      <YAxis {...yAxisProps} />
      <Tooltip content={<ChartTooltip />} />
      {series.map((s) => (
        <Area
          key={s.dataKey}
          type="natural"
          dataKey={s.dataKey}
          name={s.name}
          stroke={s.color}
          fill={`url(#grad-${s.dataKey})`}
          strokeWidth={s.strokeWidth ?? 2}
        />
      ))}
    </AreaChart>
  );
}

function BarVariant({
  data,
  xKey,
  series,
  stacked,
}: Pick<ChartProps, "data" | "xKey" | "series"> & { stacked?: boolean }) {
  return (
    <BarChart data={data} barCategoryGap="30%">
      <CartesianGrid {...gridProps} />
      <XAxis {...xAxisProps(xKey!)} />
      <YAxis {...yAxisProps} />
      <Tooltip content={<ChartTooltip />} />
      {series.map((s, i) => (
        <Bar
          key={s.dataKey}
          dataKey={s.dataKey}
          name={s.name}
          fill={s.color}
          stackId={stacked ? "stack" : undefined}
          radius={
            stacked
              ? i === series.length - 1
                ? [4, 4, 0, 0]   // top bar rounded on top
                : i === 0
                ? [0, 0, 4, 4]   // bottom bar rounded on bottom
                : [0, 0, 0, 0]
              : [4, 4, 0, 0]     // single/grouped: all rounded on top
          }
        />
      ))}
    </BarChart>
  );
}

function LineVariant({
  data,
  xKey,
  series,
}: Pick<ChartProps, "data" | "xKey" | "series">) {
  return (
    <LineChart data={data}>
      <CartesianGrid {...gridProps} />
      <XAxis {...xAxisProps(xKey!)} />
      <YAxis {...yAxisProps} />
      <Tooltip content={<ChartTooltip />} />
      {series.map((s) => (
        <Line
          key={s.dataKey}
          type="natural"
          dataKey={s.dataKey}
          name={s.name}
          stroke={s.color}
          strokeWidth={s.strokeWidth ?? 2}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      ))}
    </LineChart>
  );
}

// ─── Variant selector toggle ──────────────────────────────────────────────────

const VARIANTS: { key: ChartVariant; label: string; icon: string }[] = [
  { key: "area",        label: "Área",    icon: "▲" },
  { key: "line",        label: "Línea",   icon: "╌" },
  { key: "bar",         label: "Barras",  icon: "▌" },
  { key: "bar-stacked", label: "Apilado", icon: "▐" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function Chart({
  title,
  description,
  data,
  xKey = "date",
  series,
  variant: initialVariant = "area",
  className
}: ChartProps) {
  const [variant, setVariant] = React.useState<ChartVariant>(initialVariant);

  const renderChart = () => {
    switch (variant) {
      case "area":
        return <AreaVariant data={data} xKey={xKey} series={series} />;
      case "bar":
        return <BarVariant data={data} xKey={xKey} series={series} />;
      case "bar-stacked":
        return <BarVariant data={data} xKey={xKey} series={series} stacked />;
      case "line":
        return <LineVariant data={data} xKey={xKey} series={series} />;
    }
  };

  return (
    <div className={cn("bg-white-primary rounded-primary border border-gray-200 p-8 w-full h-160 max-h-150 flex flex-col gap-4", className)}>
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-black-primary text-2xl font-bold">{title}</p>
          {description && (
            <p className="text-black-secondary font-medium">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Legend */}
          <Legend series={series} />

          {/* Variant switcher */}
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 gap-0.5">
            {VARIANTS.map((v) => (
              <button
                key={v.key}
                onClick={() => setVariant(v.key)}
                title={v.label}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  variant === v.key
                    ? "bg-blue-primary text-white"
                    : "text-black-secondary hover:bg-gray-100"
                }`}
              >
                {v.icon}&nbsp;{v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="size-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// React needs to be in scope for useState – add this if not already imported globally:
import React from "react";
import { cn } from "@/lib/utils";
