import { Filters, FiltersSkeleton } from "@/components/filters";
import UsersTable from "./users-table";
import { Suspense } from "react";
import { roles } from "@/lib/constants/data-type";
import { TableSkeleton } from "@/components/table";

export default function UserPage() {
  return (
    <>
      <Suspense fallback={<FiltersSkeleton />}>
        <Filters
          searchPlaceholder="Buscar un estudiante..."
          fields={[
            {
              id: "role",
              label: "Rango / Rol",
              options: roles.map((role) => ({
                label: role,
                value: role,
              })),
            },
            {
              id: "isActive",
              label: "Estado",
              options: [
                { label: "Activo", value: "true" },
                { label: "Inactivo", value: "false" },
              ],
            },
          ]}
        />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
