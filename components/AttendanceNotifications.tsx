"use client";
import { useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationHeader,
  NotificationItem,
} from "@/components/notification"; 
import { useNotifications } from "@/hooks/useNotifications";

interface Props {
  className?: string;
}

export default function AttendanceNotifications({ className }: Props) {
  const [initialData, setInitialData] = useState([]);

  // Cargar historial al montar
  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setInitialData(
            data.data.map((n: any) => ({
              id: n.id,
              type: n.type,
              variant: typeToVariant(n.type),
              name: `${n.first_name} ${n.last_name}`,
              message: n.message,
              course: n.course_name,
              createdAt: n.created_at,
            }))
          );
        }
      });
  }, []);

  const { notifications, connected } = useNotifications(initialData);

  return (
    <NotificationContainer className={className}>
      <NotificationHeader
        title="Notificaciones"
        description={connected ? "● En vivo" : "○ Reconectando..."}
        href="/dashboard/notifications"
        hrefLabel="Ver todas"
      />

      {notifications.length === 0 && (
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          No hay notificaciones recientes.
        </p>
      )}

      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          name={n.name}
          message={n.message}
          createdAt={n.createdAt}
          course={n.course}
          variant={n.variant as any}
        />
      ))}
    </NotificationContainer>
  );
}

function typeToVariant(type: string) {
  return { entry: "success", exit: "info", absence: "danger" }[type] ?? "warning";
}