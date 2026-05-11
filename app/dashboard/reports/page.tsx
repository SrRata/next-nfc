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
import { ReportChartAttendanceStatus } from "./attendance-chart";
import { ReportChartComparative } from "./comparative-chart";


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


  interface RiskStudent {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    total_absences: number;
  }


  interface RiskResponse {
    total_at_risk: number;
    students: RiskStudent[];
  }

  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [totalRiskStudents, setTotalRiskStudents] = useState(0);
  const [loadingRisk, setLoadingRisk] = useState(false);


  const getRiskStudents = async () => {
    try {
      setLoadingRisk(true);
      const response = await axios.get<RiskResponse>(
        `/api/metrics/students-risk?`
      );

      setRiskStudents(response.data.students);

      setTotalRiskStudents(
        response.data.total_at_risk
      );
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingRisk(false);
    }
  }


    useEffect(() => {
      // if (!course?.id) return;
  
      getRiskStudents();
    }, []);
    // }, [course?.id]);

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


  const totalAsist = reportTableStudents.reduce((acc, s) => acc + s.assists, 0);
  const totalAbsents = reportTableStudents.reduce((acc, s) => acc + s.absences, 0);

  const percentGlobalAsist =
    (totalAsist / (totalAsist + totalAbsents)) * 100;

  return (
    <>
      <InfoCard
        variant="compact"
        icon={Percent}
        colorIcon="blue"
        title="Asistencia media"
        value={percentGlobalAsist ? percentGlobalAsist.toFixed(0) + "%" : "--"}
        alert="En el periodo lectivo actual"
      />
      <InfoCard
        variant="compact"
        icon={Users}
        colorIcon="red"
        title="Total faltas"
        value={totalAbsents ? totalAbsents : "--"}
        alert="En el periodo lectivo actual"
      />
      <InfoCard
        variant="compact"
        icon={UserMinus}
        colorIcon="orange"
        title="Estudiantes en alerta"
        value={totalRiskStudents ? totalRiskStudents : "--"}
        alert=">10 faltas"
        alertColor="red"
      />


      <ReportChart endpoint={user.role ==='admin' ? '/api/charts/weekly-attendance' : `/api/charts/weekly-attendance?professor_id=${user.id}`} />
      <ReportChartAttendanceStatus endpoint={user.role ==='admin' ? '/api/charts/attendance-status' : `/api/charts/attendance-status?professor_id=${user.id}`} />

      {
        user.role === "admin" && <ReportChartComparative />
      }

      <ReportTable reportTableStudents={reportTableStudents} setReportTableStudent={setReportTableStudent} isLoading={isLoadingReportTable} />
    </>
  );
}
