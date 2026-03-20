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
  TableSkeleton,
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
import { FileExclamationPoint } from "lucide-react";
import { IconShape } from "./ui/icon-shape";

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
}

// export function DataTable({
//   legend,
//   buttonCTA,
//   buttonAction,
//   data,
//   columns,
//   className,
//   noPagination = false,
//   pageSize = 10,
//   isLoading = false,
// }: DataTableProps) {
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: pageSize,
//   });

//   const table = useReactTable({
//     data,
//     columns,
//     state: { pagination },
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <TableContainer className={className}>
//       <TableContainerHeader>
//         <TableContainerHeaderLegend title={legend} />
//         {buttonCTA && (
//           <Button size="lg" variant="outline" onClick={buttonAction}>
//             {buttonCTA}
//           </Button>
//         )}
//       </TableContainerHeader>
//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHeaderCell key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext(),
//                   )}
//                 </TableHeaderCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>

//         <TableBody>
//           {/* {table.getRowModel().rows?.length > 0 ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="p-0">
//                 <div className="flex flex-col items-center justify-center min-h-75 w-full text-center">
//                   {isLoading ? (
//                     <span className="animate-pulse rounded-primary bg-gray-200 w-full min-h-75">
//                     </span>
//                   ) : (
//                     <div className="flex flex-col gap-3 items-center">
//                       <IconShape size="lg" icon={FileExclamationPoint} color="red"/>
//                       <p className="text-xl font-bold">
//                         No se encontraron registros
//                       </p>
//                       <p className="text-muted-foreground">
//                         Intenta ajustar tus filtros o verificar la existencia de registros.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </TableCell>
//             </TableRow>
//           )} */}

//           {/* 1. Prioridad: Si está cargando, mostramos el Skeleton/Loader */}
//           {isLoading ? (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="p-0">
//                 <div className="flex items-center justify-center min-h-75 w-full">
//                   <div className="animate-pulse flex flex-col items-center gap-4 w-full p-10">
//                     <div className="h-10 w-10 bg-blue-primary/20 rounded-full animate-spin border-4 border-t-blue-primary" />
//                     <p className="text-blue-primary font-medium">Cargando datos...</p>
//                   </div>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ) : table.getRowModel().rows?.length > 0 ? (
//             /* 2. Si NO está cargando y HAY datos, mapeamos las filas */
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             /* 3. Si NO está cargando y NO hay datos, mostramos el Empty State */
//             <TableRow>
//               <TableCell colSpan={columns.length} className="p-0">
//                 <div className="flex flex-col gap-3 items-center justify-center min-h-75 w-full text-center">
//                   <IconShape size="lg" icon={FileExclamationPoint} color="red" />
//                   <p className="text-xl font-bold">No se encontraron registros</p>
//                   <p className="text-muted-foreground">
//                     Intenta ajustar tus filtros o verificar la existencia de registros.
//                   </p>
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}

//         </TableBody>
//       </Table>
//       {!noPagination && table.getRowModel().rows.length > 0 && (
//         <TablePagination table={table} />
//       )}
//     </TableContainer>
//   );
// }

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
}: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // 1. Si está cargando, retornamos el Skeleton completo y cortamos la ejecución aquí
  if (isLoading) {
    return <TableSkeleton />;
  }

  // 2. Si no está cargando, retornamos la tabla normal
  return (
    <TableContainer className={className}>
      <TableContainerHeader>
        <TableContainerHeaderLegend title={legend} />
        {buttonCTA && (
          <Button size="lg" variant="outline" onClick={buttonAction}>
            {buttonCTA}
          </Button>
        )}
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
                  <p className="text-xl font-bold">No se encontraron registros</p>
                  <p className="text-muted-foreground">
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
