import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";
import { connection, NextResponse } from "next/server";


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
                s.course_id AS courseId, 
                c.course_name AS course,
                c.section AS section, 
                c.educational_level AS level,
                COALESCE(ss.current_points, 0) AS points,
                (
                    SELECT GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ')
                    FROM relationships r
                    JOIN users u ON r.parent_id = u.id
                    WHERE r.student_id = s.id
                ) AS parent
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


export async function POST(request: Request) {
    // Obtenemos una conexión para la transacción
    const connection = await db.getConnection(); 
    
    try {
        const body = await request.json();
        const { firstName, lastName, email, cdl, phoneNumber, nfc, parentId, courseId } = body;

        const parentValue = (parentId && parentId !== "none") ? parentId : null;
        const courseValue = (courseId && courseId !== "none") ? courseId : null;

        if (!firstName || !lastName || !cdl || !nfc) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
        }

        await connection.beginTransaction();

        const [studentResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO students (first_name, last_name, cdl, email, phone_number, nfc_uid, course_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, cdl, email, phoneNumber, nfc, courseValue]
        );

        const newStudentId = studentResult.insertId;

        if (parentValue) {
            await connection.query(
                `INSERT INTO relationships (parent_id, student_id) VALUES (?, ?)`,
                [parentValue, newStudentId]
            );
        }

        await connection.query(
            `INSERT INTO student_summaries (student_id, total_attendances, current_points) VALUES (?, 0, 0)`,
            [newStudentId]
        );

        await connection.commit();

        return NextResponse.json(
            { message: "Estudiante creado con éxito", id: newStudentId },
            { status: 201 }
        );

    } catch (error: any) {
        await connection.rollback();

         if (error.errno === 1062) {
        let field = "dato";
        if (error.sqlMessage.includes('email')) field = "correo electrónico";
        if (error.sqlMessage.includes('nfc_uid')) field = "código NFC";
        if (error.sqlMessage.includes('cdl')) field = "CDL";

        return NextResponse.json(
            { error: `Ya existe un estudiante con este ${field}.` }, 
            { status: 409 } 
        );
    }

        console.error("Error en POST /api/students:", error);
        return NextResponse.json({ error: "Error al crear el estudiante" }, { status: 500 });
    } finally {
        connection.release();
    }
}



