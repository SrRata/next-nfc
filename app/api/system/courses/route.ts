import { db } from '@/lib/hooks/db';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id, course_name AS courseName 
       FROM courses 
       WHERE is_active = TRUE`
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
