"use client"

import { Suspense, useEffect, useState } from "react";
import { TableSkeleton } from "@/components/table";
import TableStudentsManagement from "./table";
import { CircleDashed, IdCard, Users, UserX } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import axios from "axios";
import { MetricsAdmin } from "@/types/metrics";
import { student } from "@/types/users";

export default function StudentsPage() {

  const [students, setStudents] = useState<student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await axios.get('/api/students');

        if (response.data.success) {
          setStudents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudents();
  }, []);

  const totalStudents = students.length;
  const totalStudentsWhithoutParent = students.filter(student => student.parent_id === null).length;
  const totalStudentWithNfc = students.filter(student => student.nfc_uid !== null).length;


  return (
    <>

      <InfoCard
        icon={Users}
        colorIcon="yellow"
        title="Total alumnos"
        variant="compact"
        value={totalStudents ? totalStudents : "--"}
      />

      <InfoCard
        icon={CircleDashed}
        colorIcon="red"
        title="Alumnos sin representante"
        variant="compact"
        value={totalStudentsWhithoutParent? totalStudentsWhithoutParent : "--"}
      />


      <InfoCard
        icon={IdCard}
        colorIcon="purple"
        title="Alumnos con tarjeta"
        variant="compact"
        value={totalStudentWithNfc? totalStudentWithNfc : "--"}
      />

      <Suspense fallback={<TableSkeleton />}>
        <TableStudentsManagement students={students} setStudents={setStudents} isLoading={isLoading}/>
      </Suspense>

    </>
  );
}
