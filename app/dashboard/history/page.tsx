"use client"
import { Filters, FiltersSkeleton } from "@/components/filters";
import { HistoryTable } from "./history-table";
import { educationLevels, studentStates } from "@/lib/constants/data-type";
import { Suspense, useEffect, useState } from "react";
import { TableSkeleton } from "@/components/table";
import { InfoCard } from "@/components/info-card";
import { Users } from "lucide-react";
import axios from "axios";
import { AttendanceRecords } from "@/types/attendance";

export default function HistoryPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecords[]>([])
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


  const total_registers = attendanceRecords.length;
  const total_lates = attendanceRecords.filter(e => e.observation === "Atrasado").length;
  const total_absents = attendanceRecords.filter(e => e.observation === "Ausente").length;

  return (
    <>


      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Total registros"
        value={total_registers ? total_registers : "--"}
        variant="compact"
      />

      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Total atrasos"
        value={total_lates ? total_lates : "--"}
        variant="compact"
      />

      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Total faltas"
        value={total_absents ? total_absents : "--"}
        variant="compact"
      />

      <Suspense fallback={<TableSkeleton />}>
        <HistoryTable attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} isLoading={isLoading} />
      </Suspense>
    </>
  );
}
