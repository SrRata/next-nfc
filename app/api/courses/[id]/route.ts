import { NextResponse } from "next/server";
import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  try {
    const [result]: any = await db.query(
      "DELETE FROM courses WHERE id = ?",
      [id]
    );

    return NextResponse.json({ message: "Curso eliminado" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Error al eliminar el curso" }, { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const body = await request.json();

    console.log("Datos recibidos en PATCH:", { id, ...body });

    const { courseName, section, level, professorId } = body;

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE courses 
             SET course_name = ?, section = ?, educational_level = ?, professor_id = ?
             WHERE id = ?`,
      [courseName, section, level, professorId, id]
    )
    return NextResponse.json({ message: "Curso actualizado" });
  } catch (error: any) {
    console.error("Error al actualizar:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: "Este profesor ya está asignado como tutor en otro curso." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}