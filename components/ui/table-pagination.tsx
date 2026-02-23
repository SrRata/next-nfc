"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function TablePagination<TData>({
  table,
  className,
}: TablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;

  const { pageIndex, pageSize } = table.getState().pagination;

  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);

  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div
      className={cn(
        "flex items-center justify-between pt-5 pb-2",
        className,
      )}
    >
      <p className="text-black-secondary font-semibold">
        Mostrando {totalRows === 0 ? 0 : start} a {end} de {totalRows} registros
      </p>

      <div className="flex items-center gap-5">
        <ChevronLeft
          onClick={() => canPrevious && table.previousPage()}
          className={cn(
            "text-black-primary transition-opacity",
            canPrevious
              ? "cursor-pointer opacity-100"
              : "opacity-60 cursor-not-allowed",
          )}
          size={20}
          strokeWidth={2.5}
        />

        <ChevronRight
          onClick={() => canNext && table.nextPage()}
          className={cn(
            "text-black-primary transition-opacity",
            canNext
              ? "cursor-pointer opacity-100"
              : "opacity-60 cursor-not-allowed",
          )}
          size={20}
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
}