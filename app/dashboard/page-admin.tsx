import AttendanceNotifications from "@/components/AttendanceNotifications";
import { InfoCard } from "@/components/info-card";
import { LinkCard } from "@/components/link-card";

import {
  NotificationContainer,
  NotificationHeader,
  NotificationItem,
} from "@/components/notification";
import { RealtimeDashboard } from "@/components/realtime";
import { SystemStatusCard } from "@/components/system-status-card";
import { NotificationsRealtime } from "@/components/ui/notificationswhitpolling";
import { Metrics } from "@/types/metrics";
import axios from "axios";

import {
  Users,
  UserLock,
  History,
  Settings,
  Clipboard,
  Book,
  ChartArea,
  Calendar1,
  CalendarClockIcon,
} from "lucide-react";
import { useEffect, useState } from "react";



export default function HomePageAdmin() {

  return (
    <>
      {/* <RealtimeDashboard
        metricsUrl="/api/realtime/metrics"
        notificationsUrl="/api/realtime/notifications"
      />

      <RealtimeDashboard
        metricsUrl={`/api/realtime/metrics?course_id=36`}
        studentListUrl={`/api/realtime/student-list?course_id=36`}
        notificationsUrl={`/api/realtime/notifications?course_id=36`}
      />

      <RealtimeDashboard
        // metricsUrl={`/api/realtime/metrics?course_id=36`}
        notificationsUrl={`/api/realtime/notifications?student_id=48`}
      /> */}

      <InfoCard
        icon={Book}
        colorIcon="blue"
        title="Mis cursos"
        // value={metrics?.total_courses ? metrics.total_courses + "Cursos" : "--"}
        value="--"
      />
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        // value={metrics?.total_students ? metrics.total_students + " Estudiantes" : "--"}
        value="--"

      />
      <InfoCard
        icon={Users}
        colorIcon="yellow"
        title="Usuarios totales"
        // value={metrics?.total_users ? metrics.total_users + " Usuarios" : "--"}
        value="--"
      />

      <LinkCard
        title="Gestión de estudiantes"
        description="Administre el registro de nuevos o existentes estudiantes, edición de perfiles y asignación de tags NFC."
        href="/dashboard/students-management"
        ctaText="Gestionar estudiantes"
        icon={Users}
      />
      <LinkCard
        title="Gestión de usuarios"
        description="Administre el registro de nuevos o existentes usuarios, edición de perfiles y asignación de permisos."
        href="/dashboard/users-management"
        ctaText="Gestionar usuarios"
        icon={UserLock}
      />

      <SystemStatusCard
        metricsUrl="/api/realtime/metrics"
      />

      <LinkCard
        title="Historial de asistencias"
        description="Consulta registros históricos de entradas y salidas de todos los estudiantes."
        href="/dashboard/history"
        ctaText="Visualizar historial"
        icon={History}
      />


      <LinkCard
        title="Reportes y estadísticas"
        description="Genere reportes PDF/Exel y visualice estadísticas de puntualidad y ausentismo."
        href="/dashboard/reports"
        ctaText="Visualizas estadísticas"
        icon={Clipboard}
      />
      <LinkCard
        title="Horarios"
        description="Gestione los horarios con margenes de espera para los registros de asistencia."
        href="/dashboard/settings"
        ctaText="Ir a horarios"
        icon={CalendarClockIcon}
      />

      {/* <NotificationContainer>
        <NotificationHeader
          title="Actividad reciente en mis cursos asignados."
          description="Ultimos 5 registros de actividad."
          href="/dashboard/history"
          hrefLabel="Ver todo"
        />
        <NotificationItem
          name="Luis Matailo"
          message="registro una entrada puntutal"
          createdAt={new Date(Date.now() - 3 * 60 * 1000)}
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
      </NotificationContainer> */}

      <NotificationsRealtime
        notificationsUrl="/api/realtime/notifications"
      />
    </>
  );
}
