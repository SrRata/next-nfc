import { InfoCard } from "@/components/info-card";
import { LinkCard } from "@/components/link-card";

import {
  NotificationContainer,
  NotificationHeader,
  NotificationItem,
} from "@/components/notification";
import { SystemStatusCard } from "@/components/system-status-card";

import {
  Users,
  UserLock,
  History,
  Settings,
  Clipboard,
  Book,
  ChartArea,
} from "lucide-react";

export default function HomePageAdmin() {
  return (
    <>

      <InfoCard
        icon={Book}
        colorIcon="blue"
        title="Mis cursos"
        value="6 cursos"
      />
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value="24 estudiantes"
      />
      <InfoCard
        icon={ChartArea}
        colorIcon="green"
        title="Asistencia hoy"
        value="92.4%"
      />

      <SystemStatusCard
        isOnline
        course="3ro Informatica Vespertina"
        attendance={95}
        lastReading={new Date()}
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
        title="Configuración"
        description="Gestione los parametros del sistema como horarios y margenes de espera para los registros."
        href="/dashboard/settings"
        ctaText="Ir a configuraciones"
        icon={Settings}
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
      </NotificationContainer>
    </>
  );
}
