"use client"
import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users } from "lucide-react";
import { ReportChart } from "./report-chart";
import { ReportTable } from "./reports-table";
import { Filters, FiltersSkeleton } from "@/components/filters";
import {
  educationLevels,
  sections,
  studentStates,
} from "@/lib/constants/data-type";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";


export interface dataReportTableStudents {
  id: string;
  name: string;
  course: number;
  section: string;
  absences: number;
  assists: number;
}


export default function reportsPage() {

  const [user, setUser] = useState({
    role: '',
    id: ''
  });

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data);

    } catch (error) {
      console.error("Error cargando perfil", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);



  const [reportTableStudents, setReportTableStudent] = useState<dataReportTableStudents[]>([]);
  const [isLoadingReportTable, setIsLoadingReportTable] = useState(true);


  useEffect(() => {
    if (!user?.role || !user?.id) return;

    async function loadAttendanceRecords() {
      try {
        setIsLoadingReportTable(true);

        let url = "/api/metrics/students-summary";

        if (user.role === "usuario") {
          url += `?parent_id=${user.id}`;
        }

        if (user.role === "profesor") {
          url += `?professorId=${user.id}`;
        }

        const response = await axios.get(url);

        setReportTableStudent(response.data); 

      } catch (error) {
        console.error("Error fetching attendance records:", error);
      } finally {
        setIsLoadingReportTable(false);
      }
    }

    loadAttendanceRecords();
  }, [user]);

  return (
    <>
      <InfoCard
        variant="compact"
        icon={Percent}
        colorIcon="blue"
        title="Asistencia media"
        value="92.4%"
        alert="+2.1% vs al mes anterior"
        alertColor="green"
      />
      <InfoCard
        variant="compact"
        icon={Users}
        colorIcon="red"
        title="Total faltas"
        value={42}
        alert="En el periodo lectivo actual"
      />
      <InfoCard
        variant="compact"
        icon={UserMinus}
        colorIcon="orange"
        title="Estudiantes en alerta"
        value={15}
        alert=">20% de asistencia"
        alertColor="red"
      />

      <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          hideSearch
          prefix="chart"
          fields={[
            { id: "date_range", label: "Periodo", type: "date-range" },
            { id: "date", label: "Fecha", type: "date" },
            {
              id: "level",
              label: "Nivel educativo",
              options: educationLevels.map((level) => ({
                label: level,
                value: level,
              })),
            },
            {
              id: "section",
              label: "Sección",
              options: sections.map((state) => ({
                label: state,
                value: state,
              })),
            },
            {
              id: "view",
              label: "Vista",
              options: [
                { label: "Comparativa", value: "comparative" },
              ]
            }
          ]}
        />
      </Suspense>

      <ReportChart />
      {/* <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          prefix="table"
          searchPlaceholder="Buscar un estudiante..."
          fields={[
            {
              id: "course",
              label: "Curso",
              options: [
                { label: "3ro Informatica", value: "1" },
                { label: "2do Informatica", value: "2" },
              ],
            },
            {
              id: "level",
              label: "Nivel educativo",
              options: educationLevels.map((level) => ({
                label: level,
                value: level,
              })),
            },
          ]}
        />
      </Suspense> */}
      <ReportTable reportTableStudents={reportTableStudents} setReportTableStudent={setReportTableStudent} isLoading={isLoadingReportTable} />
    </>
  );
}
