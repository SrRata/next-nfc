"use client"

import { educationLevel, section } from "@/lib/constants/data-type";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export interface Student {
    id: string,
    firstName: string,
    lastName: string,
    nfc: string,
    isActive: boolean,
    course: string,
    parallel: string,
    level: educationLevel
    section: section,
    points: string
}


export function getStudents() {
    const searchParams = useSearchParams();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const query = searchParams.toString();
            const res = await fetch(`/api/students${query ? `?${query}` : ""}`);
            if (!res.ok) throw new Error("Error en la carga");
            const data = await res.json();
            setStudents(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [searchParams]); 

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return { students, loading, error, refresh: fetchStudents };
}




// Cambiar estado activo/inactivo rápidamente
export async function toggleStudentStatus(id: string, currentStatus: boolean) {
    const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
    });
    return res.ok;
}

// Eliminar
export async function deleteStudent(id: string) {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    return res.ok;
}

// Actualizar datos generales
export async function updateStudent(id: string, data: Partial<Student>) {
    const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}
