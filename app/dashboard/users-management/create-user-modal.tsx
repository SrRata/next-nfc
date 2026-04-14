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
import { useCreateUser } from "@/lib/hooks/fetch/users";
import React, { useState } from "react";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {

    const [role, setRole] = useState("");


    const { mutate: createUser, isPending, error } = useCreateUser();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries())

        createUser(data as any, {
            onSuccess: () => {
                onClose();
            },
            onError: (err) => {
                console.error(err.message)
                //aqui en futuro se puede colocar algun toast
            }
        })
    }




    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-200" showCloseButton={false}>
                <DialogTitle className="sr-only">Crear Usuario</DialogTitle>
                <form onSubmit={handleSubmit}>

                    <div>
                        <Label>Nombres</Label>
                        <Input
                            name="firstName"
                            type="text"
                            placeholder="Ej. Juan Miguel"
                            required
                        />
                    </div>

                    <div>
                        <Label>Apellidos</Label>
                        <Input
                            name="lastName"
                            type="text"
                            placeholder="Ej. Juan Miguel"
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
                        <Label>Rol</Label>

                        <Select
                            onValueChange={setRole}
                            value={role}
                            name="role"
                            required
                        >
                            <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {roles.map((r) => (
                                    <SelectItem key={r} value={r} className="capitalize">
                                        {r}
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
