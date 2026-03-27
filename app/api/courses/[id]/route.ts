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
