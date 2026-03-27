import { db } from '@/lib/hooks/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { isActive } = await request.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: "Valor de estado inválido" }, { status: 400 });
    }

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: `Estado actualizado a ${isActive}` });

  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}
