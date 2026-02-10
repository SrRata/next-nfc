import { LinkCard } from "@/components/link-card";
import { NotificationContain, NotificationHeader, Notification } from "@/components/notification";
import { AlertTriangle, Check } from "lucide-react";

export default function HomeAdmin() {
    return (
        <>
        <div className="col-span-full">
            <h2 className="text-black-primary text-2xl font-bold">Accesos directos</h2>
            <p className="text-black-secondary font-semibold">Seleccione una de las siguientes opciones para gestionar el sistema</p>
        </div>

        <LinkCard href="/" title="Gestión de estudiantes" description="Administre el registro de nuevos estudiantes, edicion de perfiles y asignacion de tags NFC."/>
        <LinkCard href="/" title="Historial de asistencia" description="Consulte los registros historicos de entradas y salidas de todos los estudiantes."/>
        

        <NotificationContain>
            <NotificationHeader title="Actividad reciente"/>
            <Notification icon={Check} color="green" name="Justin Alvarez" notification="registro entrada puntual." course="3ro Informática - Vespertina" time="12:00 PM"/>
            <Notification icon={AlertTriangle} color="red" name="Braulio Guamaña" notification="registro entrada atrasada." course="3ro Informática - Vespertina" time="12:20 PM"/>
        </NotificationContain>
        </>
     
    )
}