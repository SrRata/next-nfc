"use client";

import { ColumnDef } from "@tanstack/react-table";
import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge, BadgeCircle } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  GraduationCap,
  IdCard,
  Pen,
  Save,
  Trash,
} from "lucide-react";
import { educationLevel, isActive, ModalType, section } from "@/lib/data-type";
import { isActiveBadgeColor, levelBadgeColor, sectionBadgeColor } from "@/lib/get-badge-color";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatFullName } from "@/lib/format-full-name";
import { Separator } from "@/components/ui/separator";
import { formatTime12h } from "@/lib/format-time";

type Data = {
  date: string;
  entry: string;
  exit: string;
  section: section;
  level: educationLevel;
  reason: string;
};


export default function CoursesManagementPage() {
  const [modalType, setModalType] = useState<ModalType >(null);
  const [selected, setSelected] = useState<Data | null>(null);

  const openModal = (type: ModalType, student?: Data) => {
    setSelected(student ?? null);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    // setSelected(null);
  };

  const columns: ColumnDef<Data>[] = [
    {
      header: "Fecha",
      accessorKey: "date"
    },
    {
      header: "Motivo",
      accessorKey: "reason"

    },
    {
      header: "Hora entrada",
      accessorKey: "entry",
      cell: ({ row }) => (formatTime12h(row.original.entry))
    },
    {
      header: "Hora salida",
      accessorKey: "exit",
      cell: ({ row }) => (formatTime12h(row.original.exit))
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
      }
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
    }

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
              <Calendar />
              Editar evento
            </p>

            <Separator />

            <div className="col-span-2">
              <Label htmlFor="name">Evento | Motivo</Label>
              <Input
                id="name"
                // defaultValue={selected?.name}
                className="capitalize"
                placeholder="Ej. Carnaval"
              />
            </div>

            <div>
              <Label>Fecha del evento</Label>
              <Input type="date" />
            </div>

            <div>
              <Label>Aplica para la sección:</Label>
              <Input/>
            </div>

            <div>
              <Label>Aplica para el nivel educativo:</Label>
              <Input/>
            </div>

            <div>
              <Label>Tipo de evento</Label>
              <Input placeholder="modificacion de horario o  dia no laborable"/>
            </div>

            <div>
              <Label htmlFor="entry">Hora de entrada</Label>
              <Input
                type="time"
                id="entry"
                defaultValue={selected?.entry}
                className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <div>
              <Label htmlFor="exit">Hora de salida</Label>
              <Input
                type="time"
                id="exit"
                defaultValue={selected?.exit}
                className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
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
              ¿Seguro que deseas eliminar el evento {" "}
              <span className="font-semibold">
                {selected.reason}
              </span>{" "}
              del calendario?
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
