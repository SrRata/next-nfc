/**
 * GET /api/reports/absence-heatmap
 *
 * Roles: admin, profesor   (usuario → 403)
 *
 * Identifica patrones de ausencia por día de semana
 * y los días con peor asistencia en el rango.
 *  - admin   → todos los cursos
 *  - profesor → solo su curso
 *
 * Query params:
 *  - dateFrom  YYYY-MM-DD  (default: primer día del mes actual)
 *  - dateTo    YYYY-MM-DD  (default: último día del mes actual)
 *
 * Respuesta:
 * {
 *   byDayOfWeek: {
 *     dayOfWeek: string, dayNumber: number,
 *     present: number, absent: number, absenceRate: number
 *   }[],
 *   topAbsenceDays: {
 *     date: string, dayOfWeek: string,
 *     totalPresent: number, totalAbsent: number
 *   }[],
 *   worstDayOfWeek:  string,
 *   peakAbsenceMonth: string
 * }
 *
 * Gráficos sugeridos:
 *  byDayOfWeek   → <BarChart> por día de semana (Lu–Vi)
 *  topAbsenceDays → Tabla de días críticos o heatmap de calendario
 */

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getTokenPayload } from "@/lib/auth/middleware";
import { RowDataPacket } from "mysql2";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

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

  // Filtro de curso para profesor
  let courseWhere = "";
  const courseJoin = "JOIN students s ON s.id = ar.student_id";
  const filterParams: (string | number)[] = [dateFrom, dateTo];
  let totalStudents = 0;

  if (role === "profesor") {
    const [courseRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM courses WHERE professor_id = ? AND is_active = TRUE LIMIT 1`,
      [userId]
    );
    if (!(courseRows as RowDataPacket[]).length) {
      return NextResponse.json({ error: "No tienes un curso asignado" }, { status: 404 });
    }
    const courseId = (courseRows as RowDataPacket[])[0].id;
    courseWhere = "AND s.course_id = ?";
    filterParams.push(courseId);

    const [cntRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM students WHERE course_id = ? AND is_active = TRUE`,
      [courseId]
    );
    totalStudents = Number((cntRows as RowDataPacket[])[0].total);
  } else {
    const [cntRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM students WHERE is_active = TRUE`
    );
    totalStudents = Number((cntRows as RowDataPacket[])[0].total);
  }

  // ── Patrón por día de semana ───────────────────────────────────────────────
  const [byDayRows] = await db.query<RowDataPacket[]>(
    `SELECT
       DAYOFWEEK(ar.date) AS dayNumber,
       COUNT(ar.id)       AS present
     FROM attendance_records ar
     ${courseJoin}
     WHERE ar.date BETWEEN ? AND ? ${courseWhere}
     GROUP BY dayNumber
     ORDER BY dayNumber`,
    filterParams
  );

  const byDayOfWeek = (byDayRows as RowDataPacket[]).map((r) => {
    const present     = Number(r.present);
    const dayNum      = Number(r.dayNumber);
    const absent      = Math.max(0, totalStudents - present);
    const total       = present + absent;
    return {
      dayOfWeek:   DAY_NAMES[dayNum - 1] ?? `Día ${dayNum}`,
      dayNumber:   dayNum,
      present,
      absent,
      absenceRate: total > 0 ? +((absent / total) * 100).toFixed(1) : 0,
    };
  });

  // ── Top 10 días con más ausencias ─────────────────────────────────────────
  const [topRows] = await db.query<RowDataPacket[]>(
    `SELECT
       ar.date,
       DAYNAME(ar.date) AS dayOfWeek,
       COUNT(ar.id)     AS present
     FROM attendance_records ar
     ${courseJoin}
     WHERE ar.date BETWEEN ? AND ? ${courseWhere}
     GROUP BY ar.date, dayOfWeek
     ORDER BY present ASC
     LIMIT 10`,
    filterParams
  );

  // ── Mes con más ausencias (menos presentes) ───────────────────────────────
  const [peakRows] = await db.query<RowDataPacket[]>(
    `SELECT
       DATE_FORMAT(ar.date, '%Y-%m')    AS monthKey,
       DATE_FORMAT(ar.date, '%M %Y')   AS monthLabel,
       COUNT(ar.id)                     AS present
     FROM attendance_records ar
     ${courseJoin}
     WHERE ar.date BETWEEN ? AND ? ${courseWhere}
     GROUP BY monthKey, monthLabel
     ORDER BY present ASC
     LIMIT 1`,
    filterParams
  );

  const worstDay = byDayOfWeek.reduce<typeof byDayOfWeek[0] | null>(
    (worst, day) => (!worst || day.absenceRate > worst.absenceRate ? day : worst),
    null
  );

  return NextResponse.json({
    byDayOfWeek,
    topAbsenceDays: (topRows as RowDataPacket[]).map((r) => ({
      date:         String(r.date).split("T")[0],
      dayOfWeek:    r.dayOfWeek,
      totalPresent: Number(r.present),
      totalAbsent:  Math.max(0, totalStudents - Number(r.present)),
    })),
    worstDayOfWeek:   worstDay?.dayOfWeek ?? "N/A",
    peakAbsenceMonth: (peakRows as RowDataPacket[])[0]?.monthLabel ?? "N/A",
  });
}