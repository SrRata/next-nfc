import { ChevronRight, GraduationCap, Users } from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { Badge, BadgeCircle } from "./ui/badge";
import { InternalLink } from "./ui/link";


interface CourseCardProps {
    course?: string;
    subjects?: string;
    students_number?: string;
    active?: boolean;
}

export function CourseCard({course = 'course', subjects = 'subjects', students_number = 'students_number', active}: CourseCardProps) {
    return (
        <div className="bg-white-primary rounded-primary p-7 flex justify-between flex-col gap-10">
            <div className="flex items-start justify-between">
                <IconShape color="blue" icon={GraduationCap} />
                <Badge color={active ? "green" : "red"}>
                    <BadgeCircle/>
                    {active ? "Activo" : "Inactivo"}
                </Badge>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-black-primary text-2xl font-bold">{course}</h3>
                <p className="text-blue-primary font-bold">{subjects}</p>

                <div className="flex items-center gap-2.5 text-black-secondary font-semibold mt-6">
                    <Users size={18} strokeWidth={2.5}/>
                    {students_number}
                </div>
            </div>
            <InternalLink href="/">
                Selecionar curso
                <ChevronRight size={18} strokeWidth={3}/>
            </InternalLink>
        </div>
    )
}