"use client"

import React, { useState, useEffect } from "react";
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
import { educationLevels, sections } from "@/lib/constants/data-type";
import { Course, useCreateCourse, useUpdateCourse } from "@/lib/hooks/fetch/courses";
import { useProfessors, Professor } from "@/lib/hooks/fetch/professor";

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course?: Course | null; // El curso a editar (si existe)
}

export function EditCourseModal({ isOpen, onClose, course }: CreateCourseModalProps) {
    // 1. Estados para los campos controlados
    const [section, setSection] = useState("");
    const [level, setLevel] = useState("");
    const [tutorId, setTutorId] = useState<string>("none");

    // 2. Hooks de Datos
    const { data: professors, isLoading: loadingProfs } = useProfessors();
    const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
    const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

    // 3. Sincronizar estados cuando el modal se abre o cambia el curso
    useEffect(() => {
        if (isOpen) {
            if (course) {
                setSection(course.section || "");
                setLevel(course.level || "");
                // Importante: Usamos professor_id para marcar el Select
                setTutorId(course.professor_id ? course.professor_id.toString() : "none");
            } else {
                // Resetear para creación
                setSection("");
                setLevel("");
                setTutorId("none");
            }
        }
    }, [course, isOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const payload = {
            courseName: formData.get("courseName"),
            section,
            level,
            // Si es "none", mandamos null a la DB
            professorId: tutorId === "none" ? null : tutorId 
        };

        if (course?.id) {
            // Modo Edición
            updateCourse({ id: course.id.toString(), data: payload }, {
                onSuccess: () => onClose(),
                onError: (err) => console.error("Error al actualizar:", err.message)
            });
        } else {
            // Modo Creación
            createCourse(payload, {
                onSuccess: () => onClose(),
                onError: (err) => console.error("Error al crear:", err.message)
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>{course ? "Editar Curso" : "Crear Nuevo Curso"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre del Curso */}
                    <div>
                        <Label>Nombre del Curso</Label>
                        <Input 
                            name="courseName" 
                            defaultValue={course?.courseName || ""} 
                            placeholder="Ej. Décimo EGB" 
                            required 
                        />
                    </div>

                    {/* Selección de Sección */}
                    <div>
                        <Label>Sección</Label>
                        <Select onValueChange={setSection} value={section} required>
                            <SelectTrigger><SelectValue placeholder="Seleccione sección" /></SelectTrigger>
                            <SelectContent>
                                {sections.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selección de Nivel */}
                    <div>
                        <Label>Nivel Educativo</Label>
                        <Select onValueChange={setLevel} value={level} required>
                            <SelectTrigger><SelectValue placeholder="Seleccione nivel" /></SelectTrigger>
                            <SelectContent>
                                {educationLevels.map((l) => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selección de Tutor (ID) */}
                    <div>
                        <Label>Tutor (Opcional)</Label>
                        <Select onValueChange={setTutorId} value={tutorId}>
                            <SelectTrigger>
                                <SelectValue placeholder={loadingProfs ? "Cargando..." : "Sin asignar tutor"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno (Vacío)</SelectItem>
                                {professors?.map((p: Professor) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.firstName} {p.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isCreating || isUpdating}>
                            {(isCreating || isUpdating) && <Spinner className="mr-2" />}
                            {course ? "Guardar Cambios" : "Crear Curso"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
