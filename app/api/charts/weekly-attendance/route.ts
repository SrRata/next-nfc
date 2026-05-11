import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { startOfWeek, addWeeks, format, eachDayOfInterval, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { RowDataPacket } from 'mysql2';


export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const courseIds          = searchParams.getAll("course_id").map(Number).filter(Boolean);
  const professorId        = searchParams.get("professor_id")         ? Number(searchParams.get("professor_id"))         : null;
  const educationalLevelId = searchParams.get("educational_level_id") ? Number(searchParams.get("educational_level_id")) : null;
  const sectionId          = searchParams.get("section_id")           ? Number(searchParams.get("section_id"))           : null;
  const weekOffset         = searchParams.get("week_offset")          ? Number(searchParams.get("week_offset"))          : 0;

  const monday   = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const friday   = addDays(monday, 4);
  const dateFrom = format(monday, "yyyy-MM-dd");
  const dateTo   = format(friday, "yyyy-MM-dd");

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
      ar.date,
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
    GROUP BY ar.date
    ORDER BY ar.date ASC
  `;

  try {
    const [rows] = await db.query<RowDataPacket[]>(sql, params);


    const days       = eachDayOfInterval({ start: monday, end: friday });
    const rowsByDate = Object.fromEntries(rows.map((r) => [format(new Date(r.date), "yyyy-MM-dd"), r]));

    const data = days.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      const row = rowsByDate[key];
      return {
        date:    key,
        label:   format(day, "EEE", { locale: es }),
        on_time: Number(row?.on_time ?? 0),
        late:    Number(row?.late    ?? 0),
        absent:  Number(row?.absent  ?? 0),
        total:   Number(row?.total   ?? 0),
      };
    });

    return NextResponse.json({ week_from: dateFrom, week_to: dateTo, data });
  } catch (err) {
    console.error("[weekly-attendance]", err);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}