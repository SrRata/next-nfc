import { db } from '@/lib/hooks/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { courseName, parallel, section, educationalLevel } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE courses 
       SET course_name = ?, parallel = ?, section = ?, educational_level = ?
       WHERE id = ?`,
      [courseName, parallel, section, educationalLevel, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Curso actualizado con éxito' });

  } catch (error: any) {
    console.error('Error al actualizar curso:', error);
    return NextResponse.json(
      { error: 'Error interno', details: error.message },
      { status: 500 }
    );
  }
}
