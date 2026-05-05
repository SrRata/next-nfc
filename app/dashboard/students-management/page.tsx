import { Suspense } from "react";
import { FiltersSkeleton } from "../../../components/filters";
import { TableSkeleton } from "@/components/table";
import TableStudentsManagement from "./table";

export default function StudentsPage() {
  return (
    <>
      <Suspense fallback={<TableSkeleton />}>
        <TableStudentsManagement />
      </Suspense>

    </>
  );
}
