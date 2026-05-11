/**
 * GET /api/reports/daily-trend
 *
 * Roles: admin, profesor, usuario
 *
 * Evolución diaria de asistencia en el rango de fechas.
 *
 * Query params:
 *  - dateFrom  YYYY-MM-DD  (default: primer día del mes actual)
 *  - dateTo    YYYY-MM-DD  (default: último día del mes actual)
 *
 * ─── Respuesta admin / profesor ──────────────────────────────
 * {
 *   trend: { date: string, present: number, late: number, absent: number }[]
 * }
 *
 * ─── Respuesta usuario ────────────────────────────────────────
 * {
 *   children: {
 *     student: { id, name },
 *     trend:   { date: string, status: 'on_time'|'late' }[]
 *   }[]
 * }
 *
 * Gráficos sugeridos:
 *  admin/profesor → <AreaChart> o <LineChart> con 3 series
 *  usuario       → <LineChart> simple de status por hijo
 */

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getTokenPayload } from "@/lib/auth/middleware";
import { RowDataPacket } from "mysql2";

function getDateRange(sp: URLSearchParams) {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return {
    dateFrom: sp.get("dateFrom") ?? fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    dateTo:   sp.get("dateTo")   ?? fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export async function GET(req: NextRequest) {
  const auth = getTokenPayload(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: userId, role } = auth;
  const { dateFrom, dateTo } = getDateRange(req.nextUrl.searchParams);

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if (role === "admin") {
    const [trendRows] = await db.query<RowDataPacket[]>(
      `SELECT
         ar.date,
         COUNT(ar.id) AS present,
         SUM(ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))) AS late
       FROM attendance_records ar
       JOIN students s ON s.id = ar.student_id
       JOIN courses c  ON c.id = s.course_id
       JOIN schedules sch
         ON sch.educational_level_id = c.educational_level_id
        AND sch.section_id           = c.section_id
       WHERE ar.date BETWEEN ? AND ?
       GROUP BY ar.date
       ORDER BY ar.date`,
      [dateFrom, dateTo]
    );

    const [totalStudentRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM students WHERE is_active = TRUE`
    );
    const totalStudents = Number((totalStudentRows as RowDataPacket[])[0].total);

    return NextResponse.json({
      trend: (trendRows as RowDataPacket[]).map((r) => {
        const present = Number(r.present);
        const late    = Number(r.late);
        return {
          date:    String(r.date).split("T")[0],
          present,
          late,
          absent:  Math.max(0, totalStudents - present),
        };
      }),
    });
  }

  // ── PROFESOR ───────────────────────────────────────────────────────────────
  if (role === "profesor") {
    const [courseRows] = await db.query<RowDataPacket[]>(
      `SELECT id, educational_level_id, section_id
       FROM courses WHERE professor_id = ? AND is_active = TRUE LIMIT 1`,
      [userId]
    );
    if (!(courseRows as RowDataPacket[]).length) {
      return NextResponse.json({ error: "No tienes un curso asignado" }, { status: 404 });
    }
    const course = (courseRows as RowDataPacket[])[0];

    const [trendRows] = await db.query<RowDataPacket[]>(
      `SELECT
         ar.date,
         COUNT(ar.id) AS present,
         SUM(ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))) AS late
       FROM attendance_records ar
       JOIN students s ON s.id = ar.student_id
       JOIN schedules sch
         ON sch.educational_level_id = ? AND sch.section_id = ?
       WHERE s.course_id = ? AND ar.date BETWEEN ? AND ?
       GROUP BY ar.date
       ORDER BY ar.date`,
      [course.educational_level_id, course.section_id, course.id, dateFrom, dateTo]
    );

    const [countRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM students WHERE course_id = ? AND is_active = TRUE`,
      [course.id]
    );
    const totalStudents = Number((countRows as RowDataPacket[])[0].total);

    return NextResponse.json({
      trend: (trendRows as RowDataPacket[]).map((r) => {
        const present = Number(r.present);
        const late    = Number(r.late);
        return {
          date:    String(r.date).split("T")[0],
          present,
          late,
          absent:  Math.max(0, totalStudents - present),
        };
      }),
    });
  }

  // ── USUARIO (representante) ────────────────────────────────────────────────
  if (role === "usuario") {
    const [children] = await db.query<RowDataPacket[]>(
      `SELECT s.id,
              CONCAT(s.first_name, ' ', s.last_name) AS name,
              c.educational_level_id,
              c.section_id
       FROM relationships r
       JOIN students s ON s.id = r.student_id
       LEFT JOIN courses c ON c.id = s.course_id
       WHERE r.parent_id = ?`,
      [userId]
    );

    const result = await Promise.all(
      (children as RowDataPacket[]).map(async (child) => {
        const [trendRows] = await db.query<RowDataPacket[]>(
          `SELECT
             ar.date,
             CASE
               WHEN ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))
               THEN 'late'
               ELSE 'on_time'
             END AS status
           FROM attendance_records ar
           JOIN schedules sch
             ON sch.educational_level_id = ? AND sch.section_id = ?
           WHERE ar.student_id = ? AND ar.date BETWEEN ? AND ?
           ORDER BY ar.date`,
          [child.educational_level_id, child.section_id, child.id, dateFrom, dateTo]
        );

        return {
          student: { id: child.id, name: child.name },
          trend: (trendRows as RowDataPacket[]).map((r) => ({
            date:   String(r.date).split("T")[0],
            status: r.status as "on_time" | "late",
          })),
        };
      })
    );

    return NextResponse.json({ children: result });
  }

  return NextResponse.json({ error: "Rol no reconocido" }, { status: 400 });
}