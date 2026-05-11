/**
 * GET /api/reports/student/[studentId]
 *
 * Roles: admin, profesor, usuario  (con control de acceso estricto)
 *  - admin   → cualquier estudiante
 *  - profesor → solo estudiantes de su curso
 *  - usuario  → solo sus hijos (tabla relationships)
 *
 * Query params:
 *  - dateFrom  YYYY-MM-DD  (default: primer día del mes actual)
 *  - dateTo    YYYY-MM-DD  (default: último día del mes actual)
 *
 * Respuesta:
 * {
 *   student: {
 *     id, name, cdl, email, phone, nfcUid,
 *     course, section, level
 *   },
 *   summary: {
 *     totalPresent, totalAbsent, totalLate, attendanceRate
 *   },
 *   byMonth: { month, present, late }[],
 *   recentRecords: {
 *     date, entryTime, exitTime, observation,
 *     status: 'on_time' | 'late' | 'absent'
 *   }[]   ← últimos 30 registros del rango
 * }
 *
 * Gráficos sugeridos:
 *  summary      → <RadialBarChart> con % de asistencia
 *  byMonth      → <BarChart> apilado (present + late)
 *  recentRecords → Tabla con badge de estado por fila
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
    dateTo: sp.get("dateTo") ?? fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: number } }
) {
  const auth = getTokenPayload(req);
  if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: userId, role } = auth;
  // const studentId = parseInt(params.studentId, 10);
  const { studentId } = await params;

  if (isNaN(studentId)) {
    return NextResponse.json({ error: "studentId inválido" }, { status: 400 });
  }

  const { dateFrom, dateTo } = getDateRange(req.nextUrl.searchParams);

  // ── Control de acceso por rol ──────────────────────────────────────────────
  if (role === "profesor") {
    const [check] = await db.query<RowDataPacket[]>(
      `SELECT s.id FROM students s
       JOIN courses c ON c.id = s.course_id
       WHERE s.id = ? AND c.professor_id = ? LIMIT 1`,
      [studentId, userId]
    );
    if (!(check as RowDataPacket[]).length) {
      return NextResponse.json({ error: "Este estudiante no pertenece a tu curso" }, { status: 403 });
    }
  }

  if (role === "usuario") {
    const [check] = await db.query<RowDataPacket[]>(
      `SELECT id FROM relationships WHERE parent_id = ? AND student_id = ? LIMIT 1`,
      [userId, studentId]
    );
    if (!(check as RowDataPacket[]).length) {
      return NextResponse.json({ error: "No tienes acceso a los datos de este estudiante" }, { status: 403 });
    }
  }

  // ── Datos del estudiante ───────────────────────────────────────────────────
  const [studentRows] = await db.query<RowDataPacket[]>(
    `SELECT
       s.id,
       CONCAT(s.first_name, ' ', s.last_name) AS name,
       s.cdl, s.email,
       s.phone_number   AS phone,
       s.nfc_uid        AS nfcUid,
       c.course_name    AS course,
       sec.name         AS section,
       el.name          AS level,
       c.educational_level_id,
       c.section_id
     FROM students s
     LEFT JOIN courses c            ON c.id  = s.course_id
     LEFT JOIN sections sec         ON sec.id = c.section_id
     LEFT JOIN educational_levels el ON el.id = c.educational_level_id
     WHERE s.id = ?`,
    [studentId]
  );
  if (!(studentRows as RowDataPacket[]).length) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }
  const student = (studentRows as RowDataPacket[])[0];

  // ── Resumen global (de student_summaries) ─────────────────────────────────
  const [sumRows] = await db.query<RowDataPacket[]>(
    `SELECT total_attendances AS totalPresent, total_absences AS totalAbsent
     FROM student_summaries WHERE student_id = ?`,
    [studentId]
  );

  // Tardanzas totales del estudiante
  const [lateRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS totalLate
     FROM attendance_records ar
     JOIN schedules sch
       ON sch.educational_level_id = ? AND sch.section_id = ?
     WHERE ar.student_id = ?
       AND ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))`,
    [student.educational_level_id, student.section_id, studentId]
  );

  const totalPresent = Number((sumRows as RowDataPacket[])[0]?.totalPresent ?? 0);
  const totalAbsent = Number((sumRows as RowDataPacket[])[0]?.totalAbsent ?? 0);
  const totalLate = Number((lateRows as RowDataPacket[])[0].totalLate);
  const total = totalPresent + totalAbsent;

  // ── Desglose por mes en el rango ──────────────────────────────────────────
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
    [student.educational_level_id, student.section_id, studentId, dateFrom, dateTo]
  );

  // ── Últimos 30 registros del rango ────────────────────────────────────────
  const [recentRows] = await db.query<RowDataPacket[]>(
    `SELECT
       ar.date,
       ar.entry_time  AS entryTime,
       ar.exit_time   AS exitTime,
       ar.observation,
       CASE
         WHEN ar.entry_time IS NULL THEN 'absent'
         WHEN ar.entry_time > ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60)) THEN 'late'
         ELSE 'on_time'
       END AS status
     FROM attendance_records ar
     JOIN schedules sch
       ON sch.educational_level_id = ? AND sch.section_id = ?
     WHERE ar.student_id = ? AND ar.date BETWEEN ? AND ?
     ORDER BY ar.date DESC
     LIMIT 30`,
    [student.educational_level_id, student.section_id, studentId, dateFrom, dateTo]
  );

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      cdl: student.cdl,
      email: student.email,
      phone: student.phone,
      nfcUid: student.nfcUid,
      course: student.course,
      section: student.section,
      level: student.level,
    },
    summary: {
      totalPresent,
      totalAbsent,
      totalLate,
      attendanceRate: total > 0 ? +((totalPresent / total) * 100).toFixed(1) : 0,
    },
    byMonth: (byMonthRows as RowDataPacket[]).map((r) => ({
      month: r.month,
      present: Number(r.present),
      late: Number(r.late),
    })),
    recentRecords: (recentRows as RowDataPacket[]).map((r) => ({
      date: String(r.date).split("T")[0],
      entryTime: r.entryTime,
      exitTime: r.exitTime,
      observation: r.observation,
      status: r.status as "on_time" | "late" | "absent",
    })),
  });
}