"use client"

import { role } from "@/lib/constants/data-type";
import { User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    phoneNumber: string,
    isActive: boolean,
    role: role,
    cdl: string
}

export function useUsers() {
    const searchParams = useSearchParams();
    const queryStr = searchParams.toString();

    const fetchUsers = async (searchParams: string) => {
        const res = await fetch(`/api/users${searchParams ? `?${searchParams}` : ""}`);
        return res.json();
    };

    return useQuery({
        queryKey: ["users", queryStr],
        queryFn: () => fetchUsers(queryStr),
        placeholderData: (previousData) => previousData,
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | null | undefined) => {
            if (!id) throw new Error("ID no proporcionado");
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Error al eliminar");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}


export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: any) => {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al crear el usuario');
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};


export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Error al actualizar");
            return result;
        },
        onSuccess: () => {
            // Invalida la caché para que la tabla UsersTable se actualice
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}


export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Error al actualizar el estado");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
