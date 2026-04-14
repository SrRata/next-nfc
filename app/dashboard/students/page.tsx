import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users } from "lucide-react";
import { StudentsTable } from "./students-table";
import { Suspense } from "react";
import { Filters, FiltersSkeleton } from "@/components/filters";
import { TableSkeleton } from "@/components/table";
import { educationLevels, studentStates } from "@/lib/constants/data-type";

export default function StudentsPage() {
  return (
    <>
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value="15 estudiantes"
      />
      <InfoCard
        icon={UserMinus}
        colorIcon="orange"
        title="Estudiantes en alerta"
        value="5 estudiantes"
      />
      <InfoCard
        icon={Percent}
        colorIcon="blue"
        title="Asistencia media"
        value="92.4%"
      />

      <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          searchPlaceholder="Buscar un estrudiante..."
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
            {
              id: "asist",
              label: "Asistencia",
              options: studentStates.map((state) => ({
                label: state,
                value: state,
              })),
            },
          ]}
        />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <StudentsTable />
      </Suspense>
    </>
  );
}
