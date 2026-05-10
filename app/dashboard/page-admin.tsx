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
import { Metrics, MetricsAdmin } from "@/types/metrics";
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

  const [metrics, setMetrics] = useState<MetricsAdmin | null>(null);
  const [loadingMetricsAdmin, setLoadingMetricsAdmin] = useState(true);

   async function loadAdminMetrics() {
    try {
      const response = await axios.get('/api/metrics/admin');
      if (response.data.success) {
        setMetrics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoadingMetricsAdmin(false)
    }
  }

  useEffect(() => {
    loadAdminMetrics();
  }, [])



  return (
    <>
      {/* <RealtimeDashboard
        metricsUrl="/api/realtime/metrics"
        notificationsUrl="/api/realtime/notifications"
      /> */}

      {/* <RealtimeDashboard
        metricsUrl={`/api/realtime/metrics?course_id=36`}
        studentListUrl={`/api/realtime/student-list?course_id=36`}
        notificationsUrl={`/api/realtime/notifications?course_id=36`}
      /> */}

      {/* <RealtimeDashboard
        // metricsUrl={`/api/realtime/metrics?course_id=36`}
        notificationsUrl={`/api/realtime/notifications?student_id=48`} */}
      {/* /> */}

      <InfoCard
        icon={Book}
        colorIcon="blue"
        title="Mis cursos"
        value={metrics?.total_courses ? metrics.total_courses + " Cursos" : "--"}

      />
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value={metrics?.total_students ? metrics.total_students + " Estudiantes" : "--"}

      />
      <InfoCard
        icon={Users}
        colorIcon="yellow"
        title="Usuarios totales"
        value={metrics?.total_users ? metrics.total_users + " Usuarios" : "--"}
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

      <NotificationsRealtime
        notificationsUrl="/api/realtime/notifications"
      />
    </>
  );
}
