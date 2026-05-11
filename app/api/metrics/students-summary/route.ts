// import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const professorId = searchParams.get("professorId");
//     const courseId = searchParams.get("courseId");
//     const sectionId = searchParams.get("sectionId");

//     let sql = `
//       SELECT 
//         s.id AS student_id,
//         CONCAT(s.first_name, ' ', s.last_name) AS name,
//         s.cdl AS cdl,
//         c.course_name AS course,
//         sec.name AS section,
//         COALESCE(ss.total_absences, 0) AS absences,
//         COALESCE(ss.total_attendances, 0) AS assists
//       FROM students s
//       LEFT JOIN student_summaries ss ON ss.student_id = s.id
//       LEFT JOIN courses c ON c.id = s.course_id
//       LEFT JOIN sections sec ON sec.id = c.section_id
//       WHERE 1 = 1
//     `;

//     const params: any[] = [];

//     // 🔹 filtro por curso
//     if (courseId) {
//       sql += " AND c.id = ?";
//       params.push(courseId);
//     }

//     // 🔹 filtro por sección
//     if (sectionId) {
//       sql += " AND sec.id = ?";
//       params.push(sectionId);
//     }

//     // 🔹 filtro por profesor (clave importante)
//     if (professorId) {
//       sql += " AND c.professor_id = ?";
//       params.push(professorId);
//     }

//     const [rows]: any = await db.query(sql, params);

//     const result = rows.map((row: any) => ({
//       id: row.cdl,
//       name: row.name,
//       course: row.course,
//       section: row.section,
//       absences: row.absences,
//       assists: row.assists,
//     }));

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Error obteniendo estudiantes" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const professorId = searchParams.get("professorId");
    const courseId = searchParams.get("courseId");
    const sectionId = searchParams.get("sectionId");

    let sql = `
      SELECT 
        s.id AS student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS name,
        s.cdl AS cdl,
        c.course_name AS course,
        sec.name AS section,
        COALESCE(ss.total_absences, 0) AS absences,
        COALESCE(ss.total_attendances, 0) AS assists
      FROM students s
      LEFT JOIN student_summaries ss ON ss.student_id = s.id
      LEFT JOIN courses c ON c.id = s.course_id
      LEFT JOIN sections sec ON sec.id = c.section_id
      WHERE s.is_active = TRUE
    `;

    const params: any[] = [];

    // 🔹 filtro por curso
    if (courseId) {
      sql += " AND c.id = ?";
      params.push(courseId);
    }

    // 🔹 filtro por sección
    if (sectionId) {
      sql += " AND sec.id = ?";
      params.push(sectionId);
    }

    // 🔹 filtro por profesor
    if (professorId) {
      sql += " AND c.professor_id = ?";
      params.push(professorId);
    }

    const [rows]: any = await db.query(sql, params);

    const result = rows.map((row: any) => ({
      id: row.cdl,
      name: row.name,
      course: row.course,
      section: row.section,
      absences: row.absences,
      assists: row.assists,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo estudiantes" },
      { status: 500 }
    );
  }
}