import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  try {
    const [rows]: any = await db.query(
      `SELECT
         c.id,
         c.course_name,
         c.is_active,
         el.id   AS educational_level_id,
         el.name AS educational_level_name,
         s.id    AS section_id,
         s.name  AS section_name,
         u.id    AS professor_id,
         CONCAT(u.first_name, ' ', u.last_name) AS professor_name
       FROM courses c
       JOIN educational_levels el ON el.id = c.educational_level_id
       JOIN sections s            ON s.id  = c.section_id
       LEFT JOIN users u          ON u.id  = c.professor_id
       WHERE c.id = ?`,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params


  const conn = await db.getConnection();
  try {
    const {
      course_name,
      educational_level_id,
      section_id,
      professor_id = null,
      is_active,
    } = await req.json();

    if (!course_name?.trim() || !educational_level_id || !section_id) {
      return NextResponse.json(
        { error: "Los campos course_name, educational_level_id y section_id son requeridos" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM courses WHERE id = ?`,
      [id]
    );
    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

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

    await conn.query(
      `UPDATE courses SET
         course_name          = ?,
         educational_level_id = ?,
         section_id           = ?,
         professor_id         = ?,
         is_active            = ?
       WHERE id = ?`,
      [
        course_name.trim(),
        educational_level_id,
        section_id,
        professor_id,
        is_active ?? true,
        id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Curso actualizado correctamente",
      data: {
        id: Number(id),
        course_name: course_name.trim(),
        educational_level_id,
        section_id,
        professor_id,
        is_active: is_active ?? true,
      },
    });
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

// DELETE /api/courses/:id — soft delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id, is_active FROM courses WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    if (!existing[0].is_active) {
      await conn.rollback();
      return NextResponse.json(
        { error: "El curso ya está desactivado" },
        { status: 409 }
      );
    }

    await conn.query(
      `UPDATE courses SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Curso desactivado correctamente",
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}