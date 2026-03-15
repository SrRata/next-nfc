"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  GraduationCap,
  IdCard,
  Pen,
  Save,
  Trash,
} from "lucide-react";

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
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateUrl } from "@/lib/hooks/update-url";
import { section } from "@/lib/constants/data-type";
import { getActiveBadgeColor, sectionBadgeColor } from "@/lib/constants/get-badge-color";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { useModal } from "@/lib/hooks/use-modal";

type Data = {
  id: string;
  nfc: string;
  firstName: string;
  lastName: string;
  course: string;
  section: section;
  isActive: boolean;
};

export default function StudentsPageStructure() {

  const searchParams = useSearchParams();
  const active = searchParams.get("active");

//inicializacion de la funcion para actualizar la url

  const updateUrl = useUpdateUrl();


// modal
    const {modal, openModal, closeModal} = useModal<Data>();
    const modalType = modal.type;
    const selected = modal.data;

//use state encargado del fetch y actualizar los datos con filtros. inicualemnte vacio carga los datos se vuelve a hacer el fech cuando cambia un filtro

    const [students, setStudents] = useState<Data[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      const res = await fetch(`/api/students-management?active=${active}`);
      const data = await res.json();
      setStudents(data);
    }

    fetchStudents();
  }, [active]);

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser
          name={formatFullName(row.original.firstName, row.original.lastName)}
          id={row.original.id}
        />
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
        return (
          <Badge color={sectionBadgeColor[section].color}>
            {sectionBadgeColor[section].label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {
        const state = row.original.isActive;

        return (
          <Badge color={getActiveBadgeColor(state).color} circle>
            {getActiveBadgeColor(state).label}
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
      <select onChange={(e) => updateUrl("active", e.target.value)}>
        <option value="">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </select>
      <DataTable
        legend="Estudiantes registrados"
        columns={columns}
        data={students}
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

            <p className="flex items-center gap-4 col-span-full font-bold text-xl text-blue-primary">
              <GraduationCap />
              Información academica
            </p>

            <Separator />

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
              <Input defaultValue={selected?.section} />
            </div>

            <div>
              <Label>Estado</Label>
            </div>

            <div className="col-span-full border-2 border-blue-primary/15 bg-blue-secondary rounded-primary p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xl text-blue-primary font-bold">
                  Hardware & Acceso
                </p>
                <Badge color="blue" variant="solid">
                  Esperando tag
                </Badge>
              </div>
              <Label>Código NFC</Label>
              <Input defaultValue={selected?.nfc} />
              <p className="text-sm text-black-secondary font-semibold mt-3 flex items-center gap-2">
                <AlertCircle className="size-4" />
                Acerce el tag NFC al lector para capturar el código
                automáticamente.
              </p>
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
              ¿Seguro que deseas eliminar al estudiante{" "}
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
