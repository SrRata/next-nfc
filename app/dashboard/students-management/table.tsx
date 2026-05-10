"use client";

import { ColumnDef, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { useModal } from "@/lib/hooks/use-modal";
import { student } from "@/types/users";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  getFilteredRowModel, // Necesario para que el filtrado funcione
  useReactTable,
  ColumnFiltersState
} from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconTrash } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

interface Props {
  students: student[]
  setStudents: React.Dispatch<React.SetStateAction<student[]>>
  isLoading: boolean
}


export default function TableStudentsManagement({ students, setStudents, isLoading }: Props) {
  const router = useRouter();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [processing, setProcessing] = useState(false)


  const handleDelete = async (id: number) => {
    setProcessing(true);
    try {
      await axios.delete(`/api/students/${id}`)
      setStudents((prev) => prev.filter((student) => student.id !== id));
      toast.success(`Estudiante eliminado con exito`)
    } catch (error) {
      console.error('Error delete level', error)
      toast.error(`No se pudo eliminar el estudiante`)
    } finally {
      setProcessing(false);
      setOpenDialog(false);
    }
  }


  const columns: ColumnDef<student>[] = [
    {
      id: "student",
      accessorFn: (row) => `${row.first_name} ${row.last_name} ${row.cdl}`,
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser
          name={formatFullName(row.original.first_name, row.original.last_name)}
          id={row.original.cdl}
        />
      ),
      filterFn: (row, columnId, filterValue) => {
        const searchValue = filterValue.toLowerCase();
        const valueToFilter = String(row.getValue(columnId)).toLowerCase();
        return valueToFilter.includes(searchValue);
      },
    },
    {
      accessorKey: "course_name",
      header: "Curso",
      cell: ({ row }) => (
        row.original.course_name || "Asignar curso"
      )
    },
    {
      accessorKey: "section_name",
      header: "Seccion",
      // cell: ({ row }) => (
      //   // row.original.section_name || "Asignar seccion"
      // )

      cell: ({ row }) => {
        return row.original.section_name ? (<Badge color={row.original.section_color}>{row.original.section_name}</Badge>) : "--"
      }
    },
    {
      accessorKey: "parent_name",
      header: "Representante",
      cell: ({ row }) => (
        row.original.parent_name || "--"
      )
    },
    {
      accessorKey: "nfc_uid",
      header: "UID",
      cell: ({ row }) => (
        row.original.nfc_uid || "--"
      )
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/dashboard/students-management/edit/' + row.original.id)} >Editar</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => handleOpenDelete(row.original)}>
              Borrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [selectedItem, setSelectedItem] = useState<student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  function handleOpenDelete(item: any) {
    setSelectedItem(item);
    setOpenDialog(true);
  }


  const table = useReactTable({
    data: students,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>

      <DataTable
        legend="Estudiantes registrados"
        columns={columns}
        isLoading={isLoading}
        data={students ? table.getRowModel().rows.map(row => row.original) : []}
        buttonCTA="Nuevo estudiante"
        buttonAction={() => router.push('/dashboard/students-management/create/0')}

      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogHeader className="sr-only">
          <DialogTitle>Borrar estudiante</DialogTitle>
          <DialogDescription>
            Este modal borra el estudiante seleccionado
          </DialogDescription>
        </DialogHeader>
        <DialogContent showCloseButton={false} className="flex flex-col gap-5 items-center w-full max-w-130">
          <div className="bg-red-secondary size-15 rounded-primary grid place-items-center">
            <IconTrash className="text-red-primary size-10" />
          </div>
          <p className="text-center text-black-primary font-bold text-xl">¿Borrar el estudiante seleccionado?</p>
          <p className="text-center text-black-secondary font-medium">Esta acción eliminará este estudiante de manera permanente. Deseas continuar.</p>
          <div className="grid grid-cols-2 w-full gap-5">
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={processing} >Cancelar</Button>
            <Button variant="destructive" disabled={processing} onClick={() => selectedItem && handleDelete(selectedItem.id)}>{processing && <Spinner />} {processing ? "Borrando..." : "Borrar"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}



