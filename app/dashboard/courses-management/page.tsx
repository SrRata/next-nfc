import { Suspense } from "react";
import { CoursesTable } from "./table";
import { FiltersSkeleton } from "@/components/filters";
import { TableSkeleton } from "@/components/table";
import { FiltersCursesManagement } from "./filters";

export default function CoursesManagementPage() {

  return (
    <>
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersCursesManagement />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <CoursesTable />
      </Suspense>
    </>
  );
}
