"use client"

import { TooltipProps } from "recharts"

interface CustomTooltipProps
  extends TooltipProps<number, string> {
  unit?: string
}

const labelMap = {
  assists: "Asistencias",
  absences: "Inasistencias",
  attendanceRate: "Tasa de asistencia"
}

export function ChartTooltip({
  active,
  payload,
  label,
  unit = "%"
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="min-w-[180px] rounded-xl bg-white-primary p-4 shadow-md">
      <p className="mb-3 text-sm font-semibold text-black-primary">
        {label}
      </p>

      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const key = entry.dataKey as keyof typeof labelMap

          return (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />

                <span className="text-black-secondary">
                  {labelMap[key] ?? entry.name}
                </span>
              </div>

              <span className="font-medium text-gray-900">
                {Number(entry.value).toFixed(2)}
                {unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}