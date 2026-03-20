"use client"

import { useState, useEffect } from "react";

export interface Course {
    course: string,
    parallel: string,
    section: string,
    id: string
}

export function listCourses(id: string) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchCourses = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/courses');
            const data =  await res.json();
            setCourses(data);
        } catch {
            setError(true)
        }finally {
            setLoading(false)
        }
    }


 useEffect(() => {
    fetchCourses();
  }, [id]); //no es tan necesario pero bueno 


  return {courses, loading, error,  refresh: fetchCourses}

}

