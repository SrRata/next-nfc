// import { db } from "@/lib/hooks/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         const [rows] = await db.query(`
//             SELECT 
//                 s.id,
//                 s.first_name AS firstName,
//                 s.last_name AS lastName,
//                 s.nfc_uid AS nfc,
//                 s.is_active AS isActive,
//                 c.course_name AS course,
//                 c.parallel,
//                 c.section AS section,
//                 c.educational_level AS level,
//                 COALESCE(ss.current_points, 0) AS points
//             FROM students s
//             LEFT JOIN courses c ON s.course_id = c.id
//             LEFT JOIN student_summaries ss ON s.id = ss.student_id
//             ORDER BY s.last_name ASC
//         `);

//         return NextResponse.json(rows, { status: 200 });
//     } catch (error) {
//         console.error("Error al obtener estudiantes:", error);
//         return NextResponse.json(
//             { error: "Error interno del servidor" }, 
//             { status: 500 }
//         );
//     }
// }


import { db } from "@/lib/hooks/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // 1. Extraer valores de la URL
        const searchTerm = searchParams.get('search');
        const courseId = searchParams.get('course');
        const level = searchParams.get('level');
        const section = searchParams.get('section');
        const isActive = searchParams.get('isActive');

        // 2. Base de la consulta
        let sql = `
            SELECT 
                s.id, s.first_name AS firstName, s.last_name AS lastName,
                s.nfc_uid AS nfc, s.is_active AS isActive,
                c.course_name AS course,
                c.parallel,
                c.section AS section, c.educational_level AS level,
                COALESCE(ss.current_points, 0) AS points
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN student_summaries ss ON s.id = ss.student_id
            WHERE 1=1
        `;

        const queryParams = [];

        if (searchTerm && searchTerm.trim() !== "") {
            sql += " AND (s.first_name LIKE ? OR s.last_name LIKE ?)";
            const value = `%${searchTerm}%`;
            queryParams.push(value, value);
        }
        if (courseId) {
            sql += " AND s.course_id = ?";
            queryParams.push(courseId);
        }
        if (level) {
            sql += " AND c.educational_level = ?";
            queryParams.push(level);
        }
        if (section) {
            sql += " AND c.section = ?";
            queryParams.push(section);
        }
        if (isActive !== null && isActive !== "") {
            sql += " AND s.is_active = ?";
            queryParams.push(isActive === "true" ? 1 : 0);
        }

        sql += " ORDER BY s.last_name ASC";

        const [rows] = await db.query(sql, queryParams);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Error al filtrar estudiantes" }, { status: 500 });
    }
}
