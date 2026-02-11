import { DataUser } from "@/components/data-user";
import { Table, TableBody, TableTitle, Tbody, Td, Th, Thead, Tr } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

export default function HistoryAdmin() {
    return (
        <Table>
            <TableTitle>Historial de registros</TableTitle>
            <TableBody>
                <Thead>
                    <Th>Estudiante</Th>
                    <Th>Curso/Paralelo</Th>
                    <Th>Fecha</Th>
                    <Th>Entrada</Th>
                    <Th>Salida</Th>
                    <Th className="text-right">Observación</Th>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>
                            <DataUser name="Luis Matailo" id="0150072668"/>
                        </Td>
                        <Td>3ro de bachillerato - Informática</Td>
                        <Td>12 Febrero 2026</Td> 
                        <Td><Badge color="green">12:00 PM</Badge></Td>
                        <Td><Badge color="orange">18:30 PM</Badge></Td>
                        <Td>
                            <div className="flex justify-end">
                                <Badge color="blue">Puntual</Badge>
                            </div>
                        </Td>
                    </Tr>
                </Tbody>
            </TableBody>
            <Pagination page={1} allpages={250}/>
        </Table>
    )
}