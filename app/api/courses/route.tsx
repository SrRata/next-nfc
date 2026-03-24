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
                c.id,
                c.course_name AS courseName,
                c.parallel,
                c.section,
                c.educational_level AS level,
                c.is_active AS isActive,
                CONCAT(u.first_name, ' ', u.last_name) AS tutorName,
                COUNT(DISTINCT s.id) AS totalStudents
            FROM courses c
            LEFT JOIN assignments a ON c.id = a.course_id
            LEFT JOIN users u ON a.professor_id = u.id AND u.role = 'Professor'
            LEFT JOIN students s ON c.id = s.course_id
            WHERE 1=1
        `;

        const queryParams = [];

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
        const {} = body
    } catch {
        
    }
}
