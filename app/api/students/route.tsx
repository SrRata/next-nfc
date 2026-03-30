import { db } from "@/lib/hooks/db";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const searchTerm = searchParams.get('search');
        const level = searchParams.get('level');
        const section = searchParams.get('section');
        const isActive = searchParams.get('isActive');

        let sql = `
            SELECT 
                s.id, 
                s.first_name AS firstName, 
                s.last_name AS lastName,
                s.cdl,
                s.email,
                s.phone_number AS phoneNumber,
                s.nfc_uid AS nfc, 
                s.is_active AS isActive,
                c.course_name AS course,
                c.section AS section, 
                c.educational_level AS level,
                COALESCE(ss.current_points, 0) AS points,
                (
                    SELECT GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ')
                    FROM relationships r
                    JOIN users u ON r.parent_id = u.id
                    WHERE r.student_id = s.id
                ) AS parents
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN student_summaries ss ON s.id = ss.student_id
            WHERE 1=1
        `;


        const queryParams = [];

        if (searchTerm && searchTerm.trim() !== "") {
            // Buscamos por nombre, apellido, NFC o Email
            sql += " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.nfc_uid LIKE ? OR s.email LIKE ?)";
            const value = `%${searchTerm}%`;
            queryParams.push(value, value, value, value);
        }

        if (level && level !== "" && level !== "all") {
            sql += " AND c.educational_level = ?";
            queryParams.push(level);
        }

        if (section && section !== "" && section !== "all") {
            sql += " AND c.section = ?";
            queryParams.push(section);
        }

        if (isActive !== null && isActive !== "") {
            sql += " AND s.is_active = ?";
            queryParams.push(isActive === "true" || isActive === "1" ? 1 : 0);
        }

        sql += " ORDER BY s.last_name ASC";

        const [data] = await db.query(sql, queryParams);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("API Students Error:", error);
        return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 });
    }
}



// CREAR ESTUDIANTE

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, nfc, courseId } = await request.json();

        const sql = `INSERT INTO students (first_name, last_name, email, nfc_uid, course_id) VALUES (?, ?, ?, ?, ?)`;
        const [result]: any = await db.query(sql, [firstName, lastName, email, nfc, courseId]);

        // Opcional: Crear el registro de resumen (puntos) inicial
        await db.query("INSERT INTO student_summaries (student_id) VALUES (?)", [result.insertId]);

        return NextResponse.json({ id: result.insertId, message: "Estudiante creado" });
    } catch (error: any) {
        return NextResponse.json({ error: "Error al crear estudiante" }, { status: 500 });
    }
}
