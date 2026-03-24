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
import { roles } from "@/lib/constants/data-type";
import { useCreateUser } from "@/lib/hooks/fetch/users";
import { useState } from "react";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: DeleteUserModalProps) {

    const { createUser, loading, error } = useCreateUser();
    const [role, setRole] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            ...Object.fromEntries(formData),
            role: role
        };

        const success = await createUser(data);
        if (success) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-200" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                </DialogHeader>

                <form id="create-user-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                    <div>
                        <Label>Nombre *</Label>
                        <Input
                            name="firstName"
                            className="capitalize"
                            required
                            placeholder="Ej. Juan Miguel"
                        />
                    </div>

                    <div>
                        <Label>Apellido *</Label>
                        <Input
                            name="lastName"
                            className="capitalize"
                            required
                            placeholder="Ej. Alvarez Flores"
                        />
                    </div>


                    <div className="col-span-full">
                        <Label>Correo</Label>
                        <Input
                            name="email"
                            type="email"
                            required
                            placeholder="Ej. usuario@correo.com"
                        />
                    </div>

                    <div>
                        <Label>Cedula *</Label>
                        <Input
                            name="cdl"
                            required
                            placeholder="Ej. 1719690487"
                        />
                    </div>


                    <div>
                        <Label>Contacto</Label>
                        <Input
                            name="phoneNumber"
                            required
                            placeholder="Ej. 0929405265"
                        />
                    </div>

                    <div>
                        <Label>Rol</Label>

                        <Select
                            onValueChange={setRole}
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

                </form>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} size="lg" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" form="create-user-form" size="lg" disabled={loading} onClick={() => {
                        onClose();
                    }}>
                        {loading ? "Guardando..." : "Crear Usuario"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
