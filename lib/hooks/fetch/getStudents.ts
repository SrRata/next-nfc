"use client"

import { educationLevel, section } from "@/lib/constants/data-type";

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

// interface listCoursesProps {
//     course?: string,
//     level?: string,
//     section?: string,
//     isActive?: boolean
// }

// export function getStudents() {

//     const searchParams = useSearchParams();


//     const [students, setStudents] = useState<Student[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     const fetchCourses = async () => {
//         setLoading(true);

//         try {
//             const res = await fetch('/api/students');
//             const data = await res.json();
//             setStudents(data);
//         } catch {
//             setError(true)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchCourses();
//     }, []);


//     return { students, loading, error, refresh: fetchCourses }

// }



import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

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
