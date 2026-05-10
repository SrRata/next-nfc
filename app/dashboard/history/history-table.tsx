"use client";

import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { studentState } from "@/lib/constants/data-type";
import { stateBadgeColor } from "@/lib/constants/get-badge-color";
import { AttendanceRecords } from "@/types/attendance";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate, formatTime, formatTime12h } from "@/lib/format-time";
import { IconAlertCircle, IconAlertCircleFilled } from "@tabler/icons-react";


interface Props {
  attendanceRecords: AttendanceRecords[]
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecords[]>>
  isLoading: boolean
}


export function HistoryTable({attendanceRecords, setAttendanceRecords, isLoading}: Props) {

  const columns: ColumnDef<AttendanceRecords>[] = [

    {
      accessorKey: "student_id",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={`${row.original.student_first_name} ${row.original.student_last_name}`} section={`${row.original.course_name} - ${row.original.section_name}`} />
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => (
        <p>
          {formatDate(row.original.date)}
        </p>
      )
    },
    {
      accessorKey: "entry_time",
      header: "Entrada",
      cell: ({ row }) => (
          row.original.entry_time ? formatTime12h(row.original.entry_time) : "..."
      )
    },
    {
      accessorKey: "exit_time",
      header: "Salida",
      cell: ({ row }) => (
          row.original.exit_time ? formatTime12h(row.original.exit_time) : "..."
      )
    },
    {
      accessorKey: "observation",
      header: "Observación",
    }
  ];

  return (
    <DataTable
      legend="Registros Encontrados"
      columns={columns}
      isLoading={isLoading}
      data={attendanceRecords ? attendanceRecords : []} />
  );
}
