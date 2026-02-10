import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    allpages?: number;
    page?: number;

}


export function Pagination({allpages, page}: PaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-black-secondary font-semibold">
                Página {page} de {allpages} paginas.
            </div>
            <div className="flex items-center gap-10">
                <ChevronLeft className={`${page === 1 ? "text-black-secondary" : "text-black-primary"} cursor-pointer`} size={20} strokeWidth={2.5}/>
                <ChevronRight className={`${page === allpages ? "text-black-secondary" : "text-black-primary"} cursor-pointer`} size={20} strokeWidth={2.5}/>
            </div>
        </div>
    )
}