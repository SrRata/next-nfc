"use client";

import { ColumnDef } from "@tanstack/react-table";
import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Pen, Save, Trash } from "lucide-react";
import { educationLevel, section } from "@/lib/constants/data-type";
import {
  getActiveBadgeColor,
  levelBadgeColor,
  sectionBadgeColor,
} from "@/lib/constants/get-badge-color";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ModalType, useModal } from "@/lib/hooks/use-modal";

type Data = {
  id: string;
  name: string;
  course: string;
  section: section;
  isActive: boolean;
  level: educationLevel;
};

export function CoursesTable() {
  
  const {modal, openModal, closeModal} = useModal<Data>();
  const modalType = modal.type;
  const selected = modal.data;

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Tutor docente",
      cell: ({ row }) => (
        <DataUser name={row.original.name} id={row.original.id} />
      ),
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
        return (
          <Badge color={sectionBadgeColor[section].color}>
            {sectionBadgeColor[section].label}
          </Badge>
        );
      },
    },
    {
      header: "Nivel educativo",
      accessorKey: "level",
      cell: ({ row }) => {
        const level = row.original.level;
        return (
          <Badge color={levelBadgeColor[level].color}>
            {levelBadgeColor[level].label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {

        const state = getActiveBadgeColor(row.original.isActive);
        return (
          <Badge color={state.color} circle>
            {state.label}
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
        data={data as Data[]}
      />

      <Dialog open={modalType === "edit"} onOpenChange={closeModal}>
        <DialogContent
          className="w-full max-w-230 max-h-[95vh] overflow-y-auto no-scrollbar"
          showCloseButton={false}
        >
          <div className="grid grid-cols-2 gap-5">
            <p className="flex items-center gap-4 col-span-2 font-bold text-xl text-blue-primary">
              <GraduationCap />
              Información de {selected?.course}
            </p>

            <Separator />

            <div className="col-span-2">
              <Label htmlFor="name">Nombres</Label>
              <Input
                id="name"
                defaultValue={selected?.name}
                className="capitalize"
                placeholder="Ej. Juan Alberto"
              />
            </div>

            <div>
              <Label>Curso</Label>
              <Input defaultValue={selected?.course} />
            </div>

            <div>
              <Label>Paralelo</Label>
              <Input defaultValue={selected?.course} />
            </div>

            <div>
              <Label>Sección</Label>
              <Input defaultValue={selected?.course} />
            </div>

            <div>
              <Label>Estado</Label>
              <Input defaultValue={selected?.course} />
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
              ¿Seguro que deseas eliminar al curso{" "}
              <span className="font-semibold">{selected.course}</span> del
              registro?
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
