"use client";

import { Badge} from "@/components/ui/badge";
import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

import { InternalLink } from "@/components/ui/link";
import { ExternalLink } from "lucide-react";

type Data = {
  id: string;
  name: string;
  course: string;
  section: string;
  isActive: boolean;
};

import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { getActiveBadgeColor, stateBadgeColor } from "@/lib/constants/get-badge-color";

export function StudentsTable() {
  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.name} section={row.original.section} />
      ),
    },
    {
      accessorKey: "course",
      header: "Curso",
    },
    {
      accessorKey: "state",
      header: "Asistencia hoy",
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
        <InternalLink href={`./history/${row.original.id}`}>
          Ver historial
          <ExternalLink />
        </InternalLink>
      ),
    },
  ];

  return (
    <DataTable legend="Listado de estudiantes" columns={columns} data={data} />
  );
}
