"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { roles } from "@/lib/constants/data-type";
import { useParents } from "@/lib/hooks/fetch/system/parents";
import { Student, useCreateStudent, useUpdateStudent } from "@/lib/hooks/fetch/students";
import { useCreateUser } from "@/lib/hooks/fetch/users";
import React, { useEffect, useState } from "react";
import { useCourseList } from "@/lib/hooks/fetch/system/courses";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null
}

export function EditStudentModal({ isOpen, onClose, student }: CreateStudentModalProps) {

  // const [parentID, setParentID] = useState<string | null>(null);
  // const [courseID, setCourseID] = useState<string | null>(null);

  const [parentId, setParentId] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)


  const { data: parents, isLoading: loadingParents } = useParents();
  const { data: coursesList, isLoading: loadingCoursesList } = useCourseList();



  const { mutate: updateStudent, isPending } = useUpdateStudent();


  // useEffect(() => {
  //   if (isOpen) {
  //     if (student) {
  //       setParentId(student.parent ? student.parent.toString() : "none")
  //       setCourseId(student.course ? student.course.toString() : "none")
  //     } else {
  //       // Resetear para creación
  //       setParentId("none");
  //       setCourseId("none");
  //     }
  //   }
  // }, [student, isOpen]);


  useEffect(() => {
    if (isOpen && student) {
      // Usamos el ID que viene de la base de datos
      // Convertimos a string porque el componente Select solo acepta strings
      setParentId(student.parentId ? student.parentId.toString() : "none");
      setCourseId(student.courseId ? student.courseId.toString() : "none");
    } else {
      setParentId("none");
      setCourseId("none");
    }
  }, [student, isOpen]);


  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const data = Object.fromEntries(formData.entries());

  //   const payload = {
  //     ...data,
  //     parent: parentId === "none" ? null : parentId,
  //     course: courseId === "none" ? null : courseId
  //   };

  //   //Debug
  //   console.log(payload)

  //   updateStudent(payload, {
  //     onSuccess: () => {
  //       onClose();
  //       setParentId(null);
  //       setCourseId(null);
  //     },
  //     onError: (err) => {
  //       console.error("Error al crear estudiante:", err.message);
  //     }
  //   });
  // };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!student?.id) return; // Seguridad: no actualizar si no hay ID

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    // 1. Construimos el objeto de datos que la API espera recibir en el body
    const updateData = {
      ...formValues,
      parentId: parentId === "none" ? null : parentId,
      courseId: courseId === "none" ? null : courseId,
    };

    // 2. Enviamos el objeto con la estructura exacta que pide el hook: { id, data }
    updateStudent({
      id: student.id.toString(),
      data: updateData
    }, {
      onSuccess: () => {
        onClose();
        // No es estrictamente necesario resetear aquí si el modal se desmonta
      },
      onError: (err) => {
        console.error("Error al actualizar estudiante:", err.message);
      }
    });
  };




  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-200" showCloseButton={false}>
        <DialogTitle className="sr-only">Crear Usuario</DialogTitle>
        <form onSubmit={handleSubmit}>

          <div>
            <Label>Nombres</Label>
            <Input
              defaultValue={student?.firstName || ""}
              className="capitalize"
              name="firstName"
              type="text"
              placeholder="Ej. Juan Miguel"
              required
            />
          </div>

          <div>
            <Label>Apellidos</Label>
            <Input
              defaultValue={student?.lastName || ""}
              className="capitalize"
              name="lastName"
              type="text"
              placeholder="Ej. Garcia Maute"
              required
            />
          </div>

          <div>
            <Label>Correo electronico</Label>
            <Input
              defaultValue={student?.email || ""}
              name="email"
              type="email"
              placeholder="Ej. usuario@correo.com"
              required
            />
          </div>

          <div>
            <Label>Cdl</Label>
            <Input
              defaultValue={student?.cdl || ""}
              name="cdl"
              type="text"
              placeholder="01"
              required
              maxLength={10}
            />
          </div>

          <div>
            <Label>contacto</Label>
            <Input
              defaultValue={student?.phoneNumber || ""}
              name="phoneNumber"
              type="text"
              placeholder="09"
              maxLength={10}
            />
          </div>

          <div>
            <Label>Nfc</Label>
            <Input
              defaultValue={student?.nfc || ""}
              name="nfc"
              type="text"
              placeholder="Acerque la targeta al scaner"
            />
          </div>

          <div>
            <Label>Representante (Opcional)</Label>
            <Select onValueChange={setParentId} value={parentId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Sin asignar representante " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno</SelectItem>
                {parents?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.firstName} {p.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Curso (Opcional)</Label>
            <Select onValueChange={setCourseId} value={courseId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Sin asignar curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno</SelectItem>
                {coursesList?.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onClose()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
            >
              {isPending && <Spinner />}
              Actualizar Estudiante
            </Button>
          </div>

        </form>


      </DialogContent>
    </Dialog>
  );
}
