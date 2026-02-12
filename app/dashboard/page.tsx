import { CourseCard } from "@/components/course-card";
import { DataUser } from "@/components/data-user";
import { InfoCard, InfoCardSmall } from "@/components/info-card";
import { LinkCard } from "@/components/link-card";
import { Notification, NotificationContain, NotificationHeader } from "@/components/notification";
import { Observation } from "@/components/observation";
import { Table, TableBody, TableHeader, TableTitle, Tbody, Td, Th, Thead, Tr } from "@/components/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge, BadgeCircle } from "@/components/ui/badge";
import { Bar } from "@/components/ui/bar";
import { InternalLink } from "@/components/ui/link";
import { Pagination } from "@/components/ui/pagination";
import { Users, Book, ChartBar, UserMinus, ChevronRight, ExternalLink, Check } from "lucide-react";

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
      <NotificationContain>
        <NotificationHeader/>
        <Notification icon={Check}/>
      </NotificationContain>

      <Table>

        <TableHeader>
          <TableTitle>Registros encontrados</TableTitle>
        </TableHeader>

        <TableBody>
          <Thead>
            <Th>Foto</Th>
            <Th>Nombre completo</Th>
            <Th>Matricula/ID</Th>
            <Th>Asistencia hoy</Th>
            <Th className="text-right">Acciones</Th>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <DataUser name="Luis matailo"/>
              </Td>
              <Td>Luis Matailo</Td>
              <Td><Badge>0150072668</Badge></Td>
              <Td><Badge color="green"><BadgeCircle/>Presente</Badge></Td>
              <Td><InternalLink href="/" className="flex justify-end">
                Ver historial
                <ExternalLink size={15} strokeWidth={2.5}/>
              </InternalLink></Td>
            </Tr>
            <Tr>
              <Td>
              </Td>
              <Td><Badge color="green">22</Badge></Td>
              <Td absences>0</Td>
              <Td absences>15</Td>
              <Td>
                <Bar percentage={75}/>
              </Td>
            </Tr>
          </Tbody>
        </TableBody>

        <Pagination allpages={20} page={1}/>
        

      </Table>

      <Observation/>
    </>
  );
}
