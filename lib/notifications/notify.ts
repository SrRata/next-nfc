// lib/notifications/notify.ts
import pool from "@/lib/db";
import { sseBroker } from "./sse-broker";
import { PoolConnection } from "mysql2/promise";

type NotificationType = "entry" | "exit" | "absence";

interface NotifyParams {
  conn: PoolConnection;
  type: NotificationType;
  studentId: number;
  studentName: string;
  courseName: string;
  courseId: number;
  professorId: number | null;
  parentId: number | null;
  time: string;
}

// Mapeo a variante del componente NotificationItem
const typeToVariant: Record<NotificationType, string> = {
  entry:   "success",
  exit:    "info",
  absence: "danger",
};

const typeToMessage: Record<NotificationType, (time: string) => string> = {
  entry:   (t) => `registró su entrada a las ${t}`,
  exit:    (t) => `registró su salida a las ${t}`,
  absence: (_) => `fue marcado como ausente hoy`,
};

export async function createAndSendNotification(params: NotifyParams) {
  const {
    conn, type, studentId, studentName,
    courseName, courseId, professorId, parentId, time,
  } = params;

  const message = typeToMessage[type](time);

  // 1. Guardar notificación en BD
  const [result]: any = await conn.query(
    `INSERT INTO notifications (type, student_id, message)
     VALUES (?, ?, ?)`,
    [type, studentId, `${studentName} ${message}`]
  );
  const notificationId = result.insertId;

  // 2. Determinar destinatarios:
  //    - Todos los admins
  //    - El profesor del curso (si existe)
  //    - El padre/representante del estudiante (si existe)
  const recipientIds: number[] = [];

  // Obtener admins
  const [admins]: any = await conn.query(
    `SELECT id FROM users WHERE role = 'admin' AND is_active = TRUE`
  );
  admins.forEach((a: any) => recipientIds.push(a.id));

  // Agregar profesor si existe y no es admin
  if (professorId && !recipientIds.includes(professorId)) {
    recipientIds.push(professorId);
  }

  // Agregar padre si existe y no es admin
  if (parentId && !recipientIds.includes(parentId)) {
    recipientIds.push(parentId);
  }

  // 3. Insertar en notification_recipients
  if (recipientIds.length) {
    const values = recipientIds.map(uid => [notificationId, uid]);
    await conn.query(
      `INSERT IGNORE INTO notification_recipients (notification_id, user_id)
       VALUES ?`,
      [values]
    );
  }

  // 4. Enviar por SSE en tiempo real
  const ssePayload = {
    id: notificationId,
    type,
    variant: typeToVariant[type],
    name: studentName,
    message,
    course: courseName,
    createdAt: new Date().toISOString(),
  };

  sseBroker.sendToUsers(recipientIds, ssePayload);
}