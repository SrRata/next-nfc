import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses
export async function GET() {
  try {
    const [rows]: any = await db.query(
      // `SELECT
      //    c.id,
      //    c.course_name,
      //    c.is_active,
      //    el.id   AS educational_level_id,
      //    el.name AS educational_level_name,
      //    s.id    AS section_id,
      //    s.name  AS section_name,
      //    u.id    AS professor_id,
      //    CONCAT(u.first_name, ' ', u.last_name) AS professor_name
      //  FROM courses c
      //  JOIN educational_levels el ON el.id = c.educational_level_id
      //  JOIN sections s            ON s.id  = c.section_id
      //  LEFT JOIN users u          ON u.id  = c.professor_id
      //  WHERE c.is_active = TRUE
      //  ORDER BY el.name ASC, s.name ASC, c.course_name ASC`

      `SELECT
         c.id,
         c.course_name,
         c.is_active,
         el.id   AS educational_level_id,
         el.name AS educational_level_name,
         el.color AS educational_level_color,
         s.id    AS section_id,
         s.name  AS section_name,
         s.color AS section_color,
         u.id    AS professor_id,
         CONCAT(u.first_name, ' ', u.last_name) AS professor_name,
         COUNT(st.id) AS total_students -- Contamos los IDs de la tabla estudiantes
       FROM courses c
       JOIN educational_levels el ON el.id = c.educational_level_id
       JOIN sections s            ON s.id  = c.section_id
       LEFT JOIN users u          ON u.id  = c.professor_id
       LEFT JOIN students st      ON st.course_id = c.id -- Unión con la tabla de estudiantes
       WHERE c.is_active = TRUE
       GROUP BY 
         c.id, 
         el.id, 
         s.id, 
         u.id -- Agrupamos para que el COUNT funcione por cada curso
       ORDER BY el.name ASC, s.name ASC, c.course_name ASC`

    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/courses
export async function POST(req: NextRequest) {
  const conn = await db.getConnection();
  try {
    const {
      course_name,
      educational_level_id,
      section_id,
      professor_id = null,
    } = await req.json();

    if (!course_name?.trim() || !educational_level_id || !section_id) {
      return NextResponse.json(
        { error: "Los campos course_name, educational_level_id y section_id son requeridos" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // Verificar nivel activo
    const [level]: any = await conn.query(
      `SELECT id FROM educational_levels WHERE id = ? AND is_active = TRUE`,
      [educational_level_id]
    );
    if (!level.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "El nivel educativo no existe o está inactivo" },
        { status: 404 }
      );
    }

    // Verificar sección activa
    const [section]: any = await conn.query(
      `SELECT id FROM sections WHERE id = ? AND is_active = TRUE`,
      [section_id]
    );
    if (!section.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "La sección no existe o está inactiva" },
        { status: 404 }
      );
    }

    // Verificar profesor si se envía
    if (professor_id) {
      const [professor]: any = await conn.query(
        `SELECT id FROM users WHERE id = ? AND role = 'profesor' AND is_active = TRUE`,
        [professor_id]
      );
      if (!professor.length) {
        await conn.rollback();
        return NextResponse.json(
          { error: "El profesor no existe, está inactivo o no tiene rol de profesor" },
          { status: 404 }
        );
      }
    }

    const [result]: any = await conn.query(
      `INSERT INTO courses (course_name, educational_level_id, section_id, professor_id, is_active)
       VALUES (?, ?, ?, ?, TRUE)`,
      [course_name.trim(), educational_level_id, section_id, professor_id]
    );

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Curso creado correctamente",
        data: {
          id: result.insertId,
          course_name: course_name.trim(),
          educational_level_id,
          section_id,
          professor_id,
          is_active: true,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    await conn.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Este profesor ya está asignado como tutor en otro curso" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}