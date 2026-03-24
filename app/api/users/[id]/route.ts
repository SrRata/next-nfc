// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/hooks/db"; 

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Se tipa como Promise
) {
  const { id } = await params; // Se extrae con await

  if (!id || id === "undefined") {
    return NextResponse.json({ message: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const [result]: any = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "El usuario no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Usuario eliminado" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Extraer el ID de la promesa params
  const { id } = await params;

  try {
    // 2. Obtener el nuevo estado del cuerpo de la petición
    const { isActive } = await request.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "El estado isActive es requerido y debe ser booleano" },
        { status: 400 }
      );
    }

    // 3. Ejecutar el UPDATE en MariaDB
    const [result]: any = await db.query(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: `Usuario ${isActive ? 'activado' : 'desactivado'} correctamente`,
      isActive 
    });

  } catch (error: any) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}
