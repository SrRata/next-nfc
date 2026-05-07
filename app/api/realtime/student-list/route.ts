// app/api/realtime/student-list/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("course_id");
  if (!courseId) return NextResponse.json({ error: "course_id requerido" }, { status: 400 });

  const today = new Date().toLocaleDateString("en-CA", { 
  timeZone: "America/Guayaquil" 
}); // formato YYYY-MM-DD

  const [rows]: any = await db.query(
    `SELECT
       s.id, s.first_name, s.last_name,
       CASE
         WHEN ar.exit_time  IS NOT NULL THEN 'salida'
         WHEN ar.entry_time IS NOT NULL THEN
           CASE WHEN ar.observation LIKE 'Atrasado%' THEN 'atrasado' ELSE 'presente' END
         ELSE 'ausente'
       END       AS status,
       ar.entry_time,
       ar.exit_time,
       ar.observation
     FROM students s
     LEFT JOIN attendance_records ar ON ar.student_id = s.id AND ar.date = ?
     WHERE s.course_id = ? AND s.is_active = TRUE
     ORDER BY s.last_name, s.first_name`,
    [today, courseId]
  );

  return NextResponse.json({ students: rows, as_of: new Date().toISOString() });
}