import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import db from "@/lib/db";
import { format, startOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const courseIds          = searchParams.getAll("course_id").map(Number).filter(Boolean);
  const professorId        = searchParams.get("professor_id")         ? Number(searchParams.get("professor_id"))         : null;
  const educationalLevelId = searchParams.get("educational_level_id") ? Number(searchParams.get("educational_level_id")) : null;
  const sectionId          = searchParams.get("section_id")           ? Number(searchParams.get("section_id"))           : null;
  const dateFrom           = searchParams.get("date_from") ?? format(startOfMonth(new Date()), "yyyy-MM-dd");
  const dateTo             = searchParams.get("date_to")   ?? format(new Date(), "yyyy-MM-dd");

  const conditions: string[] = [
    "ar.date BETWEEN ? AND ?",
    "st.is_active = 1",
    "c.is_active  = 1",
  ];
  const params: (string | number)[] = [dateFrom, dateTo];

  if (professorId) {
    conditions.push("c.professor_id = ?");
    params.push(professorId);
  }
  if (courseIds.length === 1) {
    conditions.push("c.id = ?");
    params.push(courseIds[0]);
  } else if (courseIds.length > 1) {
    conditions.push(`c.id IN (${courseIds.map(() => "?").join(",")})`);
    params.push(...courseIds);
  }
  if (educationalLevelId) {
    conditions.push("c.educational_level_id = ?");
    params.push(educationalLevelId);
  }
  if (sectionId) {
    conditions.push("c.section_id = ?");
    params.push(sectionId);
  }

  const sql = `
    SELECT
      SUM(CASE
        WHEN ar.entry_time IS NOT NULL
          AND ar.entry_time <= ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))
        THEN 1 ELSE 0
      END) AS on_time,
      SUM(CASE
        WHEN ar.entry_time IS NOT NULL
          AND ar.entry_time >  ADDTIME(sch.entry_time, SEC_TO_TIME(sch.entry_tolerance * 60))
        THEN 1 ELSE 0
      END) AS late,
      SUM(CASE
        WHEN ar.entry_time IS NULL
        THEN 1 ELSE 0
      END) AS absent,
      COUNT(*) AS total
    FROM attendance_records ar
    JOIN students st  ON st.id = ar.student_id
    JOIN courses  c   ON c.id  = st.course_id
    LEFT JOIN schedules sch
      ON sch.educational_level_id = c.educational_level_id
     AND sch.section_id           = c.section_id
    WHERE ${conditions.join(" AND ")}
  `;

  try {
    // ✅ Desestructura siempre [rows, fields]
    const [rows] = await db.query<mysql.RowDataPacket[]>(sql, params);
    const row = rows[0] ?? {};

    const on_time = Number(row.on_time ?? 0);
    const late    = Number(row.late    ?? 0);
    const absent  = Number(row.absent  ?? 0);
    const total   = Number(row.total   ?? 0);
    const pct     = (n: number) => total > 0 ? Math.round((n / total) * 1000) / 10 : 0;

    return NextResponse.json({
      date_from: dateFrom,
      date_to:   dateTo,
      summary: { on_time, late, absent, total },
      data: [
        { status: "on_time", label: "Puntuales", value: on_time, pct: pct(on_time) },
        { status: "late",    label: "Atrasados", value: late,    pct: pct(late)    },
        { status: "absent",  label: "Ausentes",  value: absent,  pct: pct(absent)  },
      ],
    });
  } catch (err) {
    console.error("[attendance-status]", err);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}