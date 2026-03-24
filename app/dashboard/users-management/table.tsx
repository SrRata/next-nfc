"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Pen, Trash } from "lucide-react";
import {
    getActiveBadgeColor,
    levelBadgeColor,
    roleBadgeColor,
    sectionBadgeColor,
} from "@/lib/constants/get-badge-color";
import { useModal } from "@/lib/hooks/use-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { getUsers, User, useUpdateUserStatus } from "@/lib/hooks/fetch/users";
import { DeleteUserModal } from "./delete-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { CreateUserModal } from "./create-user-modal";

export function UsersTable() {

    const { modal, openModal, closeModal } = useModal<User>();

    const { users, loading, error, refresh } = getUsers()

    const { toggleStatus, loading: statusLoading } = useUpdateUserStatus();

    const columns: ColumnDef<User>[] = [
        {
            header: "Usuario",
            cell: ({ row }) => (
                <DataUser name={formatFullName(row.original.firstName, row.original.lastName)} id={row.original.cdl} />
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
            header: "Email"
        },
        {
            accessorKey: "phoneNumber",
            header: "Contacto",
        },
        {
            header: "Estado",
            cell: ({ row }) => {
                const state = row.original.isActive
                return (
                    <Badge color={getActiveBadgeColor(state).color} circle>
                        {getActiveBadgeColor(state).label}
                    </Badge>
                )
            }
        },
        {
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openModal("edit", row.original)} >Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(row.original.id, row.original.isActive)}>
                                {row.original.isActive ? "Desactivar" : "Activar"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => openModal("delete", row.original)}>
                                Borrar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                legend="Cursos registrados"
                columns={columns}
                data={users ?? []}
                isLoading={loading}
                buttonCTA="Nuevo usuario"
                buttonAction={() => openModal("create")}
            />

            <EditUserModal isOpen={modal.type === "edit"} onClose={closeModal} user={modal.data} />
            <CreateUserModal isOpen={modal.type === "create"} onClose={closeModal}/>
            <DeleteUserModal isOpen={modal.type === "delete"} onClose={closeModal} user={modal.data} />
        </>

    );
}
