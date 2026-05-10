// "use client"

// import { InfoCard } from "@/components/info-card";
// import { Percent, UserMinus, Users } from "lucide-react";
// import { StudentsTable } from "./students-table";
// import { Suspense } from "react";
// import { TableSkeleton } from "@/components/table";
// import { RealtimeDashboard } from "@/components/realtime";
// import { usePolling } from "@/hooks/usePolling";

// export interface Student {
//   id: number;
//   first_name: string;
//   last_name: string;
//   status: "presente" | "atrasado" | "ausente" | "salida";
//   entry_time: string | null;
//   exit_time: string | null;
//   observation: string | null;
// }

// import { useExportStudents } from "@/hooks/Useexportstudents";
// export default function StudentsPage() {

//     const { data: listData, loading} = usePolling<{ students: Student[] }>(
//       "/api/realtime/student-list?course_id=36", 5000
//     );
  
//     const students = listData?.students ?? [];

//   return (
//     <>
//       <InfoCard
//         icon={Users}
//         colorIcon="purple"
//         title="Estudiantes totales"
//         value="15 estudiantes"
//         variant="compact"
//       />
//       <InfoCard
//         icon={UserMinus}
//         colorIcon="orange"
//         title="Estudiantes en alerta"
//         value="5 estudiantes"
//         variant="compact"
//       />
//       <InfoCard
//         icon={Percent}
//         colorIcon="blue"
//         title="Asistencia media"
//         value="92.4%"
//         variant="compact"
//       />


//       <Suspense fallback={<TableSkeleton />}>
//         <StudentsTable data={students} isLoading={loading}/>
//       </Suspense>
//     </>
//   );
// }




"use client"

import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { StudentsTable } from "./students-table";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table";
import { RealtimeDashboard } from "@/components/realtime";
import { usePolling } from "@/hooks/usePolling";
import { useExportStudents } from "@/hooks/Useexportstudents";
import { PDFViewer } from "@react-pdf/renderer";
import { StudentsPdfDocument } from "@/components/Studentspdfdocument ";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  status: "presente" | "atrasado" | "ausente" | "salida";
  entry_time: string | null;
  exit_time: string | null;
  observation: string | null;
}

export default function StudentsPage() {

    const { data: listData, loading} = usePolling<{ students: Student[] }>(
      "/api/realtime/student-list?course_id=36", 5000
    );
  
    const students = listData?.students ?? [];

  const { exportToPdf, exportToExcel, exportingPdf, exportingExcel } =
    useExportStudents(students);

  return (
    <>
    
      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Estudiantes totales"
        value="15 estudiantes"
        variant="compact"
      />
      <InfoCard
        icon={UserMinus}
        colorIcon="orange"
        title="Estudiantes en alerta"
        value="5 estudiantes"
        variant="compact"
      />
      <InfoCard
        icon={Percent}
        colorIcon="blue"
        title="Asistencia media"
        value="92.4%"
        variant="compact"
      />


      <Suspense fallback={<TableSkeleton />}>
        <StudentsTable data={students} isLoading={loading}/>
      </Suspense>

    </>
  );
}

