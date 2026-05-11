/**
 * GET /api/reports/by-course
 *
 * Roles: admin, profesor   (usuario → 403)
 *
 * Estadísticas de asistencia agrupadas por curso.
 *  - admin   → todos los cursos activos
 *  - profesor → solo su curso asignado
 *
 * Query params:
 *  - dateFrom  YYYY-MM-DD  (default: primer día del mes actual)
 *  - dateTo    YYYY-MM-DD  (default: último día del mes actual)
 *
 * Respuesta:
 * {
 *   courses: {
 *     courseId:       number,
 *     courseName:     string,
 *     section:        string,
 *     level:          string,
 *     totalStudents:  number,
 *     present:        number,   // registros en el rango
 *     late:           number,   // tardanzas en el rango
 *     attendanceRate: number    // % sobre total_attendances + total_absences
 *   }[]
 * }
 *
 * Gráficos sugeridos:
 *  <BarChart layout="vertical"> comparando attendanceRate por curso
 *  Tabla ordenable (ideal para admin con muchos cursos)
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
  if (auth.role === "usuario") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

  const { id: userId, role } = auth;
  const { dateFrom, dateTo } = getDateRange(req.nextUrl.searchParams);

  // Para profesor: obtener su courseId primero
  let courseWhereClause = "";
  const baseParams: (string | number)[] = [dateFrom, dateTo, dateFrom, dateTo];

  if (role === "profesor") {
    const [courseRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM courses WHERE professor_id = ? AND is_active = TRUE LIMIT 1`,
      [userId]
    );
    if (!(courseRows as RowDataPacket[]).length) {
      return NextResponse.json({ error: "No tienes un curso asignado" }, { status: 404 });
    }
    const courseId = (courseRows as RowDataPacket[])[0].id;
    courseWhereClause = "AND c.id = ?";
    baseParams.push(courseId);
  }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT
       c.id                                           AS courseId,
       c.course_name                                  AS courseName,
       sec.name                                       AS section,
       el.name                                        AS level,
       COUNT(DISTINCT s.id)                           AS totalStudents,
       COALESCE(SUM(ss.total_attendances), 0)         AS allTimePresent,
       COALESCE(SUM(ss.total_absences),   0)          AS allTimeAbsent,
       -- Presentes en el rango de fechas
       (SELECT COUNT(*) FROM attendance_records ar2
        JOIN students s2 ON s2.id = ar2.student_id
        WHERE s2.course_id = c.id AND ar2.date BETWEEN ? AND ?) AS present,
       -- Tardanzas en el rango de fechas
       (SELECT COUNT(*) FROM attendance_records ar3
        JOIN students s3 ON s3.id = ar3.student_id
        JOIN schedules sch3
          ON sch3.educational_level_id = c.educational_level_id
         AND sch3.section_id           = c.section_id
        WHERE s3.course_id = c.id
          AND ar3.date BETWEEN ? AND ?
          AND ar3.entry_time > ADDTIME(sch3.entry_time, SEC_TO_TIME(sch3.entry_tolerance * 60))
       ) AS late
     FROM courses c
     JOIN sections sec          ON sec.id = c.section_id
     JOIN educational_levels el ON el.id  = c.educational_level_id
     LEFT JOIN students s        ON s.course_id = c.id AND s.is_active = TRUE
     LEFT JOIN student_summaries ss ON ss.student_id = s.id
     WHERE c.is_active = TRUE ${courseWhereClause}
     GROUP BY c.id, c.course_name, sec.name, el.name`,
    baseParams
  );

  const courses = (rows as RowDataPacket[]).map((r) => {
    const allTimePresent = Number(r.allTimePresent);
    const allTimeAbsent  = Number(r.allTimeAbsent);
    const total          = allTimePresent + allTimeAbsent;
    return {
      courseId:       r.courseId,
      courseName:     r.courseName,
      section:        r.section,
      level:          r.level,
      totalStudents:  Number(r.totalStudents),
      present:        Number(r.present),
      late:           Number(r.late),
      attendanceRate: total > 0 ? +((allTimePresent / total) * 100).toFixed(1) : 0,
    };
  });

  return NextResponse.json({ courses });
}