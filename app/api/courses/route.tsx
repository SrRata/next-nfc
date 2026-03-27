import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);

//         const searchTerm = searchParams.get('search');
//         const level = searchParams.get('level');
//         const section = searchParams.get('section');
//         const isActive = searchParams.get('isActive');

//         // 1. Definimos el SELECT y los JOINS (Quitamos el GROUP BY de aquí)
//         let sql = `
//             SELECT 
//                 c.id,
//                 c.course_name AS courseName,
//                 c.section,
//                 c.educational_level AS level,
//                 c.is_active AS isActive,
//                 CONCAT(u.first_name, ' ', u.last_name) AS tutorName,
//                 COUNT(DISTINCT s.id) AS totalStudents
//             FROM courses c
//             LEFT JOIN tutor_assignments ta ON c.id = ta.course_id
//             LEFT JOIN users u ON ta.professor_id = u.id
//             LEFT JOIN students s ON c.id = s.course_id
//             WHERE 1=1
//         `;

//         const queryParams = [];

//         // 2. Filtros (Siguen siendo parte del WHERE)
//         if (searchTerm && searchTerm.trim() !== "") {
//             sql += " AND (c.course_name LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
//             const value = `%${searchTerm}%`;
//             queryParams.push(value, value, value);
//         }

//         if (level) {
//             sql += " AND c.educational_level = ?";
//             queryParams.push(level);
//         }

//         if (section) {
//             sql += " AND c.section = ?";
//             queryParams.push(section);
//         }

//         if (isActive !== null && isActive !== "") {
//             sql += " AND c.is_active = ?";
//             queryParams.push(isActive === "true" ? 1 : 0);
//         }

//         // 3. EL GROUP BY VA AL FINAL (Después de todos los AND)
//         sql += " GROUP BY c.id, u.id";

//         const [rows] = await db.query(sql, queryParams);
//         return NextResponse.json(rows);

//     } catch (error) {
//         console.error("API Error:", error);
//         return NextResponse.json({ error: "Error al filtrar cursos" }, { status: 500 });
//     }
// }

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const searchTerm = searchParams.get('search');
        const level = searchParams.get('level');
        const section = searchParams.get('section');
        const isActive = searchParams.get('isActive');

        // 1. Cambiamos el JOIN: u ahora se une directamente mediante c.professor_id
        let sql = `
            SELECT 
                c.id,
                c.course_name AS courseName,
                c.section,
                c.educational_level AS level,
                c.is_active AS isActive,
                CONCAT(u.first_name, ' ', u.last_name) AS tutorName,
                COUNT(DISTINCT s.id) AS totalStudents
            FROM courses c
            LEFT JOIN users u ON c.professor_id = u.id
            LEFT JOIN students s ON c.id = s.course_id
            WHERE 1=1
        `;

        const queryParams = [];

        // 2. Filtros
        if (searchTerm && searchTerm.trim() !== "") {
            sql += " AND (c.course_name LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
            const value = `%${searchTerm}%`;
            queryParams.push(value, value, value);
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
            sql += " AND c.is_active = ?";
            queryParams.push(isActive === "true" ? 1 : 0);
        }

        // 3. El GROUP BY ahora es más simple (agrupamos por el ID del curso y el tutor)
        sql += " GROUP BY c.id, u.id";

        const [rows] = await db.query(sql, queryParams);
        return NextResponse.json(rows);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Error al filtrar cursos" }, { status: 500 });
    }
}



export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { courseName, section, level, professorId } = body;

        const tutorValue = (professorId && professorId !== "none") ? professorId : null;

        if (!courseName || !section || !level) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO courses (course_name, section, educational_level, professor_id) 
            VALUES (?, ?, ?, ?)`,
            [courseName, section, level, tutorValue]
        );


        return NextResponse.json(
            { message: "Curso creado con éxito", id: result.insertId },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error en POST /api/courses:", error);
        return NextResponse.json({ error: "Error al crear curso" }, { status: 500 });
    }
}