

"use client"

import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { StudentsTable } from "./students-table";
import { Suspense, useEffect, useState } from "react";
import { TableSkeleton } from "@/components/table";
import { RealtimeDashboard } from "@/components/realtime";
import { usePolling } from "@/hooks/usePolling";
import { useExportStudents } from "@/hooks/Useexportstudents";
import { PDFViewer } from "@react-pdf/renderer";
import { StudentsPdfDocument } from "@/components/Studentspdfdocument ";
import axios from "axios";

interface Course {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  status: "presente" | "atrasado" | "ausente" | "salida";
  entry_time: string | null;
  exit_time: string | null;
  observation: string | null;
}

export default function StudentsPage() {


  const [user, setUser] = useState({
    id: ''
  })

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data)
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  interface RiskStudent {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    total_absences: number;
  }


  interface RiskResponse {
    total_at_risk: number;
    students: RiskStudent[];
  }

  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [totalRiskStudents, setTotalRiskStudents] = useState(0);
  const [loadingRisk, setLoadingRisk] = useState(false);

  const { data: listData, loading } =
    usePolling<{
      course: Course | null;
      students: Student[];
    }>(
      `/api/realtime/student-list?professor_id=${user.id}`, 5000
    );


  const students = listData?.students ?? [];
  const course = listData?.course;

  const getRiskStudents = async () => {
    try {
      setLoadingRisk(true);
      const response = await axios.get<RiskResponse>(
        `/api/metrics/students-risk?course_id=${course?.id}`
      );

      setRiskStudents(response.data.students);

      setTotalRiskStudents(
        response.data.total_at_risk
      );
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingRisk(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (!course?.id) return;

    getRiskStudents();

  }, [course?.id]);



  const { exportToPdf, exportToExcel, exportingPdf, exportingExcel } =
    useExportStudents(students);

  const total_students = students.length;
  const validAttendance = ["presente", "atrasado"];

  const attendancePercentage =
    total_students > 0
      ? Number(
        (
          (students.filter((e) =>
            validAttendance.includes(e.status)
          ).length *
            100) /
          total_students
        ).toFixed(0)
      )
      : 0;

  type StudentWithRisk = Student & {
    isAtRisk: boolean;
  };

  const studentsWithRisk: StudentWithRisk[] =
    students.map((student) => ({
      ...student,
      isAtRisk: riskStudents.some(
        (risk) => risk.id === student.id
      ),
    }));

  return (
    <>

      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value={total_students ? total_students : "--"}
        variant="compact"
      />

      <InfoCard
        icon={Percent}
        colorIcon="blue"
        title="Asistencia media"
        value={attendancePercentage ? attendancePercentage + "%" : "--"}
        variant="compact"
      />
      <InfoCard
        icon={UserMinus}
        colorIcon="orange"
        title="Estudiantes en alerta"
        value={totalRiskStudents ? totalRiskStudents : "--"}
        variant="compact"
      />

      <Suspense fallback={<TableSkeleton />}>
        <StudentsTable data={studentsWithRisk} isLoading={loading} tableLegend={course?.name ?? "Estudiantes"} />
      </Suspense>

    </>
  );
}

