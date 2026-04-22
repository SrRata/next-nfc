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

import { Users, Book, ChartArea, History, UserMinus } from "lucide-react";

export default function HomePageTeacher() {
  return (
    <>
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value="24 estudiantes"
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
        value="92.4%"
      />

      <CourseOverviewCard>
        <CourseOverviewHeader
          courseName="1ro de Informatica - Vespertina"
          schedule="12:05 - 18:30"
        />

        <CourseOverviewStats isActive>
          <AttendanceStatCard present={24} total={30} />
          <AbsenceStatCard absences={2} late={4} />
        </CourseOverviewStats>

        <LastRegister lastStudent="Luis Matailo" createdAt={new Date()} href="/dashboard/students?course=id" />
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

      <NotificationContainer>
        <NotificationHeader
          title="Actividad reciente en mis cursos asignados."
          description="Ultimos 5 registros de actividad."
          href="/dashboard/history"
          hrefLabel="Ver todo"
        />
        <NotificationItem
          name="Luis Matailo"
          message="registro una entrada puntutal"
          createdAt={new Date(Date.now() - 6 * 3600 * 1000)}
          course="3ro de informatica - vespertina"
          variant="success"
        />
        <NotificationItem
          name="Luis Matailo"
          message="registro una entrada puntutal"
          createdAt={new Date()}
          course="3ro de informatica - vespertina"
          variant="warning"
        />
        <NotificationItem
          name="Luis Matailo"
          message="registro una entrada puntutal"
          createdAt={new Date()}
          course="3ro de informatica - vespertina"
          variant="danger"
        />
        <NotificationItem
          name="Luis Matailo"
          message="registro una entrada puntutal"
          createdAt={new Date()}
          course="3ro de informatica - vespertina"
          variant="info"
        />
        <NotificationItem
          name="Luis Matailo"
          message="registro una entrada puntutal"
          createdAt={new Date()}
          course="3ro de informatica - vespertina"
          variant="info"
        />
      </NotificationContainer>
    </>
  );
}
