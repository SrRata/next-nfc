"use client"

// 1. Importar TooltipProps y los tipos específicos de contenido
import { TooltipProps } from "recharts"
import {
  ValueType,
  NameType
} from "recharts/types/component/DefaultTooltipContent"

// 2. Definir CustomTooltipProps asegurando que payload y label estén presentes
// Usamos una intersección (&) para forzar la existencia de las propiedades
interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean
  payload?: any[] // Aquí es donde TS suele fallar si no se define explícitamente
  label?: string | number
  unit?: string
}

const labelMap = {
  on_time: "Puntuales",
  late: "Atrasados",
  absent: "Ausentes",
  assists: "Asistencias",
  absences: "Inasistencias",
  attendanceRate: "Tasa de asistencia"
}

export function ChartTooltip({
  active,
  payload,
  label,
  unit = ""
}: CustomTooltipProps) {
  // 3. Verificación de seguridad (Type Guard)
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="min-w-45 rounded-xl bg-white p-4 shadow-md border border-gray-100">
      <p className="mb-3 text-sm font-semibold text-black">
        {label}
      </p>

      <div className="flex flex-col gap-2">
        {payload.map((entry: any, index: number) => {
          const key = entry.dataKey as keyof typeof labelMap

          return (
            <div key={index} className="flex items-center justify-between text-sm gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">
                  {labelMap[key] ?? entry.name}
                </span>
              </div>
              <span className="font-medium text-gray-900">
                {Number(entry.value)}{unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
