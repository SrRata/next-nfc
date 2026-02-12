import { DataUser } from "@/components/data-user";
import { Table, TableBody, TableHeader, TableTitle, Tbody, Td, Th, Thead, Tr } from "@/components/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge, BadgeCircle } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Pen, Trash } from "lucide-react";

export default function studentsPage() {
    return (
        <>
        
        <Table>

            <TableHeader>
                <TableTitle>Gestión de estudiantes</TableTitle>
            </TableHeader>

            <TableBody>
                <Thead>
                    <Th>Nombre</Th>
                    <Th>Curso</Th>
                    <Th>Paralelo</Th>
                    <Th>Estado</Th>
                    <Th className="text-right">Acciones</Th>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>
                            <DataUser name="Justin Alvarez" id="0150072668"/>
                        </Td>
                        <Td>3ro de Bachillerato Informática</Td>
                        <Td>A</Td>
                        <Td><Badge color="green"><BadgeCircle/>Activo</Badge></Td> 
                        <Td>
                            <div className="flex items-center gap-8 justify-end">
                                <Pen className="text-black-secondary cursor-pointer" size={20} strokeWidth={2}/>
                                <Trash className="text-black-secondary cursor-pointer" size={20} strokeWidth={2}/>
                            </div>    
                        </Td> 
                    </Tr>
                    
                </Tbody>
            </TableBody>

            <Pagination allpages={10} page={1}/>

        </Table>
        
        </>
    )
}