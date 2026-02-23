import { cn } from "@/lib/utils";

interface TableContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function TableContainer({
  className,
  ...props
}: TableContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-white-primary rounded-primary col-span-full p-6",
        className
      )}
    />
  );
}

interface TableContainerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

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

interface TableContainerHeaderLegendProps
  extends React.HTMLAttributes<HTMLDivElement> {
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
        <p className="text-black-secondary font-medium">
          {description}
        </p>
      )}
    </div>
  );
}

interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <table
      {...props}
      className={cn("w-full border-collapse", className)}
    />
  );
}

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({
  className,
  ...props
}: TableHeaderProps) {
  return <thead {...props} className={cn(className)} />;
}

interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({
  className,
  ...props
}: TableBodyProps) {
  return <tbody {...props} className={cn(className)} />;
}

interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({
  className,
  ...props
}: TableRowProps) {
  return <tr {...props} className={cn(className)} />;
}


interface TableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}

export function TableHeaderCell({
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  return (
    <th scope="col" {...props}>
      <div
        className={cn(
          "flex items-center justify-start text-black-secondary font-semibold p-6 text-left",
          className
        )}
      >
        {children}
      </div>
    </th>
  );
}

interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({
  className,
  children,
  ...props
}: TableCellProps) {
  return (
    <td {...props}>
      <div
        className={cn(
          "flex items-center justify-start text-black-primary font-medium p-6",
          className
        )}
      >
        {children}
      </div>
    </td>
  );
}