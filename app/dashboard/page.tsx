import { InfoCard } from "@/components/info-card";
import { LinkCard } from "@/components/link-card";
import { NotificationContainer, NotificationHeader, NotificationItem } from "@/components/notification";
import { Users, Book, ChartArea, ClipboardEdit } from "lucide-react";


export default function HomePage() {
  return (
    <>
    <InfoCard icon={Book} colorIcon="blue" title="Mis cursos" value="6 cursos"/>
    <InfoCard icon={Users} colorIcon="purple" title="Estudiantes totales" value="24 estudiantes"/>
    <InfoCard icon={ChartArea} colorIcon="green" title="Asistencia hoy" value="92.4%"/>
    
    <LinkCard title="Reportes" description="Crea y visualiza reportes de sus estudiantes" href="/" icon={ClipboardEdit}/>

    <NotificationContainer>
      <NotificationHeader title="Actividad reciente en mis cursos" description="Registros recientes de la actividad de sus cursos" href="/" hrefLabel="Ver todo"/>
      <NotificationItem name="Luis Matailo" message="registro una entrada puntutal" createdAt={new Date(Date.now() - 3 * 60 * 1000)} course="3ro de informatica - vespertina" variant="success"/>
      <NotificationItem name="Luis Matailo" message="registro una entrada puntutal" createdAt={new Date()} course="3ro de informatica - vespertina" variant="warning"/>
      <NotificationItem name="Luis Matailo" message="registro una entrada puntutal" createdAt={new Date()} course="3ro de informatica - vespertina" variant="danger"/>
      <NotificationItem name="Luis Matailo" message="registro una entrada puntutal" createdAt={new Date()} course="3ro de informatica - vespertina" variant="info"/>
    </NotificationContainer>

    </>
  );
}
