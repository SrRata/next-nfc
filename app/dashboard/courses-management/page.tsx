import { Suspense } from "react";
import { CoursesTable } from "./courses-table";
import { Filters, FiltersSkeleton } from "@/components/filters";
import { educationLevels, sections } from "@/lib/constants/data-type";
import { TableSkeleton } from "@/components/table";

export default function CoursesManagementPage() {
  
  return (
    <>
    <Suspense fallback={<FiltersSkeleton />}>
              <Filters
                searchPlaceholder="Buscar un curso..."
                fields={[
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
      <CoursesTable/>
    </Suspense>
    </>
  );
}
