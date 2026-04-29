import { Filters, FiltersSkeleton } from "@/components/filters";
import { HistoryTable } from "./history-table";
import { educationLevels, studentStates } from "@/lib/constants/data-type";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table";

export default function HistoryPage() {
  return (
    <>
      {/* <Suspense fallback={<FiltersSkeleton />}>
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
            {
              id: "observation",
              label: "Observación",
              options: studentStates.map((state) => ({
                label: state,
                value: state,
              })),
            },
          ]}
        />
      </Suspense> */}
      <Suspense fallback={<TableSkeleton />}>
        <HistoryTable />
      </Suspense>
    </>
  );
}
