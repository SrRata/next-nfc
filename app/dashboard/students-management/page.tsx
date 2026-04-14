import { Suspense } from "react";
import { FiltersSkeleton } from "../../../components/filters";
import { TableSkeleton } from "@/components/table";
import TableStudentsManagement from "./table";
import { FiltersStudentsManagement } from "./filters";

export default function StudentsPage() {
  return (
    <>
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersStudentsManagement />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <TableStudentsManagement />
      </Suspense>

    </>
  );
}
