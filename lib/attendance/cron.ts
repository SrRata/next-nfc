import cron from "node-cron";
import { runAbsenceJob } from "./absence.job";

let isScheduled = false;

export function startCronJobs(): void {
    // Evita registrar el cron más de una vez en hot-reload de Next.js
    if (isScheduled) return;
    isScheduled = true;

    // Se ejecuta cada día a las 23:59
    // Formato: segundo minuto hora día mes día-semana
    cron.schedule("59 23 * * *", async () => {
        console.log("[Cron] Disparando job de ausencias...");
        await runAbsenceJob();
    }, {
        timezone: "America/Guayaquil" // ✅ Zona horaria de Ecuador
    });

    console.log("[Cron] Jobs registrados correctamente.");
}