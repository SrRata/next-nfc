// // app/api/realtime/student-list/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db";

// export async function GET(req: NextRequest) {
//   const courseId = req.nextUrl.searchParams.get("course_id");
//   if (!courseId) return NextResponse.json({ error: "course_id requerido" }, { status: 400 });

//   const today = new Date().toLocaleDateString("en-CA", { 
//   timeZone: "America/Guayaquil" 
// }); // formato YYYY-MM-DD

//   const [rows]: any = await db.query(
//     `SELECT
//        s.id, s.first_name, s.last_name,
//        CASE
//          WHEN ar.exit_time  IS NOT NULL THEN 'salida'
//          WHEN ar.entry_time IS NOT NULL THEN
//            CASE WHEN ar.observation LIKE 'Atrasado%' THEN 'atrasado' ELSE 'presente' END
//          ELSE 'ausente'
//        END       AS status,
//        ar.entry_time,
//        ar.exit_time,
//        ar.observation
//      FROM students s
//      LEFT JOIN attendance_records ar ON ar.student_id = s.id AND ar.date = ?
//      WHERE s.course_id = ? AND s.is_active = TRUE
//      ORDER BY s.last_name, s.first_name`,
//     [today, courseId]
//   );

//   return NextResponse.json({ students: rows, as_of: new Date().toISOString() });
// }





// import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const courseIdParam = req.nextUrl.searchParams.get("course_id");
//     const professorId = req.nextUrl.searchParams.get("professor_id");

//     let courseId = courseIdParam;

//     // Si no llega course_id, buscarlo por professor_id
//     if (!courseId && professorId) {
//       const [courseRows]: any = await db.query(
//         `
//         SELECT id
//         FROM courses
//         WHERE professor_id = ?
//         LIMIT 1
//         `,
//         [professorId]
//       );

//       if (courseRows.length === 0) {
//         return NextResponse.json(
//           { error: "El profesor no tiene un curso asignado" },
//           { status: 404 }
//         );
//       }

//       courseId = courseRows[0].id;
//     }

//     // Validación final
//     if (!courseId) {
//       return NextResponse.json(
//         { error: "course_id o professor_id requerido" },
//         { status: 400 }
//       );
//     }

//     const today = new Date().toLocaleDateString("en-CA", {
//       timeZone: "America/Guayaquil",
//     });

//     const [rows]: any = await db.query(
//       `
//       SELECT
//         s.id,
//         s.first_name,
//         s.last_name,

//         CASE
//           WHEN ar.exit_time IS NOT NULL THEN 'salida'

//           WHEN ar.entry_time IS NOT NULL THEN
//             CASE
//               WHEN ar.observation LIKE 'Atrasado%'
//               THEN 'atrasado'
//               ELSE 'presente'
//             END

//           ELSE 'ausente'
//         END AS status,

//         ar.entry_time,
//         ar.exit_time,
//         ar.observation

//       FROM students s

//       LEFT JOIN attendance_records ar
//         ON ar.student_id = s.id
//        AND ar.date = ?

//       WHERE s.course_id = ?
//         AND s.is_active = TRUE

//       ORDER BY s.last_name, s.first_name
//       `,
//       [today, courseId]
//     );

//     return NextResponse.json({
//       students: rows,
//       course_id: courseId,
//       as_of: new Date().toISOString(),
//     });

//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Error interno del servidor" },
//       { status: 500 }
//     );
//   }
// }


// app/api/realtime/student-list/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const courseIdParam = req.nextUrl.searchParams.get("course_id");
    const professorId = req.nextUrl.searchParams.get("professor_id");

    let courseId = courseIdParam;

    // Buscar curso por profesor
    if (!courseId && professorId) {
      const [courseRows]: any = await db.query(
        `
        SELECT id
        FROM courses
        WHERE professor_id = ?
        LIMIT 1
        `,
        [professorId]
      );

      if (courseRows.length === 0) {
        return NextResponse.json(
          { error: "El profesor no tiene un curso asignado" },
          { status: 404 }
        );
      }

      courseId = courseRows[0].id;
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "course_id o professor_id requerido" },
        { status: 400 }
      );
    }

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Guayaquil",
    });

    const [rows]: any = await db.query(
      `
      SELECT
        s.id,
        s.first_name,
        s.last_name,

        c.id AS course_id,
        c.course_name,

        CASE
          WHEN ar.exit_time IS NOT NULL THEN 'salida'

          WHEN ar.entry_time IS NOT NULL THEN
            CASE
              WHEN ar.observation LIKE 'Atrasado%'
              THEN 'atrasado'
              ELSE 'presente'
            END

          ELSE 'ausente'
        END AS status,

        ar.entry_time,
        ar.exit_time,
        ar.observation

      FROM students s

      INNER JOIN courses c
        ON c.id = s.course_id

      LEFT JOIN attendance_records ar
        ON ar.student_id = s.id
       AND ar.date = ?

      WHERE s.course_id = ?
        AND s.is_active = TRUE

      ORDER BY s.last_name, s.first_name
      `,
      [today, courseId]
    );

    return NextResponse.json({
      course: rows.length > 0
        ? {
            id: rows[0].course_id,
            name: rows[0].course_name,
          }
        : null,

      students: rows,
      as_of: new Date().toISOString(),
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}