"use client";

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
} from "@/components/table";

import { Button } from "./ui/button";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { TablePagination } from "./ui/table-pagination";

interface DataTableProps {
  legend: string;
  buttonCTA?: string;
  buttonAction?: () => void;
  data: any[];
  columns: any[];
  className?: string
  noPagination?: boolean
  pageSize?: number
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
}: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TableContainer className={className}>
      <TableContainerHeader>
        <TableContainerHeaderLegend title={legend} />
        { buttonCTA ? <Button size="lg" variant="outline" onClick={buttonAction}>{buttonCTA}</Button> : null}
      </TableContainerHeader>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
          {noPagination ? null : <TablePagination table={table} />}
    </TableContainer>
  );
}
