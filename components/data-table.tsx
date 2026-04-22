"use client";

import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerHeader,
  TableContainerHeaderLegend,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSkeleton,
} from "@/components/table";

import { Button } from "./ui/button";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState, // Importamos el tipo para TS
} from "@tanstack/react-table";
import { TablePagination } from "./ui/table-pagination";
import { FileExclamationPoint} from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DataTableProps {
  legend: string;
  buttonCTA?: string;
  buttonAction?: () => void;
  data: any[];
  columns: any[];
  className?: string;
  noPagination?: boolean;
  pageSize?: number;
  isLoading?: boolean;
  linkCTA?: string;
  linkhref?: string
}

export function DataTable({
  legend,
  buttonCTA,
  buttonAction,
  data,
  columns,
  className,
  noPagination = false,
  pageSize = 10,
  isLoading = false,
  linkCTA,
  linkhref = "#",
}: DataTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Esta función solo se dispara cuando el usuario cambia de página
  const handlePageChange = (updater: any) => {
    // 1. Actualizamos el estado interno de la tabla
    setPagination((old) => {
      const nextState = typeof updater === "function" ? updater(old) : updater;
      return nextState;
    });

    // 2. Ejecutamos el scroll al inicio del contenedor
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: handlePageChange, // <--- Solo una vez aquí
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <TableContainer ref={tableContainerRef} className={cn("scroll-mt-10", className)}>
      <TableContainerHeader>
        <TableContainerHeaderLegend title={legend} />
        {buttonCTA && (
          <Button size="lg" variant="outline" onClick={buttonAction}>
            {buttonCTA}
          </Button>
        )}
        {
          linkCTA && (
            <Button variant="outline" className="p-0">
              <Link className="size-full px-6 py-4" href={linkhref}>{linkCTA}</Link>
            </Button>
          )
        }
      </TableContainerHeader>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                <div className="flex flex-col gap-3 items-center justify-center min-h-75 w-full text-center">
                  <IconShape size="lg" icon={FileExclamationPoint} color="red" />
                  <p className="text-xl font-bold normal-case">No se encontraron registros</p>
                  <p className="text-muted-foreground normal-case">
                    Intenta ajustar tus filtros o verificar la existencia de registros.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!noPagination && table.getRowModel().rows.length > 0 && (
        <TablePagination table={table} />
      )}
    </TableContainer>
  );
}
