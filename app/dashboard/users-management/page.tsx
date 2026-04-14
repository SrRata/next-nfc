import { Filters, FiltersSkeleton } from "@/components/filters";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table";
import { FiltersUsersManagement } from "./filters";
import { UsersTable } from "./table";

export default function UserPage() {
  return (
    <>
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersUsersManagement />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
