import { db } from '@/lib/hooks/db';
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';


export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id, CONCAT(first_name, ' ', last_name) as fullName 
       FROM users 
       WHERE role = 'profesor' AND is_active = TRUE`
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
