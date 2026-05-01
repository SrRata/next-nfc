import { Suspense } from "react";
import { CoursesTable } from "./table";
import { FiltersSkeleton } from "@/components/filters";
import { TableSkeleton } from "@/components/table";
import { InfoCard } from "@/components/info-card";
import { Book, BookOpen, School, Text, Users, UserX } from "lucide-react";

export default function CoursesManagementPage() {

  return (
    <>
      <InfoCard
        icon={Users}
        colorIcon="yellow"
        title="Total alumnos"
        value={1240}
        variant="compact"
      />

      <InfoCard
        icon={BookOpen}
        colorIcon="purple"
        title="Total cursos"
        value={34}
        variant="compact"
      />

      <InfoCard
        icon={UserX}
        colorIcon="red"
        title="Cursos sin profesores"
        value={2}
        alert="! Asignar profesores"
        alertColor="red"
        variant="compact"
      />
      <Suspense fallback={<TableSkeleton />}>
        <CoursesTable />
      </Suspense>
    </>
  );
}
