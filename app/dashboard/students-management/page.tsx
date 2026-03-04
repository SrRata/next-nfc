"use client";

import { ColumnDef } from "@tanstack/react-table";
import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge, BadgeCircle } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

type Data = {
  id: string;
  name: string;
  course: string;
  section: "matutina" | "vespertina";
  state: "activo" | "inactivo";
};

export default function StudentsPage() {
  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.name} id={row.original.id} />
      ),
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
      accessorKey: "section",
      header: "Sección",
      cell: ({ row }) => {
        const section = row.original.section;

        const colorMap: Record<Data["section"], "blue" | "yellow"> = {
          matutina: "blue",
          vespertina: "yellow",
        };

        return <Badge color={colorMap[section]}>{row.original.section}</Badge>;
      },
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.state;

        const colorMap: Record<Data["state"], "green" | "red"> = {
          activo: "green",
          inactivo: "red",
        };
        return (
          <Badge color={colorMap[state]}>
            <BadgeCircle />
            {row.original.state}
          </Badge>
        );
      },
    },
    {
        header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-4">
            <Button size="lg" variant="outline">
                <Pen/>
            </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable legend="Estudiantes registrados" columns={columns} data={data} />
  );
}
