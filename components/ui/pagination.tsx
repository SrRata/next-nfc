"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  limitOptions?: number[];
}

export function Pagination({
  page,
  totalPages,
  limit,
  limitOptions = [10, 20, 50],
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`?${params.toString()}`);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    updateParams({
      page: String(newPage),
    });
  };

  const changeLimit = (newLimit: number) => {
    updateParams({
      limit: String(newLimit),
      page: "1", // reset al cambiar cantidad
    });
  };

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="flex items-center justify-between">
      <div className="text-black-secondary font-semibold">
        Página {page} de {totalPages}
      </div>

      <div className="flex items-center gap-6">
        {/* Selector de cantidad */}
        <select
          value={limit}
          onChange={(e) => changeLimit(Number(e.target.value))}
          className="border rounded-md px-2 py-1"
        >
          {limitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} por página
            </option>
          ))}
        </select>

        {/* Navegación */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={isFirstPage}
            className={cn(
              "p-2 rounded-md transition-opacity",
              isFirstPage ? "opacity-40" : "hover:opacity-70"
            )}
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={isLastPage}
            className={cn(
              "p-2 rounded-md transition-opacity",
              isLastPage ? "opacity-40" : "hover:opacity-70"
            )}
            aria-label="Página siguiente"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}