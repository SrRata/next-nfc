"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Pen, Trash } from "lucide-react";
import { getActiveBadgeColor, roleBadgeColor } from "@/lib/constants/get-badge-color";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { useEffect, useState } from "react";
import { user } from "@/types/users";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconTrash } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";


interface Props {
    users: user[]
    setUsers: React.Dispatch<React.SetStateAction<user[]>>
    isLoading: boolean
}


export function UsersTable({ users, setUsers, isLoading }: Props) {
    const router = useRouter();

    const [processing, setProcessing] = useState(false)


    const handleDelete = async (id: number) => {
        setProcessing(true);
        try {
            await axios.delete(`/api/usersc/${id}`)
            setUsers((prev) => prev.filter((student) => student.id !== id));
            toast.success(`Usuario eliminado con exito`)
        } catch (error) {
            console.error('Error delete level', error)
            toast.error(`No se pudo eliminar el usuario`)
        } finally {
            setProcessing(false);
            setOpenDialog(false);
        }
    }

    const [selectedItem, setSelectedItem] = useState<user | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    function handleOpenDelete(item: any) {
        setSelectedItem(item);
        setOpenDialog(true);
    }


    const columns: ColumnDef<user>[] = [
        {
            header: "Nombre",
            cell: ({ row }) => (
                <DataUser name={formatFullName(row.original.first_name, row.original.last_name)} id={row.original.cdl.toString()} />
            ),
        },
        {
            header: "Rol",
            cell: ({ row }) => {
                const role = row.original.role;
                return (
                    <Badge color={roleBadgeColor[role].color}>
                        {roleBadgeColor[role].label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                row.original.email ? row.original.email : "--"
            )
        },
        {
            accessorKey: "phone_number",
            header: "Telefono",
            cell: ({ row }) => (
                row.original.phone_number ? row.original.phone_number : "--"
            )
        },
        {
            header: "Acciones",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push('/dashboard/users-management/edit/' + row.original.id)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => handleOpenDelete(row.original)}>
                            Borrar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <DataTable
                legend="Cursos registrados"
                columns={columns}
                data={users ?? []}
                isLoading={isLoading}
                buttonCTA="Nuevo usuario"
                buttonAction={() => router.push('/dashboard/users-management/create/0')}
            />


            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Borrar usuario</DialogTitle>
                    <DialogDescription>
                        Este modal borra el usuario seleccionado
                    </DialogDescription>
                </DialogHeader>
                <DialogContent showCloseButton={false} className="flex flex-col gap-5 items-center w-full max-w-130">
                    <div className="bg-red-secondary size-15 rounded-primary grid place-items-center">
                        <IconTrash className="text-red-primary size-10" />
                    </div>
                    <p className="text-center text-black-primary font-bold text-xl">¿Borrar el usuario seleccionado?</p>
                    <p className="text-center text-black-secondary font-medium">Esto eliminará este usuario. Los estudiantes relacionados a este podria afrontar problemas de registros.</p>
                    <div className="grid grid-cols-2 w-full gap-5">
                        <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={processing} >Cancelar</Button>
                        <Button variant="destructive" disabled={processing} onClick={() => selectedItem && handleDelete(selectedItem.id)}>{processing && <Spinner />} {processing ? "Borrando..." : "Borrar"}</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>

    );
}
