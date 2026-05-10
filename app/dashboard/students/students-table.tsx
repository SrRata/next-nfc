"use client";

import { Badge } from "@/components/ui/badge";
import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

import { InternalLink } from "@/components/ui/link";
import { DataTable } from "@/components/data-table";
import { usePolling } from "@/hooks/usePolling";
import { Student } from "./page";
import { useExportStudents } from "@/hooks/Useexportstudents";


interface Props {
  isLoading: boolean
  data: Student[]
}

export function StudentsTable({ data, isLoading }: Props) {

  const { exportToPdf, exportToExcel, exportingPdf, exportingExcel } =
    useExportStudents(data);

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.first_name + " " + row.original.last_name} />
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          color={
            row.original.status === "presente"
              ? "green"
              : row.original.status === "atrasado"
                ? "yellow"
                : "gray"
          }
        >
          {row.original.status}
        </Badge>

      )
    },
    {
      header: "Entrada",
      cell: ({ row }) => (
        <p>{row.original.entry_time ? row.original.entry_time : "..."}</p>
      )
    },
    {
      header: "Salida",
      cell: ({ row }) => (
        <p>{row.original.exit_time ? row.original.exit_time : "..."}</p>
      )
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <InternalLink href={`./history/${row.original.id}`}>
          Ver historial
        </InternalLink>
      ),
    },

  ];

  return (
    <DataTable legend="Listado de estudiantes" columns={columns} data={data} noPagination isLoading={isLoading} buttonCTA="Exportar exel" buttonAction={exportToExcel} />
  );
}
