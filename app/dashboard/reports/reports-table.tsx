"use client"

import { useMemo, useState } from "react"
import { InfoCard } from "@/components/info-card"
import { Table } from "@/components/table"
import { Percent, UserMinus, Users } from "lucide-react"

export interface Student {
  id: string
  name: string
  email: string
  absences: number
  level: "basica_elemental" | "basica_media" | "basica_superior" | "bachillerato"
  shift: "morning" | "afternoon"
}

export const students: Student[] = [
  { id: "1", name: "Juan Pérez", email: "juan.perez@school.edu", absences: 2, level: "basica_media", shift: "morning" },
  { id: "2", name: "María González", email: "maria.gonzalez@school.edu", absences: 6, level: "bachillerato", shift: "afternoon" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos.rodriguez@school.edu", absences: 1, level: "basica_superior", shift: "morning" },
  { id: "4", name: "Ana Torres", email: "ana.torres@school.edu", absences: 8, level: "basica_elemental", shift: "morning" },
  { id: "5", name: "Luis Herrera", email: "luis.herrera@school.edu", absences: 0, level: "bachillerato", shift: "afternoon" },
  { id: "6", name: "Valentina Cruz", email: "valentina.cruz@school.edu", absences: 3, level: "basica_media", shift: "morning" },
  { id: "7", name: "Diego Morales", email: "diego.morales@school.edu", absences: 5, level: "basica_superior", shift: "afternoon" },
  { id: "8", name: "Sofía Ramos", email: "sofia.ramos@school.edu", absences: 4, level: "basica_elemental", shift: "morning" },
  { id: "9", name: "Mateo Sánchez", email: "mateo.sanchez@school.edu", absences: 7, level: "bachillerato", shift: "afternoon" },
  { id: "10", name: "Camila López", email: "camila.lopez@school.edu", absences: 2, level: "basica_media", shift: "morning" },
  { id: "11", name: "Andrés Castillo", email: "andres.castillo@school.edu", absences: 9, level: "basica_superior", shift: "afternoon" },
  { id: "12", name: "Isabella Mendoza", email: "isabella.mendoza@school.edu", absences: 1, level: "bachillerato", shift: "morning" },
]

export default function ReportsTable() {
  const [page, setPage] = useState(1)
  const limit = 5

  const totalItems = students.length
  const totalPages = Math.ceil(totalItems / limit)

  // Simulación backend (skip + limit)
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * limit
    return students.slice(start, start + limit)
  }, [page])

  return (


      <Table>
        <Table.Header>
          <Table.Title>Estudiantes</Table.Title>
        </Table.Header>

        <Table.Content>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Faltas</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginatedStudents.length === 0 ? (
              <Table.Empty colSpan={3} />
            ) : (
              paginatedStudents.map((student) => (
                <Table.Tr key={student.id}>
                  <Table.Td>{student.name}</Table.Td>
                  <Table.Td>{student.email}</Table.Td>
                  <Table.Td
                    className={
                      student.absences >= 5
                        ? "text-red-500 font-semibold"
                        : ""
                    }
                  >
                    {student.absences}
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table.Content>

        <Table.Pagination
          page={page}
          totalPages={totalPages}
          limit={limit}
          onPageChange={setPage}
        />
      </Table>
  )
}