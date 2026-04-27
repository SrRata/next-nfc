"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Pen, Trash } from "lucide-react";
import {
    getActiveBadgeColor,
    roleBadgeColor,
} from "@/lib/constants/get-badge-color";
import { useModal } from "@/lib/hooks/use-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatFullName } from "@/lib/hooks/format-full-name";
import { User, useUpdateUserStatus, useUsers } from "@/lib/hooks/fetch/users";
import { DeleteUserModal } from "./delete-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { CreateUserModal } from "./create-user-modal";
import { useEffect, useState } from "react";
import { user } from "@/types/users";
import axios from "axios";

export function UsersTable() {

    const { modal, openModal, closeModal } = useModal<User>();

    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState<user[]>([])

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await axios.get('/api/usersc');
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadUsers();
    }, []);

    const columns: ColumnDef<user>[] = [
        {
            header: "Nombre",
            cell: ({ row }) => (
                <DataUser name={formatFullName(row.original.first_name, row.original.last_name)} id={row.original.id.toString()} />
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
            header: "Estado",
            cell: ({ row }) => {
                const state = row.original.is_active
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
                isLoading={isLoading}
                buttonCTA="Nuevo usuario"
                buttonAction={() => openModal("create")}
            />

            <EditUserModal isOpen={modal.type === "edit"} onClose={closeModal} user={modal.data} />
            <CreateUserModal isOpen={modal.type === "create"} onClose={closeModal} />
            <DeleteUserModal isOpen={modal.type === "delete"} onClose={closeModal} user={modal.data} />
        </>

    );
}
