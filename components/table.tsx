import { cn } from "@/lib/utils";

// interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

// export function TableContainer({ className, ...props }: TableContainerProps) {
//   return (
//     <div
//       {...props}
//       className={cn(
//         "bg-white-primary rounded-primary col-span-full p-6",
//         className,
//       )}
//     />
//   );
// }


import React, { forwardRef } from "react"; // 1. Importa forwardRef

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

// 2. Envolvemos la función con forwardRef
export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref} // 3. ¡Importante! Asignamos la ref al div
        {...props}
        className={cn(
          "bg-white-primary rounded-primary col-span-full p-6 border border-gray-200",
          className,
        )}
      />
    );
  }
);

// 4. (Opcional pero recomendado) Asigna un nombre para debugging
TableContainer.displayName = "TableContainer";



interface TableContainerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TableContainerHeader({
  className,
  ...props
}: TableContainerHeaderProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-between pb-6", className)}
    />
  );
}

interface TableContainerHeaderLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function TableContainerHeaderLegend({
  title,
  description,
  className,
  ...props
}: TableContainerHeaderLegendProps) {
  return (
    <div {...props} className={cn(className)}>
      <h3 className="text-black-primary font-bold text-xl">{title}</h3>
      {description && (
        <p className="text-black-secondary font-medium">{description}</p>
      )}
    </div>
  );
}

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <table {...props} className={cn("w-full border-collapse", className)} />
  );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead {...props} className={cn(className)} />;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody {...props} className={cn(className)} />;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr {...props} className={cn(className)} />;
}

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}

export function TableHeaderCell({
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  return (
    <th scope="col" {...props} className="last:[&>div]:justify-end">
      <div
        className={cn(
          "flex items-center justify-start text-black-secondary font-semibold p-6 text-left",
          className,
        )}
      >
        {children}
      </div>
    </th>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td {...props} className="last:[&>div]:justify-end">
      <div
        className={cn(
          "flex items-center justify-start text-black-primary font-medium p-6",
          className,
        )}
      >
        {children}
      </div>
    </td>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse col-span-full rounded-primary p-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="bg-gray-300 w-100 h-8 rounded-primary"></div>
        <div className="bg-gray-300 w-40 h-8 rounded-primary"></div>
      </div>
      <div className="grid grid-cols-5 gap-6 ">
        <div className="bg-gray-300 w-45 h-8 rounded-primary"></div>
        <div className="bg-gray-300 w-55 h-8 rounded-primary"></div>
        <div className="bg-gray-300 w-60 h-8 rounded-primary"></div>
        <div className="bg-gray-300 w-55 h-8 rounded-primary"></div>
        <div className="bg-gray-300 w-70 h-8 rounded-primary"></div>


        <div className="bg-gray-300 col-span-full h-80 rounded-primary"></div>

      </div>
      <div className="flex items-center justify-between">
        <div className="bg-gray-300 w-70 h-8 rounded-primary"></div>
        <div className="flex items-center gap-3">
        <div className="bg-gray-300 w-10 h-8 rounded-primary"></div>
        <div className="bg-gray-300 w-10 h-8 rounded-primary"></div>
        </div>
      </div>
    </div>
  );
}
