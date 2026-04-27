"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  getActiveBadgeColor,
} from "@/lib/constants/get-badge-color";
import { useModal } from "@/lib/hooks/use-modal";
import { DeleteCourseModal } from "./delete-course-modal";
import { CreateCourseModal } from "./create-course-modal";
import { EditCourseModal } from "./edit-course-modal";
import { Course} from "@/lib/hooks/fetch/courses";
import { useEffect, useState } from "react";
import { course } from "@/types/courses";
import axios from "axios";

export function CoursesTable() {

  const { modal, openModal, closeModal } = useModal<Course>();

  const [courses, setCourses] = useState<course[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await axios.get('/api/coursesc');
        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);

  const columns: ColumnDef<course>[] = [
    {
      accessorKey: "course_name",
      header: "Curso",
    },
    {
      accessorKey: "educational_level_name",
      header: "Nivel",
    },
    {
      accessorKey: "section_name",
      header: "Sección",
    },
    {
      accessorKey: "professor_name",
      header: "Tutor",
      cell: ({ row }) => (
        row.original.porfessor_name || "Asignar tutor" //solcionar problema por alguna razon solo renderiza sasignar un tutor
      )
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.is_active;
        return (
          <Badge color={getActiveBadgeColor(state).color} circle>
            {getActiveBadgeColor(state).label}
          </Badge>
        );
      }
    }
  ]


  return (
    <>
      <DataTable
        legend="Cursos registrados"
        columns={columns}
        data={courses ?? []}
        isLoading={isLoading}
        buttonCTA="Nuevo curso"
        buttonAction={() => openModal("create")}
      />

      <CreateCourseModal isOpen={modal.type === "create"} onClose={closeModal} />
      <EditCourseModal isOpen={modal.type === "edit"} onClose={closeModal} course={modal.data} />
      <DeleteCourseModal isOpen={modal.type === "delete"} onClose={closeModal} course={modal.data} />
    </>
  );
}
