"use client";

import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CalendarCheck,
  Clock,
  GraduationCap,
  IdCard,
  Pen,
  Save,
  UserLock,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { IconShape } from "@/components/ui/icon-shape";
import { DataTable } from "@/components/data-table";

type Data = {
  section: section;
  level: string;
  entry: string;
  exit: string;
};

import data from "./data.json";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sectionBadgeColor } from "@/lib/get-badge-color";
import { ModalType, section } from "@/lib/data-type";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { formatTime, formatTime12h } from "@/lib/format-time";

export default function SettingsPage() {
  const [modalType, setModalType] = useState<ModalType>(null);
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
      accessorKey: "level",
      header: "Nivel educativo",
    },
    {
      accessorKey: "section",
      header: "Seccion",
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
      accessorKey: "entry",
      header: "Hora de entrada",
      cell: ({ row }) => formatTime12h(row.original.entry),
    },
    {
      accessorKey: "exit",
      header: "Hora de salida",
      cell: ({ row }) => formatTime12h(row.original.exit),
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => openModal("edit", row.original)}
          >
            <Pen />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        legend="Horarios de entrada y salida"
        columns={columns}
        data={data}
        className="col-span-2 row-span-4"
        noPagination
        pageSize={20}
      />

      <div className="bg-white-primary rounded-primary p-6 flex flex-col gap-7 justify-between">
        <div className="flex items-center gap-4 col-span-full">
          <CalendarCheck className="text-blue-primary size-9" />
          <p className="text-blue-primary font-bold text-xl">
            Dias laborales del sistema
          </p>
        </div>
        <div>
          <p className="font-medium text-black-primary">
            Seleccione los dias en los que el sistema NFC registrara actividad
            academica automatica.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-5">
          <div className="flex items-center gap-2">
            <Checkbox id="lunes" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="lunes"
            >
              Lunes
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="martes" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="martes"
            >
              Martes
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="miercoles" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="miercoles"
            >
              Miercoles
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="jueves" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="jueves"
            >
              Jueves
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="viernes" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="viernes"
            >
              Viernes
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="sabado" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="sabado"
            >
              Sabado
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="domingo" />
            <label
              className="text-black-primary font-medium cursor-pointer"
              htmlFor="domingo"
            >
              Domingo
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white-primary rounded-primary p-6 grid grid-cols-2 gap-7 justify-between">
        <div className="flex items-center gap-4">
          <CalendarCheck className="text-blue-primary size-9" />
          <p className="text-blue-primary font-bold text-xl">
            Tolerancia de ingreso
          </p>
        </div>
        <div className="relative">
          <Input type="number" max="1440" min="0" />
          <span className="absolute right-20 top-5 text-black-secondary font-semibold">
            min
          </span>
        </div>
        <div className="border-blue-primary bg-blue-secondary flex items-center gap-4 p-3 rounded-primary col-span-full">
          <AlertCircle className="min-h-7 min-w-7 max-w-7 max-h-7 text-blue-primary" />
          <p className="font-medium text-blue-primary">
            Ejemplo: Si la clase inicia a las 08:00 AM, con 15 min el registro
            se marcara como puntual hasta las 08:15 AM.
          </p>
        </div>
      </div>
      <div className="bg-white-primary rounded-primary p-6 flex flex-col gap-7 justify-between">
        <div className="flex items-center gap-4">
          <CalendarCheck className="text-blue-primary size-9" />
          <p className="text-blue-primary font-bold text-xl">
            Registro automatico de ausencias
          </p>
        </div>
        <div>
          <Label>Hora de ejecucion | Matutina</Label>
          <Input
            type="time"
            defaultValue="12:00"
            className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <div>
          <Label>Hora de ejecucion | Vespertina</Label>
          <Input
            type="time"
            defaultValue="12:00"
            className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <div className="border-blue-primary bg-blue-secondary flex items-center gap-4 p-3 rounded-primary col-span-full">
          <AlertCircle className="min-h-7 min-w-7 max-w-7 max-h-7 text-blue-primary" />
          <p className="font-medium text-blue-primary">
            Este proceso técnico escanea la base de datos de asistencia al
            finalizar la ventana de entrada. Cualquier estudiante sin un
            registro de entrada será marcado automáticamente como "Ausente".
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end col-span-full">
        <Button>Guardar cambios</Button>
      </div>

      <Dialog open={modalType === "edit"} onOpenChange={closeModal}>
        <DialogContent
          className="w-full max-w-230 max-h-[95vh] overflow-y-auto no-scrollbar"
          showCloseButton={false}
        >
          <div className="grid grid-cols-2 gap-5">
            <p className="flex items-center gap-4 col-span-2 font-bold text-xl text-blue-primary">
              <Clock />
              Horario | {selected?.level} | {selected?.section}
            </p>

            <Separator />

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

            <Separator />
          </div>

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
    </>
  );
}
