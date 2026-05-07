import { Suspense } from "react";
import { FiltersSkeleton } from "../../../components/filters";
import { TableSkeleton } from "@/components/table";
import TableStudentsManagement from "./table";
import { Users, UserX } from "lucide-react";
import { InfoCard } from "@/components/info-card";

export default function StudentsPage() {
  return (
    <>

      <InfoCard
        icon={Users}
        colorIcon="yellow"
        title="Total alumnos"
        value={0}
        variant="compact"
      />

      <InfoCard
        icon={Users}
        colorIcon="red"
        title="Alumnos sin representante"
        value={0}
        variant="compact"
      />

      <Suspense fallback={<TableSkeleton />}>
        <TableStudentsManagement />
      </Suspense>

    </>
  );
}
