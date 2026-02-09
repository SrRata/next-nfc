import { CourseCard } from "@/components/course-card";
import { InfoCard, InfoCardSmall } from "@/components/info-card";
import { LinkCard } from "@/components/link-card";
import { Users, Book, ChartBar, UserMinus } from "lucide-react";

export default function HomeTeacher() {
  return (
    <>
      <InfoCard icon={Book} color="blue" title="Mis cursos" value="6 cursos"/>
      <InfoCard icon={Users} color="purple" title="Estudiantes totales" value="120 estudiantes"/>
      <InfoCard icon={ChartBar} color="green" title="% de asistencia hoy" value="92.4%"/>
      <InfoCardSmall icon={ChartBar} color="green" alertColor="green" title="Asistencia media" value="92.4%" alert="+2% vs el mes pasado"/>
      <InfoCardSmall icon={UserMinus} color="orange" title="Total de faltas" value="42" alert="Faltas en el periodo vigente"/>
      <InfoCardSmall icon={ChartBar} color="red" alertColor="red" title="Estudiantes en alerta" value="5" alert="> 20% de asistencias"/>
      <LinkCard href="/" link="Ver listados" title="Gestion de mis alumnos" description="Ver reportes generales/individuales y tags NFC asignados a estudiantes"/>
      <CourseCard active course="1ro de bachillerato informatica - vespertina" subjects="Programacion / Diseño web" students="24 estudiantes registrados"/>
      <CourseCard course="3ro de bachillerato informatica - matutina" subjects="Programacion / Diseño web / Sistemas Operativos" students="35 estudiantes registrados"/>
    </>
  );
}
