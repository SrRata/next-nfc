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
import { User } from "@/lib/hooks/fetch/users";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null | undefined;
}

export function EditUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-200" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                </DialogHeader>

                {user && (
                    <form className="grid grid-cols-2 gap-6">

                        <div>
                            <Label>Nombre *</Label>
                            <Input
                            name="firstName"
                                className="capitalize"
                                defaultValue={user.firstName}
                                required
                                placeholder="Ej. Juan Miguel"
                            />
                        </div>

                        <div>
                            <Label>Apellido *</Label>
                            <Input
                            name="lastName"
                                className="capitalize"
                                defaultValue={user.lastName}
                                required
                                placeholder="Ej. Alvarez Flores"
                            />
                        </div>


                        <div className="col-span-full">
                            <Label>Correo</Label>
                            <Input
                            name="email"
                                defaultValue={user.email}
                                type="email"
                                required
                                placeholder="Ej. usuario@correo.com"
                            />
                        </div>

                        <div>
                            <Label>Cedula *</Label>
                            <Input
                            name="cdl"
                                defaultValue={user.cdl}
                                required
                                placeholder="Ej. 1719690487"
                            />
                        </div>


                        <div>
                            <Label>Contacto</Label>
                            <Input
                            name="phoneNumber"
                                defaultValue={user.phoneNumber}
                                required
                                placeholder="Ej. 0929405265"
                            />
                        </div>

                        <div>
                            <Label>Rol</Label>

                            <Select
                                required
                                defaultValue={user.role}
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
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} size="lg">
                        Cancelar
                    </Button>
                    <Button size="lg" onClick={() => {
                        onClose();
                    }}>
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
