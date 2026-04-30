import { db } from '@/lib/hooks/db';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name AS firstName, last_name AS lastName 
       FROM users 
       WHERE role = 'usuario' AND is_active = TRUE`
    );

    return NextResponse.json(rows, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching professors:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de profesores' },
      { status: 500 }
    );
  }
}
