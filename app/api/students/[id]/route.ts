import { db } from "@/lib/hooks/db";
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