import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface ObservationProps {
    categorie?: string;
    date?: string;
    observation?: string;
    className?: string;
}

export function Observation({categorie = "categorie", date = "date", observation = "observation", className}: ObservationProps) {
    return (
        <div className={cn("col-span-full bg-white-primary p-7 rounded-primary flex flex-col gap-6", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <Badge color="orange">Conducta</Badge>
                    <p className="text-black-secondary font-medium">24 de mayo de 2025</p>
                </div>
            </div>
            <p className="text-black-primary font-medium">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque quod nesciunt consequatur vero quo suscipit quibusdam. Excepturi, libero! Quibusdam, error expedita. Voluptatibus consequuntur minus nam tenetur tempore, sunt laudantium in?</p>
        </div>
    )
}