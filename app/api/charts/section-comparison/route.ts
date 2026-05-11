import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import db from "@/lib/db";
import { format, subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const sectionIds         = searchParams.getAll("section_id").map(Number).filter(Boolean);
  const courseIds          = searchParams.getAll("course_id").map(Number).filter(Boolean);
  const educationalLevelId = searchParams.get("educational_level_id") ? Number(searchParams.get("educational_level_id")) : null;
  const professorId        = searchParams.get("professor_id")         ? Number(searchParams.get("professor_id"))         : null;
  const dateFrom           = searchParams.get("date_from") ?? format(subDays(new Date(), 29), "yyyy-MM-dd");
  const dateTo             = searchParams.get("date_to")   ?? format(new Date(), "yyyy-MM-dd");
  const groupBy            = (searchParams.get("group_by") ?? "day") as "day" | "week" | "month";

  const periodExpr = {
    day:   "DATE_FORMAT(ar.date, '%Y-%m-%d')",
    week:  "DATE_FORMAT(ar.date, '%Y-W%u')",
    month: "DATE_FORMAT(ar.date, '%Y-%m')",
  }[groupBy];

  // ── Filtros compartidos ───────────────────────────────────────────────────
  const buildConditions = (tablePrefix: "ar" | "st" = "ar") => {
    const conds: string[] = ["st.is_active = 1", "c.is_active = 1"];
    const p: (string | number)[] = [];

    if (professorId)        { conds.push("c.professor_id = ?");         p.push(professorId); }
    if (courseIds.length === 1) { conds.push("c.id = ?");               p.push(courseIds[0]); }
    else if (courseIds.length > 1) {
      conds.push(`c.id IN (${courseIds.map(() => "?").join(",")})`);
      p.push(...courseIds);
    }
    if (educationalLevelId) { conds.push("c.educational_level_id = ?"); p.push(educationalLevelId); }
    if (sectionIds.length === 1) { conds.push("sec.id = ?");            p.push(sectionIds[0]); }
    else if (sectionIds.length > 1) {
      conds.push(`sec.id IN (${sectionIds.map(() => "?").join(",")})`);
      p.push(...sectionIds);
    }

    return { conds, p };
  };

  // ── Query 1: registros de asistencia por período y sección ───────────────
  const { conds: mainConds, p: mainExtra } = buildConditions();
  const mainSql = `
    SELECT
      ${periodExpr}                                                      AS period,
      sec.id                                                             AS section_id,
      sec.name                                                           AS section_name,
      SUM(CASE WHEN ar.entry_time IS NOT NULL THEN 1 ELSE 0 END)        AS present
    FROM attendance_records ar
    JOIN students st  ON st.id  = ar.student_id
    JOIN courses  c   ON c.id   = st.course_id
    JOIN sections sec ON sec.id = c.section_id
    WHERE ar.date BETWEEN ? AND ?
      AND ${mainConds.join(" AND ")}
    GROUP BY period, sec.id, sec.name
    ORDER BY period ASC, sec.name ASC
  `;
  const mainParams = [dateFrom, dateTo, ...mainExtra];

  // ── Query 2: total de estudiantes matriculados por sección ───────────────
  // Este es el denominador real — independiente de si el día terminó o no.
  const { conds: enrolledConds, p: enrolledExtra } = buildConditions();
  const enrolledSql = `
    SELECT
      sec.id                        AS section_id,
      COUNT(DISTINCT st.id)         AS total_students
    FROM students st
    JOIN courses  c   ON c.id   = st.course_id
    JOIN sections sec ON sec.id = c.section_id
    WHERE ${enrolledConds.join(" AND ")}
    GROUP BY sec.id
  `;

  try {
    const [[rows], [enrolledRows]] = await Promise.all([
      db.query<mysql.RowDataPacket[]>(mainSql, mainParams),
      db.query<mysql.RowDataPacket[]>(enrolledSql, enrolledExtra),
    ]);

    // sectionId → cantidad de alumnos matriculados
    const enrolledMap = new Map<number, number>(
      enrolledRows.map((r) => [Number(r.section_id), Number(r.total_students)])
    );

    const sectionSet = new Map<number, string>();
    const periodSet  = new Set<string>();
    for (const row of rows) {
      sectionSet.set(Number(row.section_id), String(row.section_name));
      periodSet.add(String(row.period));
    }

    const sections = Array.from(sectionSet.entries()).map(([id, name]) => ({ id, name }));
    const periods  = Array.from(periodSet).sort();

    // period → sectionId → row
    const lookup = new Map<string, Map<number, mysql.RowDataPacket>>();
    for (const row of rows) {
      const p = String(row.period);
      if (!lookup.has(p)) lookup.set(p, new Map());
      lookup.get(p)!.set(Number(row.section_id), row);
    }

    const PALETTE = ["#6366f1","#22d3ee","#f59e0b","#10b981","#f43f5e","#8b5cf6","#0ea5e9","#84cc16"];

    const data = periods.map((period) => {
      const entry: Record<string, string | number> = { date: period };
      for (const { id, name } of sections) {
        const row     = lookup.get(period)?.get(id);
        const present = Number(row?.present ?? 0);

        // ✅ Denominador = matriculados totales, no registros del día
        // Ej: 2 llegaron de 3 matriculados → 66.7%, aunque el día no acabó
        const totalStudents = enrolledMap.get(id) ?? 0;
        entry[name] = totalStudents > 0
          ? Math.round((present / totalStudents) * 1000) / 10
          : 0;
      }
      return entry;
    });

    const series = sections.map(({ name }, i) => ({
      dataKey: name,
      name,
      color: PALETTE[i % PALETTE.length],
    }));

    return NextResponse.json({ date_from: dateFrom, date_to: dateTo, group_by: groupBy, sections, series, data });
  } catch (err) {
    console.error("[section-comparison]", err);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}