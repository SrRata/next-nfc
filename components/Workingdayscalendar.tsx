"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "holiday" | "special";

interface Holiday {
  id?: number;
  date: string;
  reason: string;
}

interface SpecialVariation {
  id?: number | null;
  section_id: number | null;
  section_name: string;
  educational_level_id: number | null;
  educational_level_name: string;
  entry_time: string;   // HH:MM
  exit_time: string;
  entry_tolerance?: number;
  exit_tolerance?: number;
  reason: string;
}

interface Section { id: number; name: string; }
interface Level   { id: number; name: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}
function getDaysInMonth(y: number, m: number) { return new Date(y,m+1,0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y,m,1).getDay(); }
function isWeekend(y: number, m: number, d: number) {
  const w = new Date(y,m,d).getDay(); return w===0||w===6;
}
function isToday(y: number, m: number, d: number) {
  const t = new Date();
  return t.getFullYear()===y && t.getMonth()===m && t.getDate()===d;
}
function formatDisplay(y: number, m: number, d: number) {
  return new Date(y,m,d).toLocaleDateString("es-EC",{
    weekday:"long", year:"numeric", month:"long", day:"numeric",
  });
}
function fmtScope(v: SpecialVariation) {
  const sec = v.section_name            || "Todas las secciones";
  const lev = v.educational_level_name  || "Todos los niveles";
  return `${sec} · ${lev}`;
}

// ─── Token shortcuts ──────────────────────────────────────────────────────────

const T = {
  bg:        "var(--color-white-primary)",
  bgGray:    "var(--color-gray)",
  black:     "var(--color-black-primary)",
  gray:      "var(--color-black-secondary)",
  border:    "oklch(0.922 0 0)",
  radius:    "var(--radius-primary)",
  radiusSm:  "var(--radius-secondary)",
  blue:      "var(--color-blue-primary)",
  redBg:     "var(--color-red-secondary)",
  redBorder: "var(--color-red-primary)",
  redText:   "var(--color-red-primary)",
  amberBg:   "var(--color-yellow-secondary)",
  amberBorder:"var(--color-yellow-primary)",
  amberText: "var(--color-yellow-primary)",
  greenText: "var(--color-green-primary)",
};

// ─── Special form (inside modal) ──────────────────────────────────────────────

interface SpecialFormProps {
  sections: Section[];
  levels:   Level[];
  onAdd:    (v: SpecialVariation) => void;
  onCancel: () => void;
}

