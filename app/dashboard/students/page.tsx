import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users } from "lucide-react";

export default function StudentsPage() {
    return (
        <>
        
        <InfoCard icon={Users} colorIcon="purple" title="Estudiantes totales" value="15 estudiantes"/>
        <InfoCard icon={UserMinus} colorIcon="orange" title="Estudiantes en alerta" value="5 estudiantes"/>
        <InfoCard icon={Percent} colorIcon="blue" title="Asistencia media" value="92.4%"/>

        </>
    )
}