// components/attendance/RealtimeDashboard.tsx
"use client";
import { usePolling } from "@/hooks/usePolling";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  status: "presente" | "atrasado" | "ausente" | "salida";
  entry_time: string | null;
  exit_time: string | null;
  observation: string | null;
}

export interface Metrics {
  total_students: number;
  total_present: number;
  percentage: number;
  total_late: number;
  as_of: string;
}

interface NotifRecord {
  id: number;
  first_name: string;
  last_name: string;
  entry_time: string | null;
  exit_time: string | null;
  observation: string | null;
  course_name?: string;
}

interface Props {
  metricsUrl:      string;
  studentListUrl?: string; // opcional, solo para profesor
  notificationsUrl: string;
}

export function RealtimeDashboard({ metricsUrl, studentListUrl, notificationsUrl }: Props) {
  const { data: metrics, loading: mLoading } = usePolling<Metrics>(metricsUrl);
  const { data: listData }                   = usePolling<{ students: Student[] }>(
    studentListUrl ?? "", 5000
  );
  const { data: notifData } = usePolling<{ records: NotifRecord[] }>(notificationsUrl);

  const students = listData?.students ?? [];
  const records  = notifData?.records ?? [];

  const pct = metrics?.percentage ?? 0;
  const barColor = pct >= 75 ? "#1D9E75" : pct >= 50 ? "#BA7517" : "#E24B4A";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10 }}>
        {[
          { label: "Presentes",   value: mLoading ? "…" : (metrics?.total_present ?? 0) },
          { label: "Porcentaje",  value: mLoading ? "…" : `${metrics?.percentage ?? 0}%` },
          { label: "Atrasados",   value: mLoading ? "…" : (metrics?.total_late ?? 0) },
          { label: "Ausentes",    value: mLoading ? "…" : ((metrics?.total_students ?? 0) - (metrics?.total_present ?? 0)) },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "14px 16px" }}>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 26, fontWeight: 500 }}>{m.value}</p>
            {m.label === "Porcentaje" && (
              <div style={{ height: 4, background: "var(--color-border-tertiary)", borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 2, transition: "width 0.6s ease" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lista de estudiantes (solo si viene studentListUrl) */}
      {studentListUrl && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {students.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0, background: s.status === "presente" ? "#E1F5EE" : s.status === "atrasado" ? "#FAEEDA" : "#F1EFE8", color: s.status === "presente" ? "#0F6E56" : s.status === "atrasado" ? "#854F0B" : "#5F5E5A" }}>
                {s.first_name[0]}{s.last_name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13 }}>{s.first_name} {s.last_name}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 10, background: s.status === "presente" ? "#E1F5EE" : s.status === "atrasado" ? "#FAEEDA" : s.status === "salida" ? "#E6F1FB" : "#F1EFE8", color: s.status === "presente" ? "#0F6E56" : s.status === "atrasado" ? "#854F0B" : s.status === "salida" ? "#185FA5" : "#5F5E5A" }}>
                {{ presente: "Presente", atrasado: "Atrasado", ausente: "Ausente", salida: "Salida" }[s.status]}
              </span>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", minWidth: 44, textAlign: "right" }}>
                {s.entry_time ?? "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Últimos registros */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {records.map((r, i) => (
          <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, background: r.exit_time ? "#E6F1FB" : r.observation?.includes("Atrasado") ? "#FAEEDA" : "#E1F5EE", color: r.exit_time ? "#185FA5" : r.observation?.includes("Atrasado") ? "#854F0B" : "#0F6E56" }}>
              {r.exit_time ? "↗" : r.observation?.includes("Atrasado") ? "!" : "✓"}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13 }}>
                <strong>{r.first_name} {r.last_name}</strong>
                {r.course_name && <span style={{ color: "var(--color-text-tertiary)", fontSize: 11 }}> — {r.course_name}</span>}
                {" — "}{r.observation ?? (r.exit_time ? "Salida" : "Entrada")}
              </p>
              <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                {r.entry_time ?? ""}{r.exit_time ? ` → ${r.exit_time}` : ""}
              </p>
            </div>
            {i === 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", marginTop: 4 }} />}
          </div>
        ))}
      </div>

    </div>
  );
}