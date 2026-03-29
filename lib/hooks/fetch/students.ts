"use client"

import { educationLevel, section } from "@/lib/constants/data-type";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export interface Student {
    id: string,
    firstName: string,
    lastName: string,
    nfc: string,
    isActive: boolean,
    course: string,
    section: section,
    level: educationLevel
    points: string
}

export function useStudents() {
    const searchParams = useSearchParams();
    const queryStr = searchParams.toString();

    const fetchStudents = async (queryString: string) => {
        const res = await fetch(`/api/students${queryString ? `?${queryString}` : ""}`);
        
        if (!res.ok) {
            throw new Error("Error al obtener los estudiantes");
        }
        
        return res.json();
    };

    return useQuery({
        queryKey: ["students", queryStr],
        queryFn: () => fetchStudents(queryStr),
        // Mantiene los datos anteriores mientras carga los nuevos (evita parpadeos)
        placeholderData: (previousData) => previousData,
    });
}
