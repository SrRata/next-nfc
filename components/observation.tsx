import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { DataUser } from "./data-user";
import { Calendar } from "lucide-react";

interface ObservationProps {
    categorie?: "conducta" | "asistencia" | "academico" | "positiva" | string;
    date?: string;
    observation?: string;
    name: string;
    section?: string;
    course?: string;
    className?: string;
    autor?: string
}

export function Observation({categorie, date, observation, name, section, course, autor, className}: ObservationProps) {
    return (
        <div className={cn("bg-white-primary p-7 rounded-primary flex flex-col gap-6", className)}>
            <div className="flex items-center justify-between">
                    <DataUser name={name} section={section} course={course}/>
                    <Badge color="orange">Conducta</Badge>
            </div>
            <p className="text-black-primary font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, ex expedita. Eaque fugiat dolore beatae iste vel ullam? Sapiente ipsum iusto nemo porro id accusamus et delectus omnis illo minima. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque quod nesciunt consequatur vero quo suscipit quibusdam. Excepturi, libero! Quibusdam, error expedita. Voluptatibus consequuntur minus nam tenetur tempore, sunt laudantium in?</p>
            <div className="flex items-center justify-between">

                <p className="text-black-secondary font-medium flex items-center gap-2">
                <Calendar className="size-6"/>
                03 mar 2026 
            </p>
            <p className="text-black-secondary font-semibold text-sm">Lic. Cristian Cornejo</p>
            </div>
        </div>
    )
}