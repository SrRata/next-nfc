import { Suspense } from "react";
import { TableSkeleton } from "@/components/table";
import { UsersTable } from "./table";

export default function UserPage() {
  return (
    <>
      <Suspense fallback={<TableSkeleton />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
