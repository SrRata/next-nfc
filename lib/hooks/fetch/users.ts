"use client"

import { role } from "@/lib/constants/data-type";
import { User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';

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

export function getUsers() {
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchCourses = useCallback(async () => {

        setLoading(true);
        setError(false);

        try {
            const query = searchParams.toString();
            const res = await fetch(`/api/users${query ? `?${query}` : ""}`);
            if (!res.ok) throw new Error("Error en la carga");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return { users, loading, error, refresh: fetchCourses };
}



export const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState(false);

    const deleteUser = async (id: number | string | undefined) => {

        if (id === undefined || id === null) {
            console.error("No se pudo eliminar: El ID del usuario es inválido.");
            return;
        }

        setLoading(true);
        setError(false)

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar');
            }

            router.refresh();

        } catch (error: any) {
            setError(true)
            return false
            // alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteUser, loading, error };
};




export const useUpdateUserStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const toggleStatus = async (id: string | number | undefined, currentStatus: boolean) => {
        if (!id) return;

        setLoading(true);
        setError(false);

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }), // Invertimos el estado
            });

            if (!response.ok) throw new Error();

            router.refresh(); // Actualiza la tabla automáticamente
            return true;
        } catch (err) {
            setError(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { toggleStatus, loading, error };
};


export const useCreateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const createUser = async (formData: any) => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error();

            router.refresh();
            return true;
        } catch (err) {
            setError(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createUser, loading, error };
};
