"use client"

import { educationLevel, section } from "@/lib/constants/data-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export interface Student {
    id: string,
    firstName: string,
    lastName: string,
    cdl: string,
    email: string, 
    phoneNumber: string,
    nfc: string,
    isActive: boolean,
    course: string,
    section: section,
    level: educationLevel
    points: string,
    parents: string,
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
        placeholderData: (previousData) => previousData,
    });
}


export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | null | undefined) => {
            if (!id) throw new Error("ID no proporcionado");
            const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Error al eliminar");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}


export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/students/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Error al actualizar el estado");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}



export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseData: any) => {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al crear estudiante');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};