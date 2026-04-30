import { PoolConnection } from "mysql2/promise";

interface ResolvedSchedule {
    entry_time: string;
    exit_time: string;
    entry_tolerance: number;
    exit_tolerance: number;
    is_special: boolean;      // true si viene de special_day_schedules
    special_reason?: string;  // razón del horario especial
}

export async function resolveSchedule(
    conn: PoolConnection,
    date: string,
    sectionId: number,
    educationalLevelId: number
): Promise<ResolvedSchedule | null> {

    // ── 1. Buscar horario especial por especificidad descendente ──────────────
    //    Orden: más específico primero
    const [specials]: any = await conn.query(
        `SELECT
       entry_time, exit_time, entry_tolerance, exit_tolerance, reason,
       -- Calcular score de especificidad para ordenar
       (CASE WHEN section_id           IS NOT NULL THEN 2 ELSE 0 END +
        CASE WHEN educational_level_id IS NOT NULL THEN 1 ELSE 0 END) AS specificity
     FROM special_day_schedules
     WHERE date = ?
       AND (section_id           = ? OR section_id           IS NULL)
       AND (educational_level_id = ? OR educational_level_id IS NULL)
     ORDER BY specificity DESC
     LIMIT 1`,
        [date, sectionId, educationalLevelId]
    );

    if (specials.length) {
        const s = specials[0];
        return {
            entry_time: s.entry_time,
            exit_time: s.exit_time,
            entry_tolerance: s.entry_tolerance,
            exit_tolerance: s.exit_tolerance,
            is_special: true,
            special_reason: s.reason,
        };
    }

    // ── 2. Fallback al horario base ───────────────────────────────────────────
    const [base]: any = await conn.query(
        `SELECT entry_time, exit_time, entry_tolerance, exit_tolerance
     FROM schedules
     WHERE educational_level_id = ? AND section_id = ?`,
        [educationalLevelId, sectionId]
    );

    if (!base.length) return null;

    return {
        entry_time: base[0].entry_time,
        exit_time: base[0].exit_time,
        entry_tolerance: base[0].entry_tolerance,
        exit_tolerance: base[0].exit_tolerance,
        is_special: false,
    };
}