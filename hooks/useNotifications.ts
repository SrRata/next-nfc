"use client";
import { useEffect, useState, useRef } from "react";

export interface Notification {
  id: number;
  type: "entry" | "exit" | "absence";
  variant: "success" | "info" | "danger" | "warning";
  name: string;
  message: string;
  course: string;
  createdAt: string;
}

export function useNotifications(initialData: Notification[] = []) {
  const [notifications, setNotifications] = useState<Notification[]>(initialData);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/notifications/stream");
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Ignorar el ping de conexión
      if (data.type === "connected") return;

      // Agregar al inicio de la lista
      setNotifications((prev) => [data, ...prev].slice(0, 50));
    };

    es.onerror = () => {
      setConnected(false);
      // EventSource reconecta automáticamente
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, []);

  const markAsRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  };

  return { notifications, connected, markAsRead };
}