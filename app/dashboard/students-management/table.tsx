"use client";

import { ColumnDef, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { getActiveBadgeColor, getLevelBadge, getSectionBadge } from "@/lib/constants/get-badge-color";
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

export default function TableStudentsManagement() {

  const [students, setStudents] = useState<student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { modal, openModal, closeModal } = useModal<student>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await axios.get('/api/students');

        if (response.data.success) {
          setStudents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudents();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/students/${id}`)
      setStudents((prev) => prev.filter((student) => student.id !== id));
      toast.success(`Estudiante eliminado con exito`)
    } catch (error) {
      console.error('Error delete level', error)
      toast.error(`No se pudo eliminar el estudiante`)
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
      cell: ({ row }) => (
        row.original.section_name || "Asignar seccion"
      )
    },
    {
      accessorKey: "parent_name",
      header: "Representante",
      cell: ({ row }) => (
        row.original.parent_name || "Asignar representante"
      )
    },
    {
      accessorKey: "nfc_uid",
      header: "UID",
      cell: ({ row }) => (
        row.original.nfc_uid || "Sin UID asignada"
      )
    },
    // {
    //   accessorKey: "is_active",
    //   header: "Estado",
    //   cell: ({ row }) => {
    //     const state = row.original.is_active;
    //     return (
    //       <Badge color={getActiveBadgeColor(state).color} circle>
    //         {getActiveBadgeColor(state).label}
    //       </Badge>
    //     );
    //   },
    // },
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
            <DropdownMenuItem >Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
              Borrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    state: {
      columnFilters, //Pasar el estado
    },
    onColumnFiltersChange: setColumnFilters, // 3. Función para actualizarlo
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // 4. IMPORTANTE: Esto procesa el filtro
  });

  return (
    <>

      {/* <div className="flex items-center py-4">
        <input
          placeholder="Busca por nombre o CDL...."
          value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("student")?.setFilterValue(event.target.value)
          }
          className="max-w-sm px-3 py-2 border rounded-md"
        />
      </div> */}

      <DataTable
        legend="Estudiantes registrados"
        columns={columns}
        isLoading={isLoading}
        data={students ? table.getRowModel().rows.map(row => row.original) : []}
        linkCTA="Nuevo Estudiante"
        linkhref="./students-management/create"
      />

      {/* <CreateStudentModal isOpen={modal.type === "create"} onClose={closeModal} /> */}
      {/* <EditStudentModal isOpen={modal.type === "edit"} onClose={closeModal} student={modal.data} /> */}
      {/* <DeleteStudentModal isOpen={modal.type === "delete"} onClose={closeModal} student={modal.data} /> */}
    </>
  );
}