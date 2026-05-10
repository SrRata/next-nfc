"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { StudentsPdfDocument } from "@/components/Studentspdfdocument ";
import { Student } from "@/app/dashboard/students/page";

export function useExportStudents(students: Student[]) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  // ─── PDF ─────────────────────────────────────────────────────────────────
  const exportToPdf = async () => {
    setExportingPdf(true);
    try {
      const blob = await pdf(
        StudentsPdfDocument({ students })
      ).toBlob();
      saveAs(blob, `listado_alumnos_${formatDateFile()}.pdf`);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
    } finally {
      setExportingPdf(false);
    }
  };

  // ─── EXCEL — sin estilos, solo N y Nombre ────────────────────────────────
  const exportToExcel = async () => {
    setExportingExcel(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Listado de Alumnos");

      // Columnas: N° y Nombre únicamente
      sheet.columns = [
        { header: "N",                    key: "n",      width: 6  },
        { header: "NOMBRE DEL ALUMNO",    key: "nombre", width: 45 },
        // Descomenta cuando tengas los datos:
        // { header: "DOCENTE", key: "docente", width: 30 },
        // { header: "CURSO",   key: "curso",   width: 20 },
      ];

      // Filas — apellido + nombre en mayúsculas, igual que el PDF
      students.forEach((s, i) => {
        sheet.addRow({
          n:      i + 1,
          nombre: `${s.last_name} ${s.first_name}`.toUpperCase(),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `listado_alumnos_${formatDateFile()}.xlsx`
      );
    } catch (err) {
      console.error("Error al exportar Excel:", err);
    } finally {
      setExportingExcel(false);
    }
  };

  return { exportToPdf, exportToExcel, exportingPdf, exportingExcel };
}

function formatDateFile() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}