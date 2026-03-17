import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users } from "lucide-react";
import { ReportChart } from "./report-chart";
import { ReportTable } from "./reports-table";
import { Suspense } from "react";
import { Filters, FiltersSkeleton } from "@/components/filters";
import {
  educationLevels,
  sections,
  studentStates,
} from "@/lib/constants/data-type";

export default function reportsPage() {
  return (
    <>
      <InfoCard
        variant="compact"
        icon={Percent}
        colorIcon="blue"
        title="Asistencia media"
        value="92.4%"
        alert="+2.1% vs al mes anterior"
        alertColor="green"
      />
      <InfoCard
        variant="compact"
        icon={Users}
        colorIcon="red"
        title="Total faltas"
        value={42}
        alert="En el periodo lectivo actual"
      />
      <InfoCard
        variant="compact"
        icon={UserMinus}
        colorIcon="orange"
        title="Estudiantes en alerta"
        value={15}
        alert=">20% de asistencia"
        alertColor="red"
      />

      <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          searchPlaceholder="Buscar un estudiante..."
          fields={[
            {
              id: "date",
              label: "Periodo",
              options: sections.map((state) => ({
                label: state,
                value: state,
              })),
            },
            {
              id: "level",
              label: "Nivel educativo",
              options: educationLevels.map((level) => ({
                label: level,
                value: level,
              })),
            },
            {
              id: "section",
              label: "Sección",
              options: sections.map((state) => ({
                label: state,
                value: state,
              })),
            },
                        {
              id: "view",
              label: "Vista",
              options: [
                {label: "Comparativa", value: "comparative"},
              ]
            }
          ]}
        />
      </Suspense>

      <ReportChart />
      <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          searchPlaceholder="Buscar un estudiante..."
          fields={[
            {
              id: "course",
              label: "Curso",
              options: [
                { label: "3ro Informatica", value: "1" },
                { label: "2do Informatica", value: "2" },
              ],
            },
            {
              id: "level",
              label: "Nivel educativo",
              options: educationLevels.map((level) => ({
                label: level,
                value: level,
              })),
            },
          ]}
        />
      </Suspense>
      <ReportTable />
    </>
  );
}
