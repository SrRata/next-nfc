
import { Chart } from "@/components/chart";
import data from "./data-chart.json"

export function ReportChart() {
  return (
    <Chart
      title="Comparativa de Asistencia"
      description="Matutina vs Vespertina"
      data={data}
      areas={[
        {
          dataKey: "matutina",
          name: "Matutina",
          stroke: "#0F49BD",
          fill: "#0F49BD",
        },
        {
          dataKey: "vespertina",
          name: "Vespertina",
          stroke: "#F97316",
          fill: "#F97316",
        },
      ]}
    />
  );
}
