"use client"

import { Chart } from "@/components/chart";
import { useEffect, useState } from "react";
import axios from "axios";

export function ReportChartComparative() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/charts/section-comparison')
      .then((res) => {
        setChartData(res.data.data);
        setSeries(res.data.series); 
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <Chart
    className="col-span-full"
      variant="area"
      title="Comparativa por sección"
      description="% asistencia diaria"
      series={series}   
      data={chartData}
    />
  );
}