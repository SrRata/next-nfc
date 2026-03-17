import { Suspense } from "react";
import StudentsPageStructure from "./structure";
import { Filters, FiltersSkeleton } from "../../../components/filters";
import { educationLevels, sections } from "@/lib/constants/data-type";
import { TableSkeleton } from "@/components/table";

export default function StudentsPage() {
  return (
    <>
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

            {
              id: "section",
              label: "Seccion",
              options: sections.map((section) => ({
                label: section,
                value: section,
              })),
            },

            {
              id: "isActive",
              label: "Estado",
              options: [
                { label: "Activo", value: "true" },
                { label: "Inactivo", value: "false" },
              ],
            },
          ]}
        />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <StudentsPageStructure />
      </Suspense>
    </>
  );
}
