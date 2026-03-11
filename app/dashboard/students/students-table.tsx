"use client";

import { Badge, BadgeCircle } from "@/components/ui/badge";
import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

import { InternalLink } from "@/components/ui/link";
import { ExternalLink } from "lucide-react";

type Data = {
  id: string;
  name: string;
  course: string;
  section: string;
  state: state;
};

import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { state } from "@/lib/data-type";
import { stateBadgeColor } from "@/lib/get-badge-color";

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
        const state = row.original.state;

        return (
          <Badge color={stateBadgeColor[state].color}>
            <BadgeCircle />
            {stateBadgeColor[state].label}
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
