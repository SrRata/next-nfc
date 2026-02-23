"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Ene", ventas: 100 },
  { name: "Feb", ventas: 200 },
  { name: "Mar", ventas: 100 },
  { name: "Ene", ventas: 100 },
  { name: "Feb", ventas: 200 },
  { name: "Mar", ventas: 100 },
  { name: "Mar", ventas: 0 },
  { name: "Ene", ventas: 100 },
  { name: "Feb", ventas: 200 },
  { name: "Mar", ventas: 100 },
  { name: "Mar", ventas: 0 },
  { name: "Ene", ventas: 100 },
  { name: "Feb", ventas: 200 },
  { name: "Mar", ventas: 100 },
  { name: "Mar", ventas: 0 },
]

export function ReportChart() {
  return (
    // <div className="col-span-full bg-white-primary rounded-primary">
    //   <ResponsiveContainer width="100%" height="100%">
    //     <AreaChart data={data}>
    //       <CartesianGrid strokeDasharray="3 3" />
    //       <YAxis />
    //       <XAxis dataKey="name" />
    //       <Tooltip />
    //       <Area
    //         type="monotone"
    //         dataKey="ventas"
    //         stroke="#2563eb"
    //         fill="#3b82f6"
    //       />
    //     </AreaChart>
    //   </ResponsiveContainer>
    // </div>
    <div className="bg-white-primary rounded-primary p-8 col-span-full w-full h-150 max-h-150 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-black-primary text-2xl font-bold">Tendencia de asistencia</p>
          <p className="text-black-secondary font-medium">Porcentaje de asistencia por semana</p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div className="size-5 rounded-full bg-blue-primary"></div>
            <p className="text-black-secondary font-medium">Asistencia %</p>
          </div>
        </div>
      </div>
      <div className="size-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Area
              type="natural"
              dataKey="ventas"
              stroke="#0F49BD"
              fill="#E7EDF8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
