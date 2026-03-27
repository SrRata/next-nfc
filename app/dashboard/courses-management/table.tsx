"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import {
  getActiveBadgeColor,
  levelBadgeColor,
  sectionBadgeColor,
} from "@/lib/constants/get-badge-color";
import { useModal } from "@/lib/hooks/use-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteCourseModal } from "./delete-course-modal";
import { CreateCourseModal } from "./create-course-modal";
import { EditCourseModal } from "./edit-course-modal";
import { Course, useCourses, useUpdateCourseStatus } from "@/lib/hooks/fetch/courses";

export function CoursesTable() {

  const { modal, openModal, closeModal } = useModal<Course>();

  const { data: courses, isLoading, isError } = useCourses();
  const { mutate: toggleStatus, isPending } = useUpdateCourseStatus();


  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "tutorName",
      header: "Tutor docente",
      cell: ({ row }) => {
        return row.original.tutorName ? (
          <DataUser name={row.original.tutorName} />
        ) : (
          <span className="normal-case font-semibold">Asignar un tutor</span>

        )
      }
    },
    {
      accessorKey: "courseName",
      header: "Curso",
    },
    {
      accessorKey: "totalStudents",
      header: "N. estudiantes"
    },
    {
      accessorKey: "section",
      header: "Sección",
      cell: ({ row }) => {
        const section = row.original.section;
        return (
          <Badge color={sectionBadgeColor[section].color}>
            {sectionBadgeColor[section].label}
          </Badge>
        );
      },
    },
    {
      header: "Nivel educativo",
      accessorKey: "level",
      cell: ({ row }) => {
        const level = row.original.level;
        return (
          <Badge color={levelBadgeColor[level].color}>
            {levelBadgeColor[level].label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: ({ row }) => {

        const state = getActiveBadgeColor(row.original.isActive);
        return (
          <Badge color={state.color} circle>
            {state.label}
          </Badge>
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openModal("edit", row.original)}>Editar</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleStatus({
                  id: row.original.id,
                  isActive: !row.original.isActive
                })}
              >
                {row.original.isActive ? "Desactivar" : "Activar"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => openModal("delete", row.original)}>
                Borrar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

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
