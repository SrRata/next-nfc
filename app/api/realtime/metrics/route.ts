// app/api/realtime/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const courseId  = searchParams.get("course_id");
  const sectionId = searchParams.get("section_id");
  const levelId   = searchParams.get("educational_level_id");

    const today = new Date().toLocaleDateString("en-CA", { 
  timeZone: "America/Guayaquil" 
}); // formato YYYY-MM-DD

  const [rows]: any = await db.query(
    `SELECT
       COUNT(DISTINCT s.id)                                             AS total_students,
       COUNT(DISTINCT ar.student_id)                                    AS total_present,
       ROUND(COUNT(DISTINCT ar.student_id) /
             NULLIF(COUNT(DISTINCT s.id), 0) * 100, 1)                 AS percentage,
       SUM(CASE WHEN ar.observation LIKE 'Atrasado%' THEN 1 ELSE 0 END) AS total_late
     FROM students s
     JOIN courses c ON s.course_id = c.id AND c.is_active = TRUE
     LEFT JOIN attendance_records ar ON ar.student_id = s.id AND ar.date = ?
     WHERE s.is_active = TRUE
       AND (? IS NULL OR c.id                  = ?)
       AND (? IS NULL OR c.section_id          = ?)
       AND (? IS NULL OR c.educational_level_id = ?)`,
    [today, courseId, courseId, sectionId, sectionId, levelId, levelId]
  );

  return NextResponse.json({ ...rows[0], as_of: new Date().toISOString() });
}