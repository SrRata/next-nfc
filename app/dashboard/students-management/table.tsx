"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { getActiveBadgeColor, levelBadgeColor, sectionBadgeColor } from "@/lib/constants/get-badge-color";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { useModal } from "@/lib/hooks/use-modal";
import { DeleteStudentModal } from "./delete-student-modal";
import { getStudents, Student, toggleStudentStatus } from "@/lib/hooks/fetch/students";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UpdateStudentModal } from "./update-student-modal";

export default function TableStudentsManagement() {

  // modal
  const { modal, openModal, closeModal } = useModal<Student>();
  const { students, loading, error } = getStudents()

  const columns: ColumnDef<Student>[] = [
    {
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser
          name={formatFullName(row.original.firstName, row.original.lastName)}
          id={row.original.id}
        />
      ),
    },
    {
      accessorKey: "points",
      header: "Puntos",
      cell: ({ row }) => (
        <Badge color="yellow">
          {row.original.points}
        </Badge>
      )
    },
    {
      accessorKey: "nfc",
      header: "Código NFC",
    },
    {
      accessorKey: "course",
      header: "Curso",
    },
    {
      accessorKey: "parallel",
      header: "Paralelo"
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
      accessorKey: "level",
      header: "Nivel educativo",
      cell: ({ row }) => {
        const level = row.original.level
        return (
          <Badge color={levelBadgeColor[level].color}>
            {levelBadgeColor[level].label}
          </Badge>
        )
      }
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.isActive;

        return (
          <Badge color={getActiveBadgeColor(state).color} circle>
            {getActiveBadgeColor(state).label}
          </Badge>
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => (

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openModal("edit", row.original)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleStudentStatus(row.original.id, row.original.isActive)}>Desactivar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => openModal("delete", row.original)}>
              Borrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        legend="Estudiantes registrados"
        columns={columns}
        isLoading={loading}
        data={students ?? []}
      />

      <UpdateStudentModal isOpen={modal.type === "edit"} onClose={closeModal} student={modal.data} />
      <DeleteStudentModal isOpen={modal.type === "delete"} onClose={closeModal} student={modal.data} />
    </>
  );
}
