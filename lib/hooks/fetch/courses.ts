"use client"

import { educationLevel, section } from "@/lib/constants/data-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export interface Course {
    id: string,
    courseName: string,
    section: section,
    level: educationLevel
    isActive: boolean,
    professor_id: number | null;
    tutorName: string,
    totalStudents: number,
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({id, data}: {id: string, data: any}) => {
            const res = await fetch(`/api/courses/${id}` , {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            })

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Error al actualizar");
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        }
    })
}

export function useCourses() {
    const searchParams = useSearchParams();
    const queryStr = searchParams.toString();

    const fetchUsers = async (searchParams: string) => {
        const res = await fetch(`/api/courses${searchParams ? `?${searchParams}` : ""}`);
        return res.json();
    };

    return useQuery({
        queryKey: ["courses", queryStr],
        queryFn: () => fetchUsers(queryStr),
        placeholderData: (previousData) => previousData,
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | null | undefined) => {
            if (!id) throw new Error("ID no proporcionado");
            const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Error al eliminar");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseData: any) => {
            const response = await fetch('/api/courses', { // <-- API Correcta
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al crear curso');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/courses/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Error al actualizar el estado");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

