"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { course } from "@/types/courses";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { DataUser } from "@/components/data-user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconTrash, IconUserCircle } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { professor } from "@/types/users";
import { useRouter } from "next/navigation";

interface Props {
  courses: course[]
  setCourses: React.Dispatch<React.SetStateAction<course[]>>
}

export function CoursesTable({ courses, setCourses }: Props) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false)

  const handleDelete = async (id: number) => {
    const loadingToast = toast.loading('Eliminando curso...');
    setProcessing(true);

    try {
      await axios.delete(`/api/coursesc/${id}`)
      setCourses((prev) => prev.filter((student) => student.id !== id));
      setOpenDialog(false);
      toast.success(`Curso eliminado con exito`, {
        id: loadingToast,
      })
    } catch (error) {
      console.error('Error delete level', error)
      toast.error(`No se pudo eliminar el curso`, {
        id: loadingToast,
      })
    } finally {
      setProcessing(false);
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
      cell: ({ row }) => (
        <Badge color={row.original.educational_level_color}>{row.original.educational_level_name}</Badge>
      )
    },
    {
      accessorKey: "section_name",
      header: "SECCIÓN",
      cell: ({ row }) => (
        <Badge color={row.original.section_color}>{row.original.section_name}</Badge>
      )
    },
    {
      accessorKey: "professor_name",
      header: "TUTOR",
      cell: ({ row }) => row.original.professor_name ? <DataUser lic name={row.original.professor_name} /> : <DataUser name="Sin Tutor" />
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
            <DropdownMenuItem
              onClick={() => router.push('/dashboard/courses-management/edit/' + row.original.id)}
            >Editar</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => handleOpenDelete(row.original)}>
              Borrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },

  ]


  const [selectedItem, setSelectedItem] = useState<course | null>(null);
  const [teacherName, setTeacherName] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);




  function handleOpenDelete(item: any) {
    setSelectedItem(item);
    setOpenDialog(true);
  }

  const [teachers, setTeachers] = useState<professor[]>([]);

  async function loadTeachers() {
    try {
      const response = await axios.get('/api/usersc?role=profesor');
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching proffesors:', error)
    } finally {
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);


  return (
    <>
      <DataTable
        legend="Cursos registrados"
        columns={columns}
        data={courses ?? []}
        buttonCTA="Nuevo curso"
        buttonAction={() => router.push('/dashboard/courses-management/create/0')}
      />


      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogHeader className="sr-only">
          <DialogTitle>Borrar curso</DialogTitle>
          <DialogDescription>
            Este modal borra el curso seleccionado
          </DialogDescription>
        </DialogHeader>
        <DialogContent showCloseButton={false} className="flex flex-col gap-5 items-center w-full max-w-130">
          <div className="bg-red-secondary size-15 rounded-primary grid place-items-center">
            <IconTrash className="text-red-primary size-10" />
          </div>
          <p className="text-center text-black-primary font-bold text-xl">¿Borrar el curso seleccionado?</p>
          <p className="text-center text-black-secondary font-medium">Esto eliminará este curso. Los estudiantes relacionados a este podria afrontar problemas de registros.</p>
          <div className="grid grid-cols-2 w-full gap-5">
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={processing} >Cancelar</Button>
            <Button variant="destructive" disabled={processing} onClick={() => selectedItem && handleDelete(selectedItem.id)}>{processing && <Spinner />} {processing ? "Borrando..." : "Borrar"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
