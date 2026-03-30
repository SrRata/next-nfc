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
import { useParents } from "@/lib/hooks/fetch/parents";
import { useCreateStudent } from "@/lib/hooks/fetch/students";
import { useCreateUser } from "@/lib/hooks/fetch/users";
import React, { useState } from "react";

interface CreateStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateStudentModal({ isOpen, onClose }: CreateStudentModalProps) {

    const [parentID, setParentID] = useState<string | null>(null);


    const { data: professors, isLoading: loadingProfs } = useParents();
    const { mutate: createCourse, isPending } = useCreateStudent();



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // CORRECCIÓN: Usa 'parentID' que es como llamaste a tu estado arriba
        const payload = {
            ...data,
            professorId: parentID === "none" ? null : parentID
        };

        // createCourse(payload, {
        //     onSuccess: () => {
        //         onClose();
        //         setParentID(null); // Limpiamos el estado correcto
        //     },
        //     onError: (err) => {
        //         console.error("Error al crear curso:", err.message);
        //     }
        // });
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

                    <div>
                        <Label>Curso (Opcional)</Label>
                        <Select onValueChange={setParentID} value={parentID || ""}>
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
