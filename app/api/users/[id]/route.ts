import { NextResponse } from "next/server";
import { db } from "@/lib/hooks/db";
import { ResultSetHeader } from "mysql2";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  try {
    const [result]: any = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    
    return NextResponse.json({ message: "Usuario eliminado" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Error al eliminar usuario" }, { status: 500 });
  }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { firstName, lastName, email, cdl, phoneNumber, role } = body;

        // Actualizamos los campos usando los nombres de columna de tu DB MariaDB
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE users 
             SET first_name = ?, last_name = ?, email = ?, cdl = ?, phone_number = ?, role = ?
             WHERE id = ?`,
            [firstName, lastName, email, cdl, phoneNumber || null, role, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Usuario actualizado correctamente" });

    } catch (error: any) {
        console.error("Error al actualizar:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "El Email o CDL ya están en uso" }, { status: 409 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
