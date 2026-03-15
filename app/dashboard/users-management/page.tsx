"use client";

import { ColumnDef } from "@tanstack/react-table";
import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IdCard,
  Pen,
  Save,
  ShieldUser,
  Trash,
} from "lucide-react";
import { role } from "@/lib/constants/data-type";
import { getActiveBadgeColor, roleBadgeColor } from "@/lib/constants/get-badge-color";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { useModal } from "@/lib/hooks/use-modal";

type Data = {
  id: string;
  firstName: string;
  lastName: string;
  role: role;
  isActive: boolean;
  email: string;
};

export default function UsersPage() {

      const {modal, openModal, closeModal} = useModal<Data>();
      const modalType = modal.type;
      const selected = modal.data;
  

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Usuario",
      cell: ({ row }) => (
        <DataUser
          name={formatFullName(row.original.firstName, row.original.lastName)}
          id={row.original.id}
        />
      ),
    },
    {
      accessorKey: "role",
      header: "Rango / Rol",
      cell: ({ row }) => {
        const role = row.original.role;

        return (
          <Badge color={roleBadgeColor[role].color}>
            {roleBadgeColor[role].label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Correo electrónico",
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: ({ row }) => {
        const isActive = row.original.isActive;

        return (
          <Badge color={getActiveBadgeColor(isActive).color} circle>
            {getActiveBadgeColor(isActive).label}
          </Badge>
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => openModal("edit", row.original)}
          >
            <Pen />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => openModal("delete", row.original)}
          >
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        legend="Estudiantes registrados"
        columns={columns}
        data={data}
      />

      <Dialog open={modalType === "edit"} onOpenChange={closeModal}>
        <DialogContent
          className="w-full max-w-230 max-h-[95vh] overflow-y-auto no-scrollbar"
          showCloseButton={false}
        >
          <div className="grid grid-cols-2 gap-5">
            <p className="flex items-center gap-4 col-span-2 font-bold text-xl text-blue-primary">
              <IdCard />
              Información personal
            </p>

            <Separator />

            <div>
              <Label htmlFor="name">Nombres</Label>
              <Input
                id="name"
                className="capitalize"
                defaultValue={selected?.firstName}
                placeholder="Ej. Juan Alberto"
              />
            </div>
            <div>
              <Label htmlFor="lastname">Apellidos</Label>
              <Input
                id="lastname"
                className="capitalize"
                defaultValue={selected?.lastName}
                placeholder="Ej. Perez Garcia"
              />
            </div>
            <div className="col-span-2">
              <Label id="id">Identificación (ID)</Label>
              <Input id="id" defaultValue={selected?.id} />
            </div>

            <p className="flex items-center gap-4 col-span-2 font-bold text-xl text-blue-primary">
              <ShieldUser />
              Información de usuario
            </p>

            <Separator />

            <div>
              <Label>Estado</Label>
              <Input defaultValue={selected?.role} />
            </div>

            <div>
              <Label>Rol</Label>
              <Input defaultValue={selected?.role} />
            </div>

            <div className="col-span-2">
              <Label>Correo electrónico</Label>
              <Input defaultValue={selected?.email} />
            </div>
          </div>

          <Separator />

          <DialogFooter>
            <Button variant="outline" size="lg" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="lg">
              <Save />
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === "delete"} onOpenChange={closeModal}>
        <DialogContent className="w-140" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Eliminar estudiante</DialogTitle>
          </DialogHeader>

          {selected && (
            <p className="font-medium text-black-primary">
              ¿Seguro que deseas eliminar al usuario {""}
              <span className="font-semibold">
                {formatFullName(selected.firstName, selected.lastName)}
              </span>{" "}
              del registro?
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} size="lg">
              Cancelar
            </Button>
            <Button variant="destructive" size="lg">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
