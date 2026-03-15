"use client";

import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

type Data = {
  date: string;
  student: string;
  course: string;
  section: string;
  entry: string;
  exit: string;
  observation: studentState;
};

import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { studentState } from "@/lib/constants/data-type";
import { stateBadgeColor } from "@/lib/constants/get-badge-color";

export function HistoryTable() {
  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "student",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.student} section={row.original.section} />
      ),
    },
    {
      accessorKey: "course",
      header: "Curso",
    },
    {
      accessorKey: "entry",
      header: "Entrada",
    },
    {
      accessorKey: "exit",
      header: "Salida",
    },
    {
      accessorKey: "observation",
      header: "Observación",
      cell: ({ row }) => {
        const state = row.original.observation;

        return (
          <Badge color={stateBadgeColor[state].color} circle>
            {stateBadgeColor[state].label}
          </Badge>
        );
      },
    },
  ];

  return (
    <DataTable legend="Registros Encontrados" columns={columns} data={data} />
  );
}
