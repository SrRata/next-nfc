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
import { User, useUpdateUser } from "@/lib/hooks/fetch/users";
import React, { useState } from "react";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null | undefined;
}


export function EditUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
    const [role, setRole] = useState(user?.role || "");
    const { mutate: updateUser, isPending } = useUpdateUser();

    React.useEffect(() => {
        if (user) setRole(user.role);
    }, [user]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) return;

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Incluimos el rol del estado ya que el Select de Radix a veces no entra en FormData
        const payload = { ...data, role };

        updateUser({ id: user.id, data: payload }, {
            onSuccess: () => {
                onClose();
            },
            onError: (err) => {
                alert(err.message);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-2xl">
                <DialogTitle className="sr-only">Editar Usuario </DialogTitle>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nombres</Label>
                            <Input
                                name="firstName"
                                defaultValue={user?.firstName}
                                required
                            />
                        </div>

                        <div>
                            <Label>Apellidos</Label>
                            <Input
                                name="lastName"
                                defaultValue={user?.lastName}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Correo electrónico</Label>
                        <Input
                            name="email"
                            type="email"
                            defaultValue={user?.email}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>CDL</Label>
                            <Input
                                name="cdl"
                                defaultValue={user?.cdl}
                                required
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <Label>Contacto</Label>
                            <Input
                                name="phoneNumber"
                                defaultValue={user?.phoneNumber}
                                maxLength={10}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Rol</Label>
                        <Select onValueChange={setRole} value={role} name="role" required>
                            <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r} value={r} className="capitalize">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Spinner className="mr-2" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
