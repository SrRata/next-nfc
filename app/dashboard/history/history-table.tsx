"use client";

import { DataUser } from "@/components/data-user";

import {
  ColumnDef,
} from "@tanstack/react-table";

type Data = {
  date: string;
  student: string;
  course: string;
  section: string;
  entry: string;
  exit: string;
  observation: string; //"presente" | "ausente" | "atrasado"
};

import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { Badge, BadgeCircle } from "@/components/ui/badge";

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
        <DataUser name={row.original.student} section={row.original.section}/>
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
      
              const colorMap: Record<Data["observation"], "green" | "red" | "yellow"> = {
                presente: "green",
                ausente: "red",
                atrasado: "yellow",
              };
              return (
                <Badge color={colorMap[state]}>
                  <BadgeCircle />
                  {row.original.observation}
                </Badge>
              );
            },
      
    },

  ];

  return (
    <DataTable legend="Registros Encontrados" columns={columns} data={data} />
  );
}
