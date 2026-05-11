/**
 * GET /api/reports/notifications-summary
 *
 * Roles: admin, profesor, usuario
 *
 * Resumen de notificaciones del usuario autenticado.
 * No requiere query params.
 *
 * Respuesta:
 * {
 *   unread: number,
 *   total:  number,
 *   byType: { type: 'entry'|'exit'|'absence', count: number, unreadCount: number }[]
 * }
 *
 * Gráficos sugeridos:
 *  byType → <PieChart> pequeño o badge counters en el header del dashboard
 *  unread → KPI card con número destacado
 */

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getTokenPayload } from "@/lib/auth/middleware";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  const auth = getTokenPayload(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: userId } = auth;

  const [totalRows] = await db.query<RowDataPacket[]>(
    `SELECT
       COUNT(*)                                                    AS total,
       SUM(CASE WHEN nr.is_read = FALSE THEN 1 ELSE 0 END)       AS unread
     FROM notification_recipients nr
     WHERE nr.user_id = ?`,
    [userId]
  );

  const [byTypeRows] = await db.query<RowDataPacket[]>(
    `SELECT
       n.type,
       COUNT(*)                                                    AS count,
       SUM(CASE WHEN nr.is_read = FALSE THEN 1 ELSE 0 END)       AS unreadCount
     FROM notification_recipients nr
     JOIN notifications n ON n.id = nr.notification_id
     WHERE nr.user_id = ?
     GROUP BY n.type`,
    [userId]
  );

  return NextResponse.json({
    unread: Number((totalRows as RowDataPacket[])[0]?.unread ?? 0),
    total:  Number((totalRows as RowDataPacket[])[0]?.total  ?? 0),
    byType: (byTypeRows as RowDataPacket[]).map((r) => ({
      type:        r.type as "entry" | "exit" | "absence",
      count:       Number(r.count),
      unreadCount: Number(r.unreadCount),
    })),
  });
}