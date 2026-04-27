"use client";

import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

import data from "./data.json";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { studentState } from "@/lib/constants/data-type";
import { stateBadgeColor } from "@/lib/constants/get-badge-color";
import { AttendanceRecords } from "@/types/attendance";
import { useEffect, useState } from "react";
import axios from "axios";

export function HistoryTable() {

  const [AttendanceRecords, setAttendanceRecords] = useState<AttendanceRecords[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAttendanceRecords() {
      try {
        const response = await axios.get('/api/attendance-records');

        if (response.data.success) {
          setAttendanceRecords(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAttendanceRecords();
  }, [])

  const columns: ColumnDef<AttendanceRecords>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "student_id",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.student_id.toString()} section={row.original.student_id.toString()} />
      ),
    },
    {
      accessorKey: "entry_time",
      header: "Entrada",
    },
    {
      accessorKey: "exit_time",
      header: "Salida",
      cell: ({row}) => (
        row.original.exit_time ? row.original.exit_time : "Sin salida"
      )
    },
    {
      accessorKey: "observation",
      header: "Observación",
      cell: ({ row }) => {
        const state = row.original.observation;

        return (
          <Badge color={stateBadgeColor[state.toLowerCase()].color} circle>
            {stateBadgeColor[state.toLowerCase()].label}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "observation",
    //   header: "Observacion"
    // }
  ];

  return (
    <DataTable
      legend="Registros Encontrados"
      columns={columns}
      data={AttendanceRecords ? AttendanceRecords : []} />
  );
}
