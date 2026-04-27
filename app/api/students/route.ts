import { db } from "@/lib/hooks/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/students
export async function GET() {
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
         u.phone_number                         AS parent_phone
       FROM students s
       LEFT JOIN courses c            ON c.id  = s.course_id
       LEFT JOIN educational_levels el ON el.id = c.educational_level_id
       LEFT JOIN sections sec         ON sec.id = c.section_id
       LEFT JOIN student_summaries ss ON ss.student_id = s.id
       LEFT JOIN relationships r      ON r.student_id  = s.id
       LEFT JOIN users u              ON u.id           = r.parent_id
       WHERE s.is_active = TRUE
       ORDER BY s.last_name ASC, s.first_name ASC`
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

// POST /api/students
export async function POST(req: NextRequest) {
  const conn = await db.getConnection();
  try {
    const {
      // Datos del estudiante
      first_name,
      last_name,
      cdl,
      email,
      phone_number = null,
      nfc_uid = null,
      course_id,
      // Datos del representante (todos opcionales)
      parent,
    }: {
      first_name: string;
      last_name: string;
      cdl: string;
      email: string;
      phone_number?: string;
      nfc_uid?: string;
      course_id: number;
      parent?: {
        first_name: string;
        last_name: string;
        cdl: string;
        email: string;
        phone_number?: string;
        username: string;
        password: string;
      };
    } = await req.json();

    // Validaciones del estudiante
    if (!first_name?.trim() || !last_name?.trim() || !cdl?.trim() || !email?.trim() || !course_id) {
      return NextResponse.json(
        { error: "Los campos first_name, last_name, cdl, email y course_id son requeridos" },
        { status: 400 }
      );
    }

    // Si vienen datos del representante, validar los campos mínimos
    const hasParentData = parent && Object.keys(parent).length > 0;
    if (hasParentData) {
      if (!parent.cdl?.trim() || !parent.first_name?.trim() || !parent.last_name?.trim() || !parent.email?.trim() || !parent.username?.trim() || !parent.password?.trim()) {
        return NextResponse.json(
          { error: "Si registras un representante debes completar: first_name, last_name, cdl, email, username y password" },
          { status: 400 }
        );
      }
    }

    await conn.beginTransaction();

    // Verificar curso activo
    const [course]: any = await conn.query(
      `SELECT id FROM courses WHERE id = ? AND is_active = TRUE`,
      [course_id]
    );
    if (!course.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "El curso no existe o está inactivo" },
        { status: 404 }
      );
    }

    // Crear estudiante
    const [studentResult]: any = await conn.query(
      `INSERT INTO students
         (first_name, last_name, cdl, email, phone_number, nfc_uid, course_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        first_name.trim(),
        last_name.trim(),
        cdl.trim(),
        email.trim(),
        phone_number,
        nfc_uid,
        course_id,
      ]
    );
    const studentId = studentResult.insertId;

    // Crear resumen inicial del estudiante
    await conn.query(
      `INSERT INTO student_summaries (student_id, total_attendances, total_absences)
       VALUES (?, 0, 0)`,
      [studentId]
    );

    // Manejar representante si se enviaron datos
    let parentId: number | null = null;

    if (hasParentData) {
      // Buscar si ya existe un usuario con esa cédula
      const [existingParent]: any = await conn.query(
        `SELECT id FROM users WHERE cdl = ?`,
        [parent!.cdl.trim()]
      );

      if (existingParent.length) {
        // Ya existe → solo usar su id
        parentId = existingParent[0].id;
      } else {
        // No existe → crear el usuario representante
        // En producción hashea el password con bcrypt
        const [parentResult]: any = await conn.query(
          `INSERT INTO users
             (first_name, last_name, username, cdl, password, email, phone_number, role, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'usuario', TRUE)`,
          [
            parent!.first_name.trim(),
            parent!.last_name.trim(),
            parent!.username.trim(),
            parent!.cdl.trim(),
            parent!.password, // ⚠️ hashear con bcrypt antes de guardar
            parent!.email.trim(),
            parent!.phone_number ?? null,
          ]
        );
        parentId = parentResult.insertId;
      }

      // Verificar que no exista ya el parentesco
      const [existingRel]: any = await conn.query(
        `SELECT id FROM relationships WHERE parent_id = ? AND student_id = ?`,
        [parentId, studentId]
      );

      if (!existingRel.length) {
        await conn.query(
          `INSERT INTO relationships (parent_id, student_id) VALUES (?, ?)`,
          [parentId, studentId]
        );
      }
    }

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: hasParentData
          ? "Estudiante y representante registrados correctamente"
          : "Estudiante registrado correctamente",
        data: {
          student_id: studentId,
          parent_id: parentId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    await conn.rollback();
    if (error?.code === "ER_DUP_ENTRY") {
      // Identificar qué campo está duplicado
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