function SpecialForm({ sections, levels, onAdd, onCancel }: SpecialFormProps) {
  const [sectionId, setSectionId] = useState<string>("");
  const [levelId,   setLevelId]   = useState<string>("");
  const [entry,     setEntry]     = useState("07:30");
  const [exit_,     setExit]      = useState("13:00");
  const [reason,    setReason]    = useState("");
  const [err,       setErr]       = useState("");

  function handleAdd() {
    if (!reason.trim()) { setErr("La razón es obligatoria"); return; }
    if (!entry || !exit_)  { setErr("Completa los horarios"); return; }
    if (entry >= exit_)    { setErr("La entrada debe ser antes que la salida"); return; }

    const sec = sections.find(s => String(s.id) === sectionId);
    const lev = levels.find(l   => String(l.id) === levelId);

    onAdd({
      id:                     null,
      section_id:             sec ? sec.id : null,
      section_name:           sec ? sec.name : "Todas las secciones",
      educational_level_id:   lev ? lev.id : null,
      educational_level_name: lev ? lev.name : "Todos los niveles",
      entry_time:  entry + ":00",
      exit_time:   exit_  + ":00",
      entry_tolerance: 10,
      exit_tolerance:  20,
      reason: reason.trim(),
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "7px 10px",
    border: `0.5px solid ${T.border}`,
    borderRadius: T.radiusSm,
    background: T.bg,
    color: T.black,
    fontSize: 11,
    fontFamily: "sans-serif",
    outline: "none",
  };

  return (
    <div style={{ background: T.bgGray, borderRadius: T.radius, padding: 10, marginTop: 8 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <div>
          <p style={{ fontSize:11, color: T.gray, marginBottom:4 }}>Sección</p>
          <select value={sectionId} onChange={e=>setSectionId(e.target.value)} style={inputStyle}>
            <option value="">Todas las secciones</option>
            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <p style={{ fontSize:11, color: T.gray, marginBottom:4 }}>Nivel educativo</p>
          <select value={levelId} onChange={e=>setLevelId(e.target.value)} style={inputStyle}>
            <option value="">Todos los niveles</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <div>
          <p style={{ fontSize:11, color: T.gray, marginBottom:4 }}>Hora entrada</p>
          <input type="time" value={entry} onChange={e=>setEntry(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <p style={{ fontSize:11, color: T.gray, marginBottom:4 }}>Hora salida</p>
          <input type="time" value={exit_} onChange={e=>setExit(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize:11, color: T.gray, marginBottom:4 }}>Razón</p>
        <input
          value={reason}
          onChange={e=>{ setReason(e.target.value); setErr(""); }}
          placeholder="Ej: Feria de ciencias, Día de recuperación..."
          style={inputStyle}
        />
      </div>

      {err && <p style={{ fontSize:11, color: T.redText, marginBottom:6 }}>{err}</p>}

      <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
        <button onClick={onCancel} style={btnStyle()}>Cancelar</button>
        <button onClick={handleAdd} style={btnStyle(true)}>Agregar</button>
      </div>
    </div>
  );
}

// ─── Button style helper ──────────────────────────────────────────────────────

function btnStyle(primary = false, danger = false): React.CSSProperties {
  if (primary) return {
    padding:"6px 14px", borderRadius:"var(--radius-primary)",
    border: `0.5px solid ${T.blue}`,
    background: T.blue, color:"#fff",
    fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"sans-serif",
  };
  if (danger) return {
    padding:"6px 14px", borderRadius:"var(--radius-primary)",
    border: `0.5px solid ${T.redBorder}`,
    background: T.redBg, color: T.redText,
    fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"sans-serif",
  };
  return {
    padding:"6px 14px", borderRadius:"var(--radius-primary)",
    border: `0.5px solid ${T.border}`,
    background:"transparent", color: T.black,
    fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"sans-serif",
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkingDaysCalendarProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function WorkingDaysCalendar({ className, style }: WorkingDaysCalendarProps) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [holidays,  setHolidays]  = useState<Map<string, Holiday>>(new Map());
  const [specials,  setSpecials]  = useState<Map<string, SpecialVariation[]>>(new Map());
  const [sections,  setSections]  = useState<Section[]>([]);
  const [levels,    setLevels]    = useState<Level[]>([]);
  const [loading,   setLoading]   = useState(false);

  // Modal
  const [open,         setOpen]         = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [displayDate,  setDisplayDate]  = useState("");
  const [mode,         setMode]         = useState<Mode>("holiday");
  const [hReason,      setHReason]      = useState("");
  const [pending,      setPending]      = useState<SpecialVariation[]>([]);
  const [showForm,     setShowForm]     = useState(false);
  const [saving,       setSaving]       = useState(false);

  // ── Fetch data ─────────────────────────────────────────────────────────────

  const fetchMonth = useCallback(async () => {
    setLoading(true);
    try {
      const m = `${year}-${String(month+1).padStart(2,"0")}`;

      const [holRes, specRes, secRes, levRes] = await Promise.all([
        fetch(`/api/working-days?month=${m}`),
        fetch(`/api/special-schedules?month=${m}`),
        fetch("/api/sections"),
        fetch("/api/educational-levels"),
      ]);

      const [holData, specData, secData, levData] = await Promise.all([
        holRes.json(), specRes.json(), secRes.json(), levRes.json(),
      ]);

      if (holData.success) {
        const map = new Map<string, Holiday>();
        holData.data.forEach((h: any) => map.set(h.date, h));
        setHolidays(map);
      }

      if (specData.success) {
        const map = new Map<string, SpecialVariation[]>();
        Object.entries(specData.data as Record<string, SpecialVariation[]>)
          .forEach(([date, vars]) => map.set(date, vars));
        setSpecials(map);
      }

      if (secData.success) setSections(secData.data);
      if (levData.success) setLevels(levData.data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { fetchMonth(); }, [fetchMonth]);

  // ── Navigation ─────────────────────────────────────────────────────────────

  function prevMonth() {
    if (month===0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1);
  }
  function nextMonth() {
    if (month===11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1);
  }

  // ── Modal open ─────────────────────────────────────────────────────────────

  function openModal(ds: string, d: number) {
    const isHol  = holidays.has(ds);
    const isSpec = specials.has(ds);

    setSelectedDate(ds);
    setDisplayDate(formatDisplay(year, month, d));
    setMode(isHol ? "holiday" : "special");
    setHReason(holidays.get(ds)?.reason ?? "");
    setPending(JSON.parse(JSON.stringify(specials.get(ds) ?? [])));
    setShowForm(false);
    setOpen(true);
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    try {
      if (mode === "holiday") {
        if (!hReason.trim()) { alert("La razón es obligatoria"); setSaving(false); return; }
        await fetch("/api/working-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate, reason: hReason.trim() }),
        });
        setHolidays(prev => {
          const next = new Map(prev);
          next.set(selectedDate, { date: selectedDate, reason: hReason.trim() });
          return next;
        });
        setSpecials(prev => { const next = new Map(prev); next.delete(selectedDate); return next; });

      } else {
        // Guardar cada variación pendiente
        for (const v of pending) {
          if (v.id) {
            await fetch(`/api/special-schedules/${v.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                entry_time: v.entry_time, exit_time: v.exit_time,
                entry_tolerance: v.entry_tolerance ?? 10,
                exit_tolerance:  v.exit_tolerance  ?? 20,
                reason: v.reason,
              }),
            });
          } else {
            await fetch("/api/special-schedules", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                date:                 selectedDate,
                section_id:           v.section_id,
                educational_level_id: v.educational_level_id,
                entry_time:           v.entry_time,
                exit_time:            v.exit_time,
                entry_tolerance:      v.entry_tolerance ?? 10,
                exit_tolerance:       v.exit_tolerance  ?? 20,
                reason:               v.reason,
              }),
            });
          }
        }
        setSpecials(prev => {
          const next = new Map(prev);
          if (pending.length) next.set(selectedDate, pending);
          else next.delete(selectedDate);
          return next;
        });
        setHolidays(prev => { const next = new Map(prev); next.delete(selectedDate); return next; });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  // ── Remove ─────────────────────────────────────────────────────────────────

  async function handleRemove() {
    setSaving(true);
    try {
      if (holidays.has(selectedDate)) {
        await fetch(`/api/working-days/${selectedDate}`, { method: "DELETE" });
        setHolidays(prev => { const next = new Map(prev); next.delete(selectedDate); return next; });
      }
      if (specials.has(selectedDate)) {
        const vars = specials.get(selectedDate) ?? [];
        for (const v of vars) {
          if (v.id) await fetch(`/api/special-schedules/${v.id}`, { method: "DELETE" });
        }
        setSpecials(prev => { const next = new Map(prev); next.delete(selectedDate); return next; });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = (() => {
    const total = getDaysInMonth(year, month);
    let hols = 0, spec = 0;
    for (let d=1; d<=total; d++) {
      const ds = toDateStr(year, month, d);
      if (isWeekend(year,month,d)) continue;
      if (holidays.has(ds)) hols++;
      else if (specials.has(ds)) spec++;
    }
    const wknd = Array.from({length:total},(_,i)=>isWeekend(year,month,i+1)?1:0).reduce((a, b) => a + b, 0 as number);

    return { working: total - wknd - hols, holidays: hols, special: spec };
  })();

  // ── Render ─────────────────────────────────────────────────────────────────

  const firstDay    = getFirstDay(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "7px 10px",
    border: `0.5px solid ${T.border}`,
    borderRadius: T.radiusSm,
    background: T.bg, color: T.black,
    fontSize: 11, fontFamily: "sans-serif", outline: "none",
  };

  return (
    <>
      <div className={className} style={{ background: T.bg, borderRadius: T.radius, padding:"1.5rem", ...style }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
          <h2 style={{ fontSize:14, fontWeight:600, color: T.black }}>Días laborables</h2>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {[prevMonth, nextMonth].map((fn, i) => (
              <button key={i} onClick={i===0?prevMonth:nextMonth} style={{
                width:28, height:28, borderRadius: T.radiusSm,
                border:`0.5px solid ${T.border}`, background:"transparent",
                color: T.black, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {i===0 ? <ChevronLeft size={13}/> : <ChevronRight size={13}/>}
              </button>
            ))}
            <span style={{ fontSize:12, fontWeight:500, color: T.black, minWidth:128, textAlign:"center" }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} style={{display:"none"}} />
          </div>
        </div>

        {/* Navigation fix — separate buttons */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6, marginTop:"-2.5rem", marginBottom:"1.25rem" }}>
          <button onClick={prevMonth} style={{
            width:28, height:28, borderRadius: T.radiusSm,
            border:`0.5px solid ${T.border}`, background:"transparent",
            color: T.black, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}><ChevronLeft size={13}/></button>
          <span style={{ fontSize:12, fontWeight:500, color: T.black, minWidth:128, textAlign:"center" }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} style={{
            width:28, height:28, borderRadius: T.radiusSm,
            border:`0.5px solid ${T.border}`, background:"transparent",
            color: T.black, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}><ChevronRight size={13}/></button>
        </div>

        {/* Legend */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:12 }}>
          {[
            { label:"Feriado",          bg: T.redBg,   border: T.redBorder   },
            { label:"Horario especial", bg: T.amberBg, border: T.amberBorder },
            { label:"Fin de semana",    bg: T.bgGray,  border: T.border, opacity:.6 },
          ].map(l => (
            <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:l.bg, border:`0.5px solid ${l.border}`, opacity:l.opacity }} />
              <span style={{ fontSize:10, color: T.gray }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:500, color: T.gray, textTransform:"uppercase", letterSpacing:".4px", padding:"3px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3,
          opacity: loading ? .5 : 1,
          pointerEvents: loading ? "none" : "auto",
          transition:"opacity .15s",
        }}>
          {Array.from({length:firstDay}).map((_,i) => <div key={`e-${i}`}/>)}

          {Array.from({length:daysInMonth},(_,i)=>i+1).map(d => {
            const ds     = toDateStr(year,month,d);
            const wend   = isWeekend(year,month,d);
            const today_ = isToday(year,month,d);
            const isHol  = holidays.has(ds);
            const isSpec = specials.has(ds);

            const cellBg = wend ? T.bgGray : isHol ? T.redBg : isSpec ? T.amberBg : T.bg;
            const cellBd = wend ? T.border : isHol ? T.redBorder : isSpec ? T.amberBorder : T.border;
            const numClr = wend ? T.gray   : isHol ? T.redText  : isSpec ? T.amberText  : T.black;

            return (
              <div
                key={d}
                onClick={() => { if(!wend) openModal(ds,d); }}
                style={{
                  aspectRatio:"1",
                  borderRadius: T.radiusSm,
                  border: today_
                    ? `2px solid ${T.blue}`
                    : `0.5px solid ${cellBd}`,
                  background: cellBg,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  cursor: wend ? "default" : "pointer",
                  opacity: wend ? .4 : 1,
                  position:"relative",
                  transition:"filter .1s",
                }}
                onMouseEnter={e => { if(!wend) (e.currentTarget as HTMLDivElement).style.filter="brightness(.95)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.filter="none"; }}
              >
                <span style={{ fontSize:11, fontWeight:500, lineHeight:1, color:numClr }}>{d}</span>

                {/* Dots */}
                {!wend && (isHol || isSpec) && (
                  <div style={{ display:"flex", gap:2, marginTop:3 }}>
                    {isHol && <div style={{ width:4, height:4, borderRadius:"50%", background: T.redBorder }} />}
                    {isSpec && (specials.get(ds)||[]).slice(0,3).map((_,i) => (
                      <div key={i} style={{ width:4, height:4, borderRadius:"50%", background: T.amberBorder }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:14 }}>
          {[
            { label:"Laborables",          value: stats.working,  color: T.greenText  },
            { label:"Feriados",            value: stats.holidays, color: T.redText    },
            { label:"Horario especial",    value: stats.special,  color: T.amberText  },
          ].map(s => (
            <div key={s.label} style={{ background: T.bgGray, borderRadius: T.radius, padding:"10px 12px" }}>
              <p style={{ fontSize:10, color: T.gray, marginBottom:3 }}>{s.label}</p>
              <p style={{ fontSize:20, fontWeight:600, color:s.color, lineHeight:1 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={v => !v && setOpen(false)}>
        <DialogContent style={{ maxWidth:400, padding:"1.25rem", maxHeight:"85vh", overflowY:"auto" }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize:14, fontWeight:600, color: T.black }}>
              Configurar día
            </DialogTitle>
            <p style={{ fontSize:11, color: T.gray, textTransform:"capitalize", marginTop:2 }}>
              {displayDate}
            </p>
          </DialogHeader>

          {/* Mode selector */}
          <div style={{ marginTop:14, marginBottom:12 }}>
            <p style={{ fontSize:11, fontWeight:500, color: T.gray, marginBottom:8 }}>Tipo de día</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {([["holiday","Feriado",[T.redBg,T.redBorder,T.redText]],["special","Horario especial",[T.amberBg,T.amberBorder,T.amberText]]] as const).map(([m,label,[bg,border,color]])=>(
                <button
                  key={m}
                  onClick={() => setMode(m as Mode)}
                  style={{
                    padding:"8px 4px", borderRadius: T.radius,
                    border: `0.5px solid ${mode===m ? border : T.border}`,
                    background: mode===m ? bg : "transparent",
                    color: mode===m ? color : T.gray,
                    fontSize:11, fontWeight:500, cursor:"pointer",
                    fontFamily:"sans-serif", transition:"all .12s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Holiday section */}
          {mode === "holiday" && (
            <div>
              <p style={{ fontSize:11, fontWeight:500, color: T.gray, marginBottom:6 }}>
                Razón del feriado
              </p>
              <input
                value={hReason}
                onChange={e => setHReason(e.target.value)}
                placeholder="Ej: Navidad, Día de independencia..."
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = T.blue)}
                onBlur={e  => (e.target.style.borderColor = T.border)}
              />
            </div>
          )}

          {/* Special section */}
          {mode === "special" && (
            <div>
              <p style={{ fontSize:11, fontWeight:500, color: T.gray, marginBottom:8 }}>
                Variaciones de horario
              </p>

              {/* Existing variations */}
              {pending.length === 0 && (
                <p style={{ fontSize:11, color: T.gray, fontStyle:"italic", textAlign:"center", padding:"8px 0" }}>
                  Sin variaciones. Agrega una abajo.
                </p>
              )}

              {pending.map((v, i) => (
                <div key={i} style={{
                  background: T.bgGray, borderRadius: T.radius,
                  padding:"8px 10px", marginBottom:6,
                  display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
                }}>
                  <div>
                    <p style={{ fontSize:11, fontWeight:500, color: T.black }}>{fmtScope(v)}</p>
                    <p style={{ fontSize:10, color: T.gray }}>{v.reason}</p>
                    <p style={{ fontSize:10, color: T.gray }}>{v.entry_time.slice(0,5)} – {v.exit_time.slice(0,5)}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (v.id) {
                        await fetch(`/api/special-schedules/${v.id}`, { method:"DELETE" });
                      }
                      setPending(prev => prev.filter((_,j) => j!==i));
                    }}
                    style={{ background:"transparent", border:"none", cursor:"pointer", color: T.gray, fontSize:13, padding:"2px 4px", borderRadius:4 }}
                  >
                    <X size={12}/>
                  </button>
                </div>
              ))}

              {/* Add variation button / form */}
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    width:"100%", padding:7,
                    border:`0.5px dashed ${T.border}`,
                    borderRadius: T.radius,
                    background:"transparent", color: T.gray,
                    fontSize:11, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                    fontFamily:"sans-serif",
                  }}
                >
                  <Plus size={12}/> Agregar variación de horario
                </button>
              ) : (
                <SpecialForm
                  sections={sections}
                  levels={levels}
                  onAdd={v => { setPending(prev => [...prev, v]); setShowForm(false); }}
                  onCancel={() => setShowForm(false)}
                />
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display:"flex", gap:6, justifyContent:"flex-end", marginTop:16 }}>
            {(holidays.has(selectedDate) || specials.has(selectedDate)) && (
              <button onClick={handleRemove} disabled={saving} style={{ ...btnStyle(false,true), marginRight:"auto" }}>
                Quitar
              </button>
            )}
            <button onClick={() => setOpen(false)} style={btnStyle()}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ ...btnStyle(true), opacity: saving ? .7 : 1 }}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}