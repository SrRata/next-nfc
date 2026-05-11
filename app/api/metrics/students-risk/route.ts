import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get("course_id");
    const sectionId = req.nextUrl.searchParams.get("section_id");

    let whereConditions = `
      s.is_active = TRUE
      AND ar.entry_time IS NULL
    `;

    const queryParams: any[] = [];

    // Filtrar por curso
    if (courseId) {
      whereConditions += ` AND s.course_id = ?`;
      queryParams.push(courseId);
    }

    // Filtrar por sección
    if (sectionId) {
      whereConditions += ` AND c.section_id = ?`;
      queryParams.push(sectionId);
    }

    const [rows]: any = await db.query(
      `
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone_number,

        c.id AS course_id,
        c.course_name,

        COUNT(ar.id) AS total_absences

      FROM students s

      INNER JOIN courses c
        ON c.id = s.course_id

      INNER JOIN attendance_records ar
        ON ar.student_id = s.id

      WHERE ${whereConditions}

      GROUP BY
        s.id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone_number,
        c.id,
        c.course_name

      HAVING COUNT(ar.id) > 10

      ORDER BY
        total_absences DESC,
        s.last_name,
        s.first_name
      `,
      queryParams
    );

    return NextResponse.json({
      total_at_risk: rows.length,
      filters: {
        course_id: courseId ?? null,
        section_id: sectionId ?? null,
      },
      students: rows,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}