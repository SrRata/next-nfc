// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload } from "@/lib/auth/middleware";
import db from "@/lib/db";

// GET /api/notifications — historial del usuario autenticado
export async function GET(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const [rows]: any = await db.query(
      `SELECT
         n.id,
         n.type,
         n.message,
         n.created_at,
         nr.is_read,
         s.first_name,
         s.last_name,
         c.course_name
       FROM notifications n
       JOIN notification_recipients nr ON nr.notification_id = n.id
       JOIN students s                 ON s.id = n.student_id
       JOIN courses c                  ON c.id = s.course_id
       WHERE nr.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [payload.id]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH /api/notifications/:id/read — marcar como leída
// app/api/notifications/[id]/read/route.ts