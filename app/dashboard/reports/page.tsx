// import { InfoCard } from "@/components/info-card";
// import { Percent, UserMinus, Users } from "lucide-react";
// import { ReportChart } from "./report-chart";
// import { ReportTable } from "./reports-table";
// import { Suspense } from "react";
// import { Filters, FiltersSkeleton } from "@/components/filters";
// import {
//   educationLevels,
//   sections,
//   studentStates,
// } from "@/lib/constants/data-type";

// export default function reportsPage() {
//   return (
//     <>
//       <InfoCard
//         variant="compact"
//         icon={Percent}
//         colorIcon="blue"
//         title="Asistencia media"
//         value="92.4%"
//         alert="+2.1% vs al mes anterior"
//         alertColor="green"
//       />
//       <InfoCard
//         variant="compact"
//         icon={Users}
//         colorIcon="red"
//         title="Total faltas"
//         value={42}
//         alert="En el periodo lectivo actual"
//       />
//       <InfoCard
//         variant="compact"
//         icon={UserMinus}
//         colorIcon="orange"
//         title="Estudiantes en alerta"
//         value={15}
//         alert=">20% de asistencia"
//         alertColor="red"
//       />

//       <Suspense fallback={<FiltersSkeleton />}>
//         <Filters
//           hideSearch
//           prefix="chart"
//           fields={[
//             { id: "date_range", label: "Periodo", type: "date-range" },
//             { id: "date", label: "Fecha", type: "date" },
//             {
//               id: "level",
//               label: "Nivel educativo",
//               options: educationLevels.map((level) => ({
//                 label: level,
//                 value: level,
//               })),
//             },
//             {
//               id: "section",
//               label: "Sección",
//               options: sections.map((state) => ({
//                 label: state,
//                 value: state,
//               })),
//             },
//                         {
//               id: "view",
//               label: "Vista",
//               options: [
//                 {label: "Comparativa", value: "comparative"},
//               ]
//             }
//           ]}
//         />
//       </Suspense>

//       <ReportChart />
//       <Suspense fallback={<FiltersSkeleton />}>
//         <Filters
//           prefix="table"
//           searchPlaceholder="Buscar un estudiante..."
//           fields={[
//             {
//               id: "course",
//               label: "Curso",
//               options: [
//                 { label: "3ro Informatica", value: "1" },
//                 { label: "2do Informatica", value: "2" },
//               ],
//             },
//             {
//               id: "level",
//               label: "Nivel educativo",
//               options: educationLevels.map((level) => ({
//                 label: level,
//                 value: level,
//               })),
//             },
//           ]}
//         />
//       </Suspense>
//       <ReportTable />
//     </>
//   );
// }





"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAttendanceSummary } from "@/hooks/Useattendancesummary";
import { DateRangeFilter } from "@/components/reports/Daterangefilter";
import { AttendanceSkeleton } from "@/components/reports/Attendanceskeleton";
import { isUsuarioResponse } from "@/types/attendance";
import { ChildCard } from "@/components/reports/Childcard ";
import { AdminProfesorPanel } from "@/components/reports/AdminProfesorPanel";

function currentMonthRange() {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return {
    from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export default function AttendanceSummaryPage() {
  const { from, to } = currentMonthRange();
  const [dateFrom, setDateFrom] = useState(from);
  const [dateTo, setDateTo] = useState(to);

  const { data, loading, error, refetch } = useAttendanceSummary({
    dateFrom,
    dateTo,
  });

  const handleDateChange = (f: string, t: string) => {
    setDateFrom(f);
    setDateTo(t);
  };

  return (
    <div className="container col-span-full max-w-5xl py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Resumen de asistencia
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Estadísticas del período seleccionado
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={loading}
          className="gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <DateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChange={handleDateChange}
      />

      <Separator />

      {/* Error
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar datos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      {/* Loading */}
      {loading && <AttendanceSkeleton />}

      {/* Content */}
      {!loading && !error && data && (
        <>
          {isUsuarioResponse(data) ? (
            <div className="space-y-5">
              {data.children.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-12">
                  No se encontraron estudiantes vinculados.
                </p>
              ) : (
                data.children.map((child) => (
                  <ChildCard key={child.student.id} child={child} />
                ))
              )}
            </div>
          ) : (
            <AdminProfesorPanel data={data} />
          )}
        </>
      )}
    </div>
  );
}
