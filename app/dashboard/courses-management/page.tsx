"use client"
import { Suspense, useEffect, useState } from "react";
import { CoursesTable } from "./table";
import { FiltersSkeleton } from "@/components/filters";
import { TableSkeleton } from "@/components/table";
import { InfoCard } from "@/components/info-card";
import { Book, BookOpen, School, Text, Users, UserX } from "lucide-react";
import { course } from "@/types/courses";
import axios from "axios";
import { MetricsAdmin } from "@/types/metrics";

export default function CoursesManagementPage() {

  const [courses, setCourses] = useState<course[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await axios.get('/api/coursesc');
        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);


  const totalCourses = courses.length;

  const totalStudents = courses.reduce((acc, curso) => acc + curso.total_students, 0);

  const coursesWithoutProfessor = courses.filter(curso => curso.professor_id === null).length;


  return (
    <>
      <InfoCard
        icon={Users}
        colorIcon="yellow"
        title="Total alumnos asignados"
        value={totalStudents ? totalStudents : "--"}
        variant="compact"
      />

      <InfoCard
        icon={BookOpen}
        colorIcon="purple"
        title="Total cursos"
        value={totalCourses ? totalCourses : "--"}
        variant="compact"
      />

      <InfoCard
        icon={UserX}
        colorIcon="red"
        title="Cursos sin profesores"
        value={coursesWithoutProfessor ? coursesWithoutProfessor : "--"}
        alert="! Asignar profesores"
        alertColor="red"
        variant="compact"
      />
      <Suspense fallback={<TableSkeleton />}>
        <CoursesTable courses={courses} setCourses={setCourses} isLoading={isLoading}/>
      </Suspense>
    </>
  );
}
