// components/NotificationsWithPolling.tsx
"use client";

import { usePolling } from "@/hooks/usePolling";
import {
  NotificationContainer,
  NotificationHeader,
  NotificationItem,
} from "@/components/notification";

interface NotifRecord {
  id: number;
  first_name: string;
  last_name: string;
  entry_time: string | null;
  exit_time: string | null;
  observation: string | null;
  course_name?: string;
}

// Convierte la observation de la BD al variant de tu componente
function getVariant(record: NotifRecord) {
  if (record.exit_time) return "info";                           // salida
  if (record.observation?.includes("Atrasado")) return "warning"; // atrasado
  return "success";                                              // puntual
}

// Arma el mensaje legible
function getMessage(record: NotifRecord) {
  if (record.exit_time) return "registró su salida";
  if (record.observation?.includes("Atrasado")) return "llegó con atraso";
  return "registró su entrada";
}

// Convierte "08:32:00" de la BD a un Date de hoy para getRelativeTime y formatTime
function timeToDate(time: string | null): Date {
  if (!time) return new Date();
  const [h, m, s] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, s ?? 0, 0);
  return d;
}

interface Props {
  notificationsUrl: string;
  title?: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}

export function NotificationsRealtime({
  notificationsUrl,
  title = "Actividad reciente",
  description = "Últimos registros del día",
  href = "/dashboard/asistencia",
  hrefLabel = "Ver todo",
}: Props) {
  const { data, loading } = usePolling<{ records: NotifRecord[] }>(
    notificationsUrl
  );

  const records = data?.records ?? [];

  return (
    <NotificationContainer>
      <NotificationHeader
        title={title}
        description={description}
        href={href}
        hrefLabel={hrefLabel}
      />

      {loading && (
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
          Cargando...
        </p>
      )}

      {!loading && records.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
          Sin registros hoy todavía
        </p>
      )}

      {records.map((r) => (
        <NotificationItem
          key={r.id}
          name={`${r.first_name} ${r.last_name}`}
          message={getMessage(r)}
          createdAt={timeToDate(r.exit_time ?? r.entry_time)}
          course={r.course_name ?? ""}
          variant={getVariant(r)}
        />
      ))}
    </NotificationContainer>
  );
}