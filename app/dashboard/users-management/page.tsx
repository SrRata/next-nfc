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
  role: "administrador" | "profesor" | "usuario";
  state: "activo" | "inactivo";
  email: string;
};

export default function UsersPage() {
  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Usuario",
      cell: ({ row }) => (
        <DataUser name={row.original.name} id={row.original.id} />
      ),
    },
    {
      accessorKey: "role",
      header: "Rango / Rol",
      cell: ({ row }) => {
        const role = row.original.role;

        const colorMap: Record<Data["role"], "purple" | "blue" | "orange"> = {
          administrador: "purple",
          profesor: "blue",
          usuario: "orange",
        };
        return (
          <Badge color={colorMap[role]}>
            {row.original.role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Correo",
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
