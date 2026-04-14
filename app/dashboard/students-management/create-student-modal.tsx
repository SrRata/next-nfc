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
import { useCreateStudent } from "@/lib/hooks/fetch/students";
import { useCreateUser } from "@/lib/hooks/fetch/users";
import React, { useState } from "react";
import { useCourseList } from "@/lib/hooks/fetch/system/courses";

interface CreateStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateStudentModal({ isOpen, onClose }: CreateStudentModalProps) {

    const [parentID, setParentID] = useState<string | null>(null);
    const [courseID, setCourseID] = useState<string | null>(null);


    const { data: parents, isLoading: loadingParents } = useParents();
    const { data: coursesList, isLoading: loadingCoursesList } = useCourseList();
    const { mutate: createStudent, isPending } = useCreateStudent();



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            ...data,
            parentId: parentID === "none" ? null : parentID,
            courseId: courseID === "none" ? null : courseID
        };

        createStudent(payload, {
            onSuccess: () => {
                onClose();
                setParentID(null); 
                setCourseID(null);
            },
            onError: (err) => {
                console.error("Error al crear estudiante:", err.message);
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
                            name="email"
                            type="email"
                            placeholder="Ej. usuario@correo.com"
                            required
                        />
                    </div>

                    <div>
                        <Label>Cdl</Label>
                        <Input
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
                            name="phoneNumber"
                            type="text"
                            placeholder="09"
                            maxLength={10}
                        />
                    </div>

                    <div>
                        <Label>Nfc</Label>
                        <Input
                            name="nfc"
                            type="text"
                            placeholder="Acerque la targeta al scaner"
                        />
                    </div>



                    <div>
                        <Label>Representante (Opcional)</Label>
                        <Select onValueChange={setParentID} value={parentID || ""}>
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
                        <Select onValueChange={setCourseID} value={courseID || ""}>
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
                            Crear usuario
                        </Button>
                    </div>

                </form>


            </DialogContent>
        </Dialog>
    );
}
