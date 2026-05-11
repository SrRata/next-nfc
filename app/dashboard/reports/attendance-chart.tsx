"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "@/components/ui/chart-tooltip";

const COLORS: Record<string, string> = {
    on_time: "#10b981",
    late: "#f59e0b",
    absent: "#f43f5e"
};

interface Props {
  endpoint: string
}


export function ReportChartAttendanceStatus({endpoint} : Props) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(endpoint)
            .then((res) => setChartData(res.data.data)) // 👈 .data.data
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="bg-white-primary rounded-primary border border-gray-200 p-6">

            <div className="flex flex-col items-center gap-4 flex-wrap">
                <p className="text-black-primary text-2xl font-bold">Asistencia Ciclo Lectivo</p>

                <div className="flex items-center gap-4 flex-wrap justify-end">
                        <div className="flex items-center gap-2">
                            <div
                                className="size-2.5 rounded-full bg-[#10b981]"
                            />
                            <span className="text-black-secondary font-medium">
                                Puntual
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div
                                className="size-2.5 rounded-full bg-[#f59e0b]"
                            />
                            <span className="text-black-secondary font-medium">
                                Atraso
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="size-2.5 rounded-full bg-[#f43f5e]"
                            />
                            <span className="text-black-secondary font-medium">
                                Ausencia
                            </span>
                        </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={60}
                        outerRadius={100}
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.status} fill={COLORS[entry.status]} />
                        ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                </PieChart>
            </ResponsiveContainer>

        </div>
    );
}