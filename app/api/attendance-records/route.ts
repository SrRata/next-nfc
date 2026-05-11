// import db from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//     try {

//         const [rows]: any = await db.query(`
//             SELECT
//                 -- Attendance
//                 ar.id,
//                 ar.date,
//                 ar.entry_time,
//                 ar.exit_time,
//                 ar.observation,

//                 -- Student
//                 s.id AS student_id,
//                 s.first_name AS student_first_name,
//                 s.last_name AS student_last_name,
//                 s.cdl,
//                 s.email,
//                 s.phone_number,
//                 s.nfc_uid,
//                 s.is_active AS student_is_active,

//                 -- Course
//                 c.id AS course_id,
//                 c.course_name,

//                 -- Section
//                 sec.id AS section_id,
//                 sec.name AS section_name,

//                 -- Educational Level
//                 el.id AS educational_level_id,
//                 el.name AS educational_level_name

//             FROM attendance_records ar

//             INNER JOIN students s
//                 ON ar.student_id = s.id

//             LEFT JOIN courses c
//                 ON s.course_id = c.id

//             LEFT JOIN sections sec
//                 ON c.section_id = sec.id

//             LEFT JOIN educational_levels el
//                 ON c.educational_level_id = el.id

//             ORDER BY ar.date DESC
//         `);

//         return NextResponse.json({
//             success: true,
//             data: rows
//         });

//     } catch (error) {
//         console.error(error);

//         return NextResponse.json(
//             { error: "Error interno del servidor" },
//             { status: 500 }
//         );
//     }
// }



import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const courseId =
      req.nextUrl.searchParams.get("course_id");

    const studentId =
      req.nextUrl.searchParams.get("student_id");

    const professorId =
      req.nextUrl.searchParams.get("professor_id");

    const parentId =
      req.nextUrl.searchParams.get("parent_id");

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // Filtrar por curso
    if (courseId) {
      whereConditions.push("c.id = ?");
      queryParams.push(courseId);
    }

    // Filtrar por estudiante
    if (studentId) {
      whereConditions.push("s.id = ?");
      queryParams.push(studentId);
    }

    // Filtrar por profesor
    if (professorId) {
      whereConditions.push("c.professor_id = ?");
      queryParams.push(professorId);
    }

    // Filtrar por representante
    if (parentId) {
      whereConditions.push("rel.parent_id = ?");
      queryParams.push(parentId);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [rows]: any = await db.query(
      `
      SELECT

          -- Attendance
          ar.id,
          ar.date,
          ar.entry_time,
          ar.exit_time,
          ar.observation,

          -- Student
          s.id AS student_id,
          s.first_name AS student_first_name,
          s.last_name AS student_last_name,
          s.cdl,
          s.email,
          s.phone_number,
          s.nfc_uid,
          s.is_active AS student_is_active,

          -- Course
          c.id AS course_id,
          c.course_name,
          c.professor_id,

          -- Section
          sec.id AS section_id,
          sec.name AS section_name,

          -- Educational Level
          el.id AS educational_level_id,
          el.name AS educational_level_name,

          -- Representative
          rel.parent_id

      FROM attendance_records ar

      INNER JOIN students s
          ON ar.student_id = s.id

      LEFT JOIN courses c
          ON s.course_id = c.id

      LEFT JOIN sections sec
          ON c.section_id = sec.id

      LEFT JOIN educational_levels el
          ON c.educational_level_id = el.id

      LEFT JOIN relationships rel
          ON rel.student_id = s.id

      ${whereClause}

      ORDER BY
          ar.date DESC,
          ar.entry_time DESC
      `,
      queryParams
    );

    return NextResponse.json({
      success: true,

      filters: {
        course_id: courseId ?? null,
        student_id: studentId ?? null,
        professor_id: professorId ?? null,
        parent_id: parentId ?? null,
      },

      total: rows.length,

      data: rows,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}