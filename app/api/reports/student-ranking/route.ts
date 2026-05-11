/**
 * GET /api/reports/student-ranking
 *
 * Roles: admin, profesor   (usuario → 403)
 *
 * Lista paginada de estudiantes ordenados por tasa de asistencia.
 *  - admin   → todos (filtrable por courseId)
 *  - profesor → solo los de su curso
 *
 * Query params:
 *  - courseId  number   (opcional, solo admin)
 *  - order     asc|desc (default: asc = peor asistencia primero)
 *  - limit     number   (default: 20, max: 100)
 *  - offset    number   (default: 0)
 *
 * Respuesta:
 * {
 *   total: number,
 *   students: {
 *     studentId:      number,
 *     name:           string,
 *     cdl:            string,
 *     courseName:     string,
 *     section:        string,
 *     level:          string,
 *     totalPresent:   number,
 *     totalAbsent:    number,
 *     totalLate:      number,
 *     attendanceRate: number
 *   }[]
 * }
 *
 * Gráficos sugeridos:
 *  Tabla con barra de progreso inline por attendanceRate
 *  <BarChart layout="vertical"> top/bottom 10
 */

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getTokenPayload } from "@/lib/auth/middleware";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  const auth = getTokenPayload(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (auth.role === "usuario") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

  const { id: userId, role } = auth;
  const sp = req.nextUrl.searchParams;

  const order  = sp.get("order") === "desc" ? "DESC" : "ASC";
  const limit  = Math.min(parseInt(sp.get("limit")  ?? "20", 10), 100);
  const offset = Math.max(parseInt(sp.get("offset") ?? "0",  10), 0);

  // Construir filtro de curso
  let courseWhere = "";
  const filterParams: number[] = [];

  if (role === "profesor") {
    const [courseRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM courses WHERE professor_id = ? AND is_active = TRUE LIMIT 1`,
      [userId]
    );
    if (!(courseRows as RowDataPacket[]).length) {
      return NextResponse.json({ error: "No tienes un curso asignado" }, { status: 404 });
    }
    courseWhere = "AND s.course_id = ?";
    filterParams.push((courseRows as RowDataPacket[])[0].id);
  } else if (role === "admin") {
    const courseIdParam = sp.get("courseId");
    if (courseIdParam) {
      courseWhere = "AND s.course_id = ?";
      filterParams.push(parseInt(courseIdParam, 10));
    }
  }

  // Total para paginación
  const [countRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM students s WHERE s.is_active = TRUE ${courseWhere}`,
    filterParams
  );

  // Query principal
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT
       s.id                                        AS studentId,
       CONCAT(s.first_name, ' ', s.last_name)     AS name,
       s.cdl,
       c.course_name                               AS courseName,
       sec.name                                    AS section,
       el.name                                     AS level,
       COALESCE(ss.total_attendances, 0)           AS totalPresent,
       COALESCE(ss.total_absences,   0)            AS totalAbsent,
       -- Tardanzas totales del estudiante
       (SELECT COUNT(*)
        FROM attendance_records ar
        JOIN schedules sch
          ON sch.educational_level_id = c.educational_level_id
         AND sch.section_id           = c.section_id
        WHERE ar.student_id = s.id
          AND ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))
       )                                           AS totalLate,
       CASE
         WHEN COALESCE(ss.total_attendances, 0) + COALESCE(ss.total_absences, 0) = 0 THEN 0
         ELSE ROUND(
           ss.total_attendances * 100.0 /
           (ss.total_attendances + ss.total_absences), 1
         )
       END                                         AS attendanceRate
     FROM students s
     LEFT JOIN student_summaries ss ON ss.student_id = s.id
     LEFT JOIN courses c            ON c.id  = s.course_id
     LEFT JOIN sections sec         ON sec.id = c.section_id
     LEFT JOIN educational_levels el ON el.id = c.educational_level_id
     WHERE s.is_active = TRUE ${courseWhere}
     ORDER BY attendanceRate ${order}
     LIMIT ? OFFSET ?`,
    [...filterParams, limit, offset]
  );

  return NextResponse.json({
    total: Number((countRows as RowDataPacket[])[0].total),
    students: (rows as RowDataPacket[]).map((r) => ({
      studentId:      Number(r.studentId),
      name:           r.name,
      cdl:            r.cdl,
      courseName:     r.courseName,
      section:        r.section,
      level:          r.level,
      totalPresent:   Number(r.totalPresent),
      totalAbsent:    Number(r.totalAbsent),
      totalLate:      Number(r.totalLate),
      attendanceRate: Number(r.attendanceRate),
    })),
  });
}