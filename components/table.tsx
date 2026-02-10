import { Pagination } from "./ui/pagination"

interface TableProps {
    children?: React.ReactNode;
    className?: string; 
}

export function Table({children}: TableProps) {
    return (
        <div className="bg-white-primary rounded-primary p-7 col-span-full flex flex-col gap-5">
            {children}
        </div>
    )
}


export function TableHeader({children}: TableProps){
    return (
        <div className="flex items-center justify-between">
            {children}
        </div>
    )
}


export function TableTitle({children}: TableProps) {
    return (
        <h3 className="text-black-primary text-2xl font-bold">{children}</h3>
    )
}


export function TableBody({children}: TableProps) {
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


export function Thead({children}: TableProps){
    return (
        <thead>
            {children}
        </thead>
    )
}

export function Th({children}: TableProps) {
    return (
        <th className="text-black-secondary font-bold border-black-primary border px-5 py-3 table">
            {children}
        </th>
    )
}

export function Tr({children}: TableProps) {
    return (
        <tr>
            {children}
        </tr>
    )
}


export function Td({children}: TableProps) {
    return (
        <td className="px-5 py-3 border border-black-primary">
            {children}
        </td>
    )
}
