import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  try {
    const [result]: any = await db.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );
    
    return NextResponse.json({ message: "Estudiante eliminado" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Error al eliminar estudiante" }, { status: 500 });
  }
}






export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await db.getConnection();
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, email, cdl, phoneNumber, nfc, parentId, courseId } = body;

    await connection.beginTransaction();

    // 1. Actualizar datos básicos del estudiante
    await connection.query(
      `UPDATE students 
       SET first_name = ?, last_name = ?, email = ?, cdl = ?, phone_number = ?, nfc_uid = ?, course_id = ?
       WHERE id = ?`,
      [firstName, lastName, email, cdl, phoneNumber, nfc, courseId || null, id]
    );

    // 2. Actualizar el representante (Padre)
    // Borramos la relación anterior e insertamos la nueva si existe
    await connection.query("DELETE FROM relationships WHERE student_id = ?", [id]);
    
    if (parentId && parentId !== "none") {
      await connection.query(
        "INSERT INTO relationships (parent_id, student_id) VALUES (?, ?)",
        [parentId, id]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: "Estudiante actualizado con éxito" });

  } catch (error: any) {
    await connection.rollback();
    console.error("Error al actualizar estudiante:", error);
    if (error.errno === 1062) {
        return NextResponse.json({ error: "El correo, CDL o NFC ya están en uso" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    connection.release();
  }
}
