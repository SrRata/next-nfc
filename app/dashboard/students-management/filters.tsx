"use client"

import { Filters } from "../../../components/filters";
import { educationLevels, sections } from "@/lib/constants/data-type";

export function FiltersStudentsManagement() {

    return (
        <Filters
            searchPlaceholder="Buscar un estudiante o correo..."
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
    )
}