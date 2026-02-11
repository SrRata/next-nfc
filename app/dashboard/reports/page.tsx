import { DataUser } from "@/components/data-user";
import { InfoCardSmall } from "@/components/info-card";
import { Table, TableBody, TableHeader, TableTitle, Tbody, Td, Th, Thead, Tr } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Bar } from "@/components/ui/bar";
import { Pagination } from "@/components/ui/pagination";
import { Percent, UserMinus } from "lucide-react";

export default function reportsPage() {
    return (

        <>
        <InfoCardSmall title="Asistencia media" value="92.4%" alert="+2.1% vs el mes pasado" icon={Percent} color="blue" alertColor="green"/>
        <InfoCardSmall title="Total de faltas" value="42" alert="En el periodo seleccionado" icon={UserMinus} color="orange"/>
        <InfoCardSmall title="Estudiantes en alerta" value="5" alert="> 20% de insasistencias" icon={UserMinus} color="red" alertColor="red"/>

        <Table>
            <TableHeader>
                <TableTitle>Resumen por estudiante</TableTitle>    
            </TableHeader>  
            <TableBody>
                <Thead>
                    <Th>Estudiante</Th>
                    <Th>Asistencia</Th>
                    <Th>Faltas</Th>
                    <Th className="text-right w-[150px]">% de asistencia</Th>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td><DataUser name="Luis matailo" id="0150072668"/></Td>
                        <Td><Badge color="green">22</Badge></Td>
                        <Td absences>5</Td>
                        <Td><Bar percentage={85}/></Td>
                    </Tr>
                </Tbody>
            </TableBody>
            <Pagination page={1} allpages={120}/>          
        </Table>

        </>

    )
}
