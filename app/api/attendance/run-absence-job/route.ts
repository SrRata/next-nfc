import { NextRequest, NextResponse } from "next/server";
import { runAbsenceJob } from "@/lib/attendance/absence.job";

export async function POST(req: NextRequest) {
  // // Proteger con una clave secreta para no exponerlo públicamente
  // const authHeader = req.headers.get("x-cron-secret");

  // if (authHeader !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  // }

  // try {
    await runAbsenceJob();
    return NextResponse.json({ success: true, message: "Job ejecutado correctamente" });
  // } catch (error) {
    // return NextResponse.json({ error: "Error ejecutando el job" }, { status: 500 });
  // }
}