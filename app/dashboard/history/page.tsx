"use client"
import { Suspense, useEffect, useState } from "react";
import axios from "axios";

import { HistoryTable } from "./history-table";
import { TableSkeleton } from "@/components/table";
import { InfoCard } from "@/components/info-card";

import { ClockAlert, FileStack, UserX } from "lucide-react";

import { AttendanceRecords } from "@/types/attendance";

export default function HistoryPage() {

  const [user, setUser] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    role: '',
    username: ''
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecords[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // cargar perfil
  useEffect(() => {
    async function getProfile() {
      try {
        const response = await axios.get('/api/profile');
        setUser(response.data);
      } catch (error) {
        console.error("Error cargando perfil", error);
      }
    }

    getProfile();
  }, []);

  // cargar historial
  useEffect(() => {

    // evitar ejecutar antes de tener usuario
    if (!user.role) return;

    async function loadAttendanceRecords() {
      try {

        let response;

        switch (user.role) {

          case 'usuario':
            response = await axios.get(
              `/api/attendance-records?parent_id=${user.id}`
            );
            break;

          case 'profesor':
            response = await axios.get(
              `/api/attendance-records?professor_id=${user.id}`
            );
            break;

          default:
            response = await axios.get('/api/attendance-records');
            break;
        }

        if (response.data.success) {
          setAttendanceRecords(response.data.data);
        }

      } catch (error) {
        console.error('Error fetching attendance records:', error);

      } finally {
        setIsLoading(false);
      }
    }

    loadAttendanceRecords();

  }, [user]);



  const total_registers = attendanceRecords.length;

  const total_lates =
    attendanceRecords.filter(
      e => e.observation === "Atrasado"
    ).length;

  const total_absents =
    attendanceRecords.filter(
      e => e.observation === "Ausente"
    ).length;

  return (
    <>

      <InfoCard
        icon={FileStack}
        colorIcon="blue"
        title="Total registros"
        value={total_registers || "--"}
        variant="compact"
      />

      <InfoCard
        icon={ClockAlert}
        colorIcon="yellow"
        title="Total atrasos"
        value={total_lates || "--"}
        variant="compact"
      />

      <InfoCard
        icon={UserX}
        colorIcon="red"
        title="Total faltas"
        value={total_absents || "--"}
        variant="compact"
      />

      <Suspense fallback={<TableSkeleton />}>
        <HistoryTable
          attendanceRecords={attendanceRecords}
          setAttendanceRecords={setAttendanceRecords}
          isLoading={isLoading}
        />
      </Suspense>

    </>
  );
}