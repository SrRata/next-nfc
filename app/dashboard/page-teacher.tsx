import AttendanceNotifications from "@/components/AttendanceNotifications";
import {
  AbsenceStatCard,
  AttendanceStatCard,
  CourseOverviewCard,
  CourseOverviewHeader,
  CourseOverviewStats,
} from "@/components/course-overview-card";

import { InfoCard } from "@/components/info-card";
import { LastRegister } from "@/components/last-register";

import { LinkCard } from "@/components/link-card";

import {
  NotificationContainer,
  NotificationHeader,
  NotificationItem,
} from "@/components/notification";
import { NotificationsRealtime } from "@/components/ui/notificationswhitpolling";

import { Users, Book, ChartArea, History, UserMinus } from "lucide-react";
import { usePolling } from "@/hooks/usePolling";
import { Metrics } from "@/types/metrics";
import axios from "axios";
import { useEffect, useState } from "react";

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


export default function HomePageTeacher() {
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

  useEffect(() => {
    getProfile();
  }, []);


  const { data: listData, loading } =
    usePolling<{
      course: Course | null;
      students: Student[];
    }>(
      `/api/realtime/student-list?professor_id=${user.id}`, 5000
    );

  const validAttendance = ["presente", "atrasado"];


  const students = listData?.students ?? [];
  const course = listData?.course;

  const totalStudents = students.length;

  // const presentStudents = students.filter(
  //   (s) => s.status === "presente"
  // ).length;

  const presentStudents = students.filter(
    (e) => validAttendance.includes(e.status)
  ).length;


  const lateStudents = students.filter(
    (s) => s.status === "atrasado"
  ).length;

  const absentStudents = students.filter(
    (s) => s.status === "ausente"
  ).length;

  // const attendancePercentage =
  //   totalStudents > 0
  //     ? (
  //       ((presentStudents + lateStudents) * 100) /
  //       totalStudents
  //     ).toFixed(0)
  //     : "0";


  const attendancePercentage =
    totalStudents > 0
      ? Number(
        (
          (students.filter((e) =>
            validAttendance.includes(e.status)
          ).length *
            100) /
          totalStudents
        ).toFixed(0)
      )
      : 0;

  return (
    <>
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value={totalStudents ? totalStudents + " Estudiantes" : "--"}
      />
      <InfoCard
        icon={UserMinus}
        colorIcon="red"
        title="Estudiantes en alerta"
        value="6 estudiantes"
      />
      <InfoCard
        icon={ChartArea}
        colorIcon="green"
        title="Asistencia hoy"
        value={`${attendancePercentage}%`}
      />

      <CourseOverviewCard>
        <CourseOverviewHeader
          courseName={course?.name ?? "Curso"}
        />

        <CourseOverviewStats isActive>
          <AttendanceStatCard present={presentStudents} total={totalStudents} />
          <AbsenceStatCard late={lateStudents} absences={absentStudents} />
        </CourseOverviewStats>

        <LastRegister href="/dashboard/students" />
      </CourseOverviewCard>

      <LinkCard
        title="Gestión de mis alumnos"
        description="Ver dichas, reportes individuales y tags asignados a sus estudiantes."
        href="/dashboard/students"
        icon={Users}
      />
      <LinkCard
        title="Historial de registros"
        description="Revise el registro de asistencia en dias anteriores y modifique estados si es necesario."
        href="/dashboard/history"
        icon={History}
      />


      <NotificationsRealtime
        notificationsUrl="/api/realtime/notifications?course_id=36"
      />
    </>
  );
}
