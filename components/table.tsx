import { cn } from "@/lib/utils";
import { Pagination } from "./ui/pagination"

interface TableProps {
    children?: React.ReactNode;
    className?: string; 
}

export function Table({children, className}: TableProps) {
    return (
        <div className={cn("bg-white-primary rounded-primary p-7 col-span-full flex flex-col gap-5", className)}>
            {children}
        </div>
    )
}


export function TableHeader({children, className}: TableProps){
    return (
        <div className={cn("flex items-center justify-between", className)}>
            {children}
        </div>
    )
}


export function TableTitle({children, className}: TableProps) {
    return (
        <h3 className="text-black-primary text-2xl font-bold">{children}</h3>
    )
}


export function TableBody({children, className}: TableProps) {
    return (
        <table>
            {children}
        </table>
    )
}

interface TableFooterProps {
    allpages?: number;
    page?: number;
}

export function TableFooter({allpages, page}: TableFooterProps) {
    return (
        <Pagination allpages={allpages} page={page}/>
    )
}


export function Thead({children, className}: TableProps){
    return (
        <thead>
            {children}
        </thead>
    )
}

export function Tbody({children, className}: TableProps) {
    return (
        <tbody>
            {children}
        </tbody>
    )
}

export function Th({children, className}: TableProps) {
    return (
        <th className={cn("text-black-secondary font-bold p-5 text-left w-fit", className)}>
            {children}
        </th>
    )
}

export function Tr({children, className}: TableProps) {
    return (
        <tr className={cn(className)}>
            {children}
        </tr>
    )
}

interface TdProps {
    children?: React.ReactNode;
    className?: string;
    name?: boolean;
    absences?: boolean;
}

function addColorAbsences(value: React.ReactNode) {
    const num = Number(value);

    if (isNaN(num)) return "text-black-primary";

    return num >= 5 
        ? "text-red-primary"
        : "text-black-primary";
}


export function Td({ children, className, name, absences }: TdProps) {
    return (
        <td className={cn("p-5 font-semibold", className, { "font-bold": name }, absences && addColorAbsences(children))}>
            {children}
        </td>
    );
}
 




