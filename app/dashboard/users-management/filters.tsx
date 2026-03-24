"use client"

import { Filters } from "../../../components/filters";
import { educationLevels, roles } from "@/lib/constants/data-type";

export function FiltersUsersManagement() {


    return (
        <Filters
            searchPlaceholder="Buscar un usuario..."
            fields={[
                {
                    id: "role",
                    label: "Rol",
                    options: roles.map((rol) => ({
                        label: rol,
                        value: rol,
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