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

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataUser } from "@/components/data-user";
import { ProgressBar } from "@/components/ui/bar";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import data from "./data.json";
import { TablePagination } from "@/components/ui/table-pagination";

export type Report = {
  id: string;
  name: string;
  course: string;
  section: string;
  assists: number;
  absences: number;
};

export function ReportTable() {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <DataUser name={row.original.name} id={row.original.id} />
      ),
    },
    {
      accessorKey: "course",
      header: "Curso",
    },
    {
      accessorKey: "assists",
      header: "Asistencias",
      cell: ({ row }) => <Badge color="green">{row.original.assists}</Badge>,
    },
    {
      accessorKey: "absences",
      header: "Faltas",
      cell: ({ row }) => <Badge color="red">{row.original.absences}</Badge>,
    },
    {
      header: "% de asistencias",
      cell: ({ row }) => {
        const total = row.original.assists + row.original.absences;

        const percentage =
          total > 0 ? ((row.original.assists / total) * 100).toFixed(0) : 0;
        return (
          <ProgressBar
            value={percentage}
            showLabel={true}
            className="max-w-[150px]"
          />
        );
      },
    },
  ];

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
    <TableContainer>
      <TableContainerHeader>
        <TableContainerHeaderLegend title="Resumen por estudiante" />
        <Button>Exportar PDF</Button>
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
                <TableCell>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination table={table}/>
    </TableContainer>
  );
}
