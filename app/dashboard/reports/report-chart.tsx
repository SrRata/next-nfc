"use client"

import { Chart } from "@/components/chart";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  endpoint: string
}

export function ReportChart({endpoint}: Props) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getSectionsChart = async () => {
    try {
      const response = await axios.get(endpoint);
      setChartData(response.data.data);
    } catch (error) {
      console.error("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSectionsChart();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <Chart
      className="col-span-2"
      variant="bar"
      title="Asistencia semanal"
      xKey="label"
      series={[
        { dataKey: "on_time", name: "Puntuales", color: "#10b981" },
        { dataKey: "late", name: "Atrasados", color: "#f59e0b" },
        { dataKey: "absent", name: "Ausentes", color: "#f43f5e" },
      ]}
      data={chartData}
    />
  );
}