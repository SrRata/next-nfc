"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  getActiveBadgeColor,
} from "@/lib/constants/get-badge-color";
import { useModal } from "@/lib/hooks/use-modal";
import { DeleteCourseModal } from "./delete-course-modal";
import { CreateCourseModal } from "./create-course-modal";
import { EditCourseModal } from "./edit-course-modal";
import { Course } from "@/lib/hooks/fetch/courses";
import { useEffect, useState } from "react";
import { course } from "@/types/courses";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { DataUser } from "@/components/data-user";


export function CoursesTable() {

  const { modal, openModal, closeModal } = useModal<Course>();

  const [courses, setCourses] = useState<course[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await axios.get('/api/coursesc');
        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/coursesc/${id}`)
      setCourses((prev) => prev.filter((student) => student.id !== id));
      toast.success(`Curso eliminado con exito`)
    } catch (error) {
      console.error('Error delete level', error)
      toast.error(`No se pudo eliminar el curso`)
    }
  }

  const columns: ColumnDef<course>[] = [
    {
      accessorKey: "course_name",
      header: "NOMBRE DEL CURSO",
      cell: ({ row }) => (
        <p className="font-bold ">{row.original.course_name}</p>
      )
    },
    {
      accessorKey: "educational_level_name",
      header: "NIVEL",
    },
    {
      accessorKey: "section_name",
      header: "SECCIÓN",
      cell: ({row}) => (
        <Badge color={row.original.section_color}>{row.original.section_name}</Badge>
      )
    },
    {
      accessorKey: "professor_name",
      header: "TUTOR",
      cell: ({ row }) => (
        row.original.porfessor_name ? <DataUser lic name={row.original.porfessor_name}/> : <DataUser name="Sin Tutor"/>
      )
    },
    {
      accessorKey: "total_students",
      header: "ESTUDIANTES",
      cell: ({ row }) => (
        <p className="font-bold text-lg">{row.original.total_students}</p>
      )
    },
    {
      header: "ACCIONES",
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

  ]


  return (
    <>
      <DataTable
        legend="Cursos registrados"
        columns={columns}
        data={courses ?? []}
        isLoading={isLoading}
        buttonCTA="Nuevo curso"
        buttonAction={() => openModal("create")}
      />

      <CreateCourseModal isOpen={modal.type === "create"} onClose={closeModal} />
      <EditCourseModal isOpen={modal.type === "edit"} onClose={closeModal} course={modal.data} />
      <DeleteCourseModal isOpen={modal.type === "delete"} onClose={closeModal} course={modal.data} />
    </>
  );
}
