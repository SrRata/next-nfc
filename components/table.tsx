"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Pagination } from "./ui/pagination";


/* ============================================================
   Base Types
============================================================ */

interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

/* ============================================================
   Root
============================================================ */

function Root({ children, className }: BaseProps) {
  return (
    <div
      className={cn(
        "bg-white-primary rounded-primary p-6 flex flex-col gap-6 col-span-full",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Header
============================================================ */

function Header({ children, className }: BaseProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

function Title({ children, className }: BaseProps) {
  return (
    <h3
      className={cn(
        "text-xl font-bold text-black-primary",
        className
      )}
    >
      {children}
    </h3>
  );
}

/* ============================================================
   Table Structure
============================================================ */

function Content({ children, className }: BaseProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse",
          className
        )}
      >
        {children}
      </table>
    </div>
  );
}

function Thead({ children, className }: BaseProps) {
  return (
    <thead
      className={cn(
        "border-b border-gray-200",
        className
      )}
    >
      {children}
    </thead>
  );
}

function Tbody({ children, className }: BaseProps) {
  return (
    <tbody
      className={cn(
        "divide-y divide-gray-100",
        className
      )}
    >
      {children}
    </tbody>
  );
}

function Tr({ children, className }: BaseProps) {
  return (
    <tr
      className={cn(
        "hover:bg-gray-50 transition-colors",
        className
      )}
    >
      {children}
    </tr>
  );
}

function Th({ children, className }: BaseProps) {
  return (
    <th
      className={cn(
        "text-left p-4 font-bold text-black-secondary",
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: BaseProps) {
  return (
    <td
      className={cn(
        "p-4 font-medium text-black-primary",
        className
      )}
    >
      {children}
    </td>
  );
}

/* ============================================================
   Empty State
============================================================ */

function Empty({
  colSpan,
  message = "No hay resultados",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="text-center p-6 text-gray-400"
      >
        {message}
      </td>
    </tr>
  );
}

/* ============================================================
   Pagination Wrapper
============================================================ */

interface TablePaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  limitOptions?: number[];
  onPageChange: (page: number) => void
}

function TablePagination(props: TablePaginationProps) {
  return <Pagination {...props} />;
}

/* ============================================================
   Export Compound Component
============================================================ */

export const Table = Object.assign(Root, {
  Header,
  Title,
  Content,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Empty,
  Pagination: TablePagination,
});