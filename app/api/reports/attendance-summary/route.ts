/**
 * GET /api/reports/attendance-summary
 *
 * Roles:
 *  - admin   → resumen global (todos los cursos)
 *  - profesor → resumen de su curso asignado
 *  - usuario  → resumen de cada hijo vinculado
 *
 * Query params:
 *  - dateFrom  string  YYYY-MM-DD  (default: primer día del mes actual)
 *  - dateTo    string  YYYY-MM-DD  (default: último día del mes actual)
 *
 * ─── Respuesta admin / profesor ──────────────────────────────
 * {
 *   summary: {
 *     totalStudents: number,
 *     totalPresent:  number,
 *     totalAbsent:   number,
 *     totalLate:     number,
 *     attendanceRate: number   // porcentaje 0-100
 *   },
 *   byMonth: { month: string, present: number, late: number }[]
 * }
 *
 * ─── Respuesta usuario ────────────────────────────────────────
 * {
 *   children: {
 *     student: { id, name, course },
 *     summary: { totalPresent, totalAbsent, totalLate, attendanceRate },
 *     byMonth: { month, present, late }[]
 *   }[]
 * }
 *
 * Gráficos sugeridos:
 *  byMonth        → <BarChart> agrupado (present / late)
 *  attendanceRate → <RadialBarChart> o KPI card
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
    const [summaryRows] = await db.query<RowDataPacket[]>(
      `SELECT
         COUNT(DISTINCT s.id)              AS totalStudents,
         COALESCE(SUM(ss.total_attendances), 0) AS totalPresent,
         COALESCE(SUM(ss.total_absences),   0) AS totalAbsent
       FROM students s
       LEFT JOIN student_summaries ss ON ss.student_id = s.id
       WHERE s.is_active = TRUE`
    );

    const [lateRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalLate
       FROM attendance_records ar
       JOIN students s  ON s.id  = ar.student_id
       JOIN courses c   ON c.id  = s.course_id
       JOIN schedules sch
         ON sch.educational_level_id = c.educational_level_id
        AND sch.section_id           = c.section_id
       WHERE ar.date BETWEEN ? AND ?
         AND ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))`,
      [dateFrom, dateTo]
    );

    const [byMonthRows] = await db.query<RowDataPacket[]>(
      `SELECT
         DATE_FORMAT(ar.date, '%Y-%m') AS monthKey,
         DATE_FORMAT(ar.date, '%M')    AS month,
         COUNT(ar.id)                  AS present,
         SUM(ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))) AS late
       FROM attendance_records ar
       JOIN students s  ON s.id = ar.student_id
       JOIN courses c   ON c.id = s.course_id
       JOIN schedules sch
         ON sch.educational_level_id = c.educational_level_id
        AND sch.section_id           = c.section_id
       WHERE ar.date BETWEEN ? AND ?
       GROUP BY monthKey, month
       ORDER BY monthKey`,
      [dateFrom, dateTo]
    );

    const totalPresent = Number(summaryRows[0].totalPresent);
    const totalAbsent  = Number(summaryRows[0].totalAbsent);
    const totalLate    = Number(lateRows[0].totalLate);
    const total        = totalPresent + totalAbsent;

    return NextResponse.json({
      summary: {
        totalStudents:  Number(summaryRows[0].totalStudents),
        totalPresent,
        totalAbsent,
        totalLate,
        attendanceRate: total > 0 ? +((totalPresent / total) * 100).toFixed(1) : 0,
      },
      byMonth: (byMonthRows as RowDataPacket[]).map((r) => ({
        month:   r.month,
        present: Number(r.present),
        late:    Number(r.late),
      })),
    });
  }

  // ── PROFESOR ───────────────────────────────────────────────────────────────
  if (role === "profesor") {
    const [courseRows] = await db.query<RowDataPacket[]>(
      `SELECT id, course_name, educational_level_id, section_id
       FROM courses WHERE professor_id = ? AND is_active = TRUE LIMIT 1`,
      [userId]
    );
    if (!(courseRows as RowDataPacket[]).length) {
      return NextResponse.json({ error: "No tienes un curso asignado" }, { status: 404 });
    }
    const course = (courseRows as RowDataPacket[])[0];

    const [summaryRows] = await db.query<RowDataPacket[]>(
      `SELECT
         COUNT(DISTINCT s.id)               AS totalStudents,
         COALESCE(SUM(ss.total_attendances), 0) AS totalPresent,
         COALESCE(SUM(ss.total_absences),   0) AS totalAbsent
       FROM students s
       LEFT JOIN student_summaries ss ON ss.student_id = s.id
       WHERE s.course_id = ? AND s.is_active = TRUE`,
      [course.id]
    );

    const [lateRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalLate
       FROM attendance_records ar
       JOIN students s ON s.id = ar.student_id
       JOIN schedules sch
         ON sch.educational_level_id = ? AND sch.section_id = ?
       WHERE s.course_id = ?
         AND ar.date BETWEEN ? AND ?
         AND ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))`,
      [course.educational_level_id, course.section_id, course.id, dateFrom, dateTo]
    );

    const [byMonthRows] = await db.query<RowDataPacket[]>(
      `SELECT
         DATE_FORMAT(ar.date, '%Y-%m') AS monthKey,
         DATE_FORMAT(ar.date, '%M')    AS month,
         COUNT(ar.id)                  AS present,
         SUM(ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))) AS late
       FROM attendance_records ar
       JOIN students s ON s.id = ar.student_id
       JOIN schedules sch
         ON sch.educational_level_id = ? AND sch.section_id = ?
       WHERE s.course_id = ? AND ar.date BETWEEN ? AND ?
       GROUP BY monthKey, month
       ORDER BY monthKey`,
      [course.educational_level_id, course.section_id, course.id, dateFrom, dateTo]
    );

    const totalPresent = Number((summaryRows as RowDataPacket[])[0].totalPresent);
    const totalAbsent  = Number((summaryRows as RowDataPacket[])[0].totalAbsent);
    const totalLate    = Number((lateRows as RowDataPacket[])[0].totalLate);
    const total        = totalPresent + totalAbsent;

    return NextResponse.json({
      course: { id: course.id, name: course.course_name },
      summary: {
        totalStudents:  Number((summaryRows as RowDataPacket[])[0].totalStudents),
        totalPresent,
        totalAbsent,
        totalLate,
        attendanceRate: total > 0 ? +((totalPresent / total) * 100).toFixed(1) : 0,
      },
      byMonth: (byMonthRows as RowDataPacket[]).map((r) => ({
        month:   r.month,
        present: Number(r.present),
        late:    Number(r.late),
      })),
    });
  }

  // ── USUARIO (representante) ────────────────────────────────────────────────
  if (role === "usuario") {
    const [children] = await db.query<RowDataPacket[]>(
      `SELECT s.id,
              CONCAT(s.first_name, ' ', s.last_name) AS name,
              c.course_name  AS course,
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
        const [sumRows] = await db.query<RowDataPacket[]>(
          `SELECT total_attendances AS totalPresent, total_absences AS totalAbsent
           FROM student_summaries WHERE student_id = ?`,
          [child.id]
        );

        const [lateRows] = await db.query<RowDataPacket[]>(
          `SELECT COUNT(*) AS totalLate
           FROM attendance_records ar
           JOIN schedules sch
             ON sch.educational_level_id = ? AND sch.section_id = ?
           WHERE ar.student_id = ?
             AND ar.date BETWEEN ? AND ?
             AND ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))`,
          [child.educational_level_id, child.section_id, child.id, dateFrom, dateTo]
        );

        const [byMonthRows] = await db.query<RowDataPacket[]>(
          `SELECT
             DATE_FORMAT(ar.date, '%Y-%m') AS monthKey,
             DATE_FORMAT(ar.date, '%M')    AS month,
             COUNT(ar.id)                  AS present,
             SUM(ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))) AS late
           FROM attendance_records ar
           JOIN schedules sch
             ON sch.educational_level_id = ? AND sch.section_id = ?
           WHERE ar.student_id = ? AND ar.date BETWEEN ? AND ?
           GROUP BY monthKey, month
           ORDER BY monthKey`,
          [child.educational_level_id, child.section_id, child.id, dateFrom, dateTo]
        );

        const totalPresent = Number((sumRows as RowDataPacket[])[0]?.totalPresent ?? 0);
        const totalAbsent  = Number((sumRows as RowDataPacket[])[0]?.totalAbsent  ?? 0);
        const totalLate    = Number((lateRows as RowDataPacket[])[0].totalLate);
        const total        = totalPresent + totalAbsent;

        return {
          student: { id: child.id, name: child.name, course: child.course },
          summary: {
            totalPresent,
            totalAbsent,
            totalLate,
            attendanceRate: total > 0 ? +((totalPresent / total) * 100).toFixed(1) : 0,
          },
          byMonth: (byMonthRows as RowDataPacket[]).map((r) => ({
            month:   r.month,
            present: Number(r.present),
            late:    Number(r.late),
          })),
        };
      })
    );

    return NextResponse.json({ children: result });
  }

  return NextResponse.json({ error: "Rol no reconocido" }, { status: 400 });
}