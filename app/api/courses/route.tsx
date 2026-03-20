import { db } from "@/lib/hooks/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [courses] = await db.query(
            "SELECT id, course_name AS course, parallel, section FROM courses WHERE is_active = TRUE"
        );

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


