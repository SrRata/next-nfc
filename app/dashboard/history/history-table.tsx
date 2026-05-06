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
      cell: ({ row }) => (
        <p>
          {formatDate(row.original.date)}
        </p>
      )
    },
    {
      accessorKey: "student_id",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={`${row.original.student_first_name} ${row.original.student_last_name}`} section={`${row.original.course_name} - ${row.original.section_name}`} />
      ),
    },
    {
      accessorKey: "entry_time",
      header: "Entrada",
      cell: ({ row }) => (
        <p className="font-bold text-[12px]">
          {formatTime12h(row.original.entry_time)}
        </p>
      )
    },
    {
      accessorKey: "exit_time",
      header: "Salida",
      cell: ({ row }) => (
        // row.original.exit_time ? (<p className="font-bold text-[12px]">
        //   {formatTime12h(row.original.exit_time)}
        // </p>) : (
        //   <Badge color="yellow">Pendiente</Badge>
        // )

        <p className="font-bold text-[12px]">
          {formatTime12h(row.original.exit_time)}
        </p>
      )
    },
    {
      accessorKey: "observation",
      header: "Observación",
    }
    // {
    //   accessorKey: "observation",
    //   header: "Observación",
    //   cell: ({ row }) => {
    //     const state = row.original.observation;

    //     return (
    //       row.original.exit_time ? (
    //         <p>Salida aun no registrada</p>
    //       ) : (<div className="flex items-center gap-3">
    //         <IconAlertCircleFilled className="text-yellow-500" />
    //         <p className="text-black-secondary">Salida aun no registrada</p>
    //       </div>)
    //     );
    //   },
    // },
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
