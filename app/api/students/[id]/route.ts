import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/students/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const {id} = await params;

  try {
    const [rows]: any = await db.query(
      `SELECT
         s.id,
         s.first_name,
         s.last_name,
         s.cdl,
         s.email,
         s.phone_number,
         s.nfc_uid,
         s.is_active,
         c.id            AS course_id,
         c.course_name,
         el.name         AS educational_level_name,
         sec.name        AS section_name,
         ss.total_attendances,
         ss.total_absences,
         u.id                                   AS parent_id,
         CONCAT(u.first_name, ' ', u.last_name) AS parent_name,
         u.phone_number                         AS parent_phone,
         u.email                                AS parent_email
       FROM students s
       LEFT JOIN courses c             ON c.id  = s.course_id
       LEFT JOIN educational_levels el ON el.id = c.educational_level_id
       LEFT JOIN sections sec          ON sec.id = c.section_id
       LEFT JOIN student_summaries ss  ON ss.student_id = s.id
       LEFT JOIN relationships r       ON r.student_id  = s.id
       LEFT JOIN users u               ON u.id           = r.parent_id
       WHERE s.id = ?`,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
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

// PUT /api/students/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const {id} = await params;

  const conn = await db.getConnection();
  try {
    const {
      first_name,
      last_name,
      cdl,
      email,
      phone_number = null,
      nfc_uid = null,
      course_id,
      is_active,
      // Para asignar o cambiar representante
      parent_cdl = null,
    } = await req.json();

    if (!first_name?.trim() || !last_name?.trim() || !cdl?.trim() || !email?.trim() || !course_id) {
      return NextResponse.json(
        { error: "Los campos first_name, last_name, cdl, email y course_id son requeridos" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id FROM students WHERE id = ?`,
      [id]
    );
    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar datos del estudiante
    await conn.query(
      `UPDATE students SET
         first_name   = ?,
         last_name    = ?,
         cdl          = ?,
         email        = ?,
         phone_number = ?,
         nfc_uid      = ?,
         course_id    = ?,
         is_active    = ?
       WHERE id = ?`,
      [
        first_name.trim(),
        last_name.trim(),
        cdl.trim(),
        email.trim(),
        phone_number,
        nfc_uid,
        course_id,
        is_active ?? true,
        id,
      ]
    );

    // Si se envía parent_cdl, asignar o actualizar representante
    if (parent_cdl?.trim()) {
      const [parentUser]: any = await conn.query(
        `SELECT id FROM users WHERE cdl = ? AND role = 'usuario' AND is_active = TRUE`,
        [parent_cdl.trim()]
      );

      if (!parentUser.length) {
        await conn.rollback();
        return NextResponse.json(
          { error: `No se encontró un representante activo con la cédula ${parent_cdl}` },
          { status: 404 }
        );
      }

      const parentId = parentUser[0].id;

      // Eliminar relación anterior si existe
      await conn.query(
        `DELETE FROM relationships WHERE student_id = ?`,
        [id]
      );

      // Crear nueva relación
      await conn.query(
        `INSERT INTO relationships (parent_id, student_id) VALUES (?, ?)`,
        [parentId, id]
      );
    }

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Estudiante actualizado correctamente",
    });
  } catch (error: any) {
    await conn.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      const message = error.message.includes("nfc_uid")
        ? "El NFC UID ya está registrado en otro estudiante"
        : error.message.includes("cdl")
        ? "La cédula ya está registrada"
        : error.message.includes("email")
        ? "El email ya está registrado"
        : "Ya existe un registro con esos datos";
      return NextResponse.json({ error: message }, { status: 409 });
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

// DELETE /api/students/:id — soft delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const {id} = await params;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      `SELECT id, is_active FROM students WHERE id = ?`,
      [id]
    );

    if (!existing.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 }
      );
    }

    if (!existing[0].is_active) {
      await conn.rollback();
      return NextResponse.json(
        { error: "El estudiante ya está desactivado" },
        { status: 409 }
      );
    }

    await conn.query(
      `UPDATE students SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Estudiante desactivado correctamente",
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