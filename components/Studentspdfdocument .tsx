"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Student } from "@/app/dashboard/students/page";

// ─── Estilos ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: "#FFFFFF",
  },

  // ── Título ──────────────────────────────────────────────────────────────
  title: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textDecoration: "underline",
    textTransform: "uppercase",
    marginBottom: 20,
  },

  // ── Metadatos (docente / grado) — listos para que los agregues ──────────
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 10,
  },
  metaValue: {
    fontSize: 10,
    textDecoration: "underline",
  },

  // ── Tabla ────────────────────────────────────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    borderTop: "1.5px solid #000",
    borderBottom: "1.5px solid #000",
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5px solid #000",
    paddingVertical: 5,
  },

  colN:      { width: "10%", textAlign: "center", fontFamily: "Helvetica-Bold" },
  colNombre: { width: "90%", paddingLeft: 8,      fontFamily: "Helvetica-Bold" },
  cellN:     { width: "10%", textAlign: "center" },
  cellNombre:{ width: "90%", paddingLeft: 8 },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerText: {
    fontSize: 7,
    color: "#9CA3AF",
  },
});

// ─── Props — agrega docente y curso cuando estés listo ──────────────────────
interface Props {
  students: Student[];
  // docente?: string;   // <-- descomenta cuando lo necesites
  // curso?: string;     // <-- descomenta cuando lo necesites
  year?: number;
}

export function StudentsPdfDocument({ students, year }: Props) {

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Título ── */}
        <Text style={s.title}>
          Listado de alumnos 
        </Text>

        {/* ── Metadatos — descomenta y completa cuando tengas los datos ──
        <View style={s.metaRow}>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Text style={s.metaText}>Nombre del docente: </Text>
            <Text style={s.metaValue}>{docente ?? "___________________________"}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Text style={[s.metaText, { fontFamily: "Helvetica-Bold" }]}>Grado: </Text>
            <Text style={s.metaValue}>{curso ?? "___________"}</Text>
          </View>
        </View>
        ── */}

        {/* ── Encabezado de tabla ── */}
        <View style={s.tableHeader}>
          <Text style={s.colN}>N</Text>
          <Text style={s.colNombre}>NOMBRE DEL ALUMNO</Text>
        </View>

        {/* ── Filas ── */}
        {students.map((student, i) => (
          <View key={student.id} style={s.tableRow} wrap={false}>
            <Text style={s.cellN}>{i + 1}</Text>
            <Text style={s.cellNombre}>
              {`${student.last_name} ${student.first_name}`.toUpperCase()}
            </Text>
          </View>
        ))}

        {/* ── Pie de página ── */}
        <View style={s.footer} fixed>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}