"use client"

import { educationLevel, section } from "@/lib/constants/data-type";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export interface Course {
    id: string,
    courseName: string,
    parallel: string,
    section: section,
    level: educationLevel
    isActive: boolean,
    tutorName: string,
    totalStudents: number,
}

export function getCourses() {
    const searchParams = useSearchParams();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchCourses = useCallback(async () => {

        setLoading(true);
        setError(false);

        try {
            const query = searchParams.toString();
            const res = await fetch(`/api/courses${query ? `?${query}` : ""}`);
            if (!res.ok) throw new Error("Error en la carga");
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [searchParams]); 

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return { courses, loading, error, refresh: fetchCourses };
}


export async function updateCourse(id: number | string, data: any) {
  try {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al actualizar');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}




