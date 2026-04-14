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
import { educationLevels, roles, sections } from "@/lib/constants/data-type";
import { useCreateCourse } from "@/lib/hooks/fetch/courses";
import { useProfessors } from "@/lib/hooks/fetch/system/professor";
import { useCreateUser } from "@/lib/hooks/fetch/users";
import React, { useState } from "react";

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
    const [section, setSection] = useState("");
    const [level, setLevel] = useState("");
    const [tutorId, setTutorId] = useState<string | null>(null);

    // Usar el hook de CURSOS, no de usuarios
    const { data: professors, isLoading: loadingProfs } = useProfessors();
    const { mutate: createCourse, isPending } = useCreateCourse();

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);
    //     const data = Object.fromEntries(formData.entries());

    //     // Aseguramos que los valores de los Select entren al data
    //     const payload = { ...data, section, level };

    //     createCourse(payload, {
    //         onSuccess: () => onClose(),
    //         onError: (err) => console.error(err.message)
    //     });
    // }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // CORRECCIÓN: Usa 'tutorId' que es como llamaste a tu estado arriba
        const payload = {
            ...data,
            section,
            level,
            professorId: tutorId === "none" ? null : tutorId
        };

        createCourse(payload, {
            onSuccess: () => {
                onClose();
                setTutorId(null); // Limpiamos el estado correcto
            },
            onError: (err) => {
                console.error("Error al crear curso:", err.message);
            }
        });
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Curso</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nombre del Curso</Label>
                        <Input name="courseName" placeholder="Ej. Décimo EGB" required />
                    </div>

                    <div>
                        <Label>Sección</Label>
                        <Select onValueChange={setSection} value={section} required>
                            <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                            <SelectContent>
                                {sections.map((e) => (
                                    <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Nivel Educativo</Label>
                        <Select onValueChange={setLevel} value={level} required>
                            <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                            <SelectContent>
                                {educationLevels.map((e) => (
                                    <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Tutor (Opcional)</Label>
                        <Select onValueChange={setTutorId} value={tutorId || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sin asignar tutor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno</SelectItem>
                                {professors?.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.firstName} {p.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Spinner />} Crear Curso
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
