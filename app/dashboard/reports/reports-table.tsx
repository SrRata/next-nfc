"use client"

import { Badge } from "@/components/ui/badge";
import { DataUser } from "@/components/data-user";
import { ProgressBar } from "@/components/ui/bar";

import {
  ColumnDef,
} from "@tanstack/react-table";

import data from "./data.json";
import { DataTable } from "@/components/data-table";

type Data = {
  id: string;
  name: string;
  course: string;
  section: string;
  assists: number;
  absences: number;
};

export function ReportTable() {

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.name} id={row.original.id} />
      ),
    },
    {
      accessorKey: "course",
      header: "Curso",
    },
    {
      accessorKey: "assists",
      header: "Asistencias",
      cell: ({ row }) => <Badge color="green">{row.original.assists}</Badge>,
    },
    {
      accessorKey: "absences",
      header: "Faltas",
      cell: ({ row }) => <Badge color="red">{row.original.absences}</Badge>,
    },
    {
      header: "% de asistencias",
      cell: ({ row }) => {
        const total = row.original.assists + row.original.absences;

        const percentage =
          total > 0 ? Number(((row.original.assists / total) * 100).toFixed(0)) : 0;
        return (
          <ProgressBar
            value={percentage}
            showLabel={true}
            className="max-w-60"
          />
        );
      },
    },
  ];

  return (
    <DataTable legend="Datae por cada estudiante" buttonCTA="Exportar PDf" data={data} columns={columns}/>
  );
}
