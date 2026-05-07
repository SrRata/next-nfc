// app/api/realtime/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const courseId = searchParams.get("course_id");   // profesor
  const studentId = searchParams.get("student_id");  // padre
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Guayaquil"
  }); // formato YYYY-MM-DD

  let rows: any[];

  if (studentId) {
    // Padre: registros de su hijo hoy
    [rows] = await db.query(
      `SELECT ar.id, ar.entry_time, ar.exit_time, ar.observation,
              s.first_name, s.last_name
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.id
       WHERE ar.student_id = ? AND ar.date = ?
       ORDER BY GREATEST(
  COALESCE(ar.entry_time, '00:00:00'),
  COALESCE(ar.exit_time,  '00:00:00')
) DESC
LIMIT 5
       `,

      [studentId, today]
    ) as any[];
  } else if (courseId) {
    // Profesor: últimos 5 de su curso
    [rows] = await db.query(
      `SELECT ar.id, ar.entry_time, ar.exit_time, ar.observation,
              s.first_name, s.last_name
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.id
       WHERE s.course_id = ? AND ar.date = ?
      ORDER BY GREATEST(
  COALESCE(ar.entry_time, '00:00:00'),
  COALESCE(ar.exit_time,  '00:00:00')
) DESC
       LIMIT 5`,
      [courseId, today]
    ) as any[];
  } else {
    // Admin: últimos 5 del colegio
    [rows] = await db.query(
      `SELECT ar.id, ar.entry_time, ar.exit_time, ar.observation,
              s.first_name, s.last_name, c.course_name
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.id
       JOIN courses c  ON s.course_id   = c.id
       WHERE ar.date = ?
      ORDER BY GREATEST(
  COALESCE(ar.entry_time, '00:00:00'),
  COALESCE(ar.exit_time,  '00:00:00')
) DESC
       LIMIT 5`,
      [today]
    ) as any[];
  }

  return NextResponse.json({ records: rows, as_of: new Date().toISOString() });
}