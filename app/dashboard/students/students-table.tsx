
"use client";

import { Badge } from "@/components/ui/badge";
import { DataUser } from "@/components/data-user";

import { ColumnDef } from "@tanstack/react-table";

import { InternalLink } from "@/components/ui/link";
import { DataTable } from "@/components/data-table";
import { Student } from "./page";
import { useExportStudents } from "@/hooks/Useexportstudents";
import { TriangleAlert, ClipboardCheck, Loader2, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";

interface StudentWithRisk extends Student {
  isAtRisk: boolean;
}

interface Props {
  isLoading: boolean;
  data: StudentWithRisk[];
  tableLegend: string;
}


export function StudentsTable({ data, isLoading, tableLegend }: Props) {

  const { exportToExcel } = useExportStudents(data);
  const router = useRouter();

  const [registering, setRegistering] = useState<Set<number>>(new Set());

  const registerAttendance = async (student: StudentWithRisk) => {
    setRegistering((prev) => new Set(prev).add(student.id));

    const fullName = `${student.first_name} ${student.last_name}`;

    const loadingToast = toast.loading('Registrando asistencia...');


    try {
      const res = await fetch("/api/attendance/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: student.id }),
      });

      if (!res.ok) throw new Error();

      toast.success("Asistencia registrada", {
        id: loadingToast
      });
    } catch {
      toast.error("Error al registrar", {
        id: loadingToast
      });
    } finally {
      setRegistering((prev) => {
        const next = new Set(prev);
        next.delete(student.id);
        return next;
      });
    }
  };

  const columns: ColumnDef<StudentWithRisk>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <div className="flex items-center gap-5">
          <DataUser name={row.original.last_name + " " + row.original.first_name} />
          {row.original.isAtRisk && (
            <Badge color="red">
              <TriangleAlert className="w-3 h-3 mr-1" />
              Riesgo
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          color={
            row.original.status === "presente"
              ? "green"
              : row.original.status === "atrasado"
                ? "yellow"
                : "gray"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: "Entrada",
      cell: ({ row }) => (
        <p>{row.original.entry_time ? row.original.entry_time : "..."}</p>
      ),
    },
    {
      header: "Salida",
      cell: ({ row }) => (
        <p>{row.original.exit_time ? row.original.exit_time : "..."}</p>
      ),
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const student = row.original;
        const isRegistering = registering.has(student.id);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`./history/${student.id}`)} className="font-medium">Ver historial</DropdownMenuItem>

              {!student.entry_time &&
                <DropdownMenuItem onClick={() => registerAttendance(student)} className="font-medium">Marcar Asistencia</DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable legend={tableLegend} columns={columns} data={data} noPagination isLoading={isLoading} buttonCTA="Exportar exel" buttonAction={exportToExcel} />
  );
}