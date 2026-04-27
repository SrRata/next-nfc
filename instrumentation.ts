export async function register() {
    // Solo ejecutar en el servidor, no en el edge runtime
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { startCronJobs } = await import("@/lib/attendance/cron");
        startCronJobs();
    }
}