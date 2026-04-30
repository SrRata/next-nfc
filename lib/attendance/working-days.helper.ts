// import db from "@/lib/db";

// export async function isWorkingDay(date: string): Promise<boolean> {
//   // Fin de semana → nunca laborable
//   const dow = new Date(date).getUTCDay();
//   if (dow === 0 || dow === 6) return false;

//   // Si está en working_days → es feriado → no laborable
//   const [rows]: any = await db.query(
//     `SELECT id FROM working_days WHERE date = ?`,
//     [date]
//   );

//   return rows.length === 0;
// }


// lib/attendance/working-days.helper.ts
import pool from "@/lib/db";

// export async function isWorkingDay(date: string): Promise<boolean> {
//   // Fin de semana → nunca laborable
//   const dow = new Date(date).getUTCDay();
//   if (dow === 0 || dow === 6) return false;

//   // Si está en working_days → es feriado → no laborable
//   const [rows]: any = await pool.query(
//     `SELECT id FROM working_days WHERE date = ?`,
//     [date]
//   );

//   return rows.length === 0;
// }


// Para testing — descomentar solo en desarrollo
export async function isWorkingDay(date: string): Promise<boolean> {
  // const dow = new Date(date).getUTCDay();
  // if (dow === 0 || dow === 6) return false; // ← comentar esto
  const [rows]: any = await pool.query(
    `SELECT id FROM working_days WHERE date = ?`, [date]
  );
  return rows.length === 0;
}