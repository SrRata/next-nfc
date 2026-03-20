"use client"

import { Filters } from "../../../components/filters";
import { educationLevels, sections } from "@/lib/constants/data-type";

import { listCourses } from "@/lib/hooks/fetch/list-courses";

export function FiltersStudentsManagement() {

    const {courses, loading, error} = listCourses("5")

        const getCourseOptions = () => {
        if (loading) return [{ label: "Cargando cursos...", value: "loading" }];
        
        if (error) return [{ label: "Error al cargar", value: "error" }];  ///mejorar a que sea un div por tanto modificar el componente 

        if (courses.length === 0) return [{ label: "No hay cursos disponibles", value: "none" }];

        return courses.map(c => ({
            label: `${c.course} ${c.parallel}`,
            value: c.id.toString()
        }));
    };

    return (
        <Filters
            searchPlaceholder="Buscar un estudiante..."
            fields={[
                {
                    id: "course",
                    label: "Curso",
                    options: getCourseOptions()
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
    )
}