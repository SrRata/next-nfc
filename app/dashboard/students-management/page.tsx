import { Suspense } from "react";
import StudentsPageStructure from "./structure";
import { Filters } from "../../../components/filters";
import { educationLevels, sections } from "@/lib/constants/data-type";

export default function StudentsPage() {
  return (
    <>
      <Suspense fallback={<div>Cargando filtros...</div>}>
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

      <Suspense fallback={<div>Cargando tabla...</div>}>
        <StudentsPageStructure />
      </Suspense>
    </>
  );
}
