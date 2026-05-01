import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconAlertCircle, IconRosetteDiscountCheck, IconTextPlus } from "@tabler/icons-react"

export default function CourseEditPage() {
    return (
        <>
            <h4 className="col-span-full">Registrar un nuevo curso</h4>
            <p className="col-span-full">Complete el siguiente formulario para crear un nuevo curso académico. Asegúrese de que todos los datos administrativos sean correctos para la inscripción de estudiantes y la programación del profesorado.</p>
            <form className="border border-gray-200 bg-white-primary rounded-primary p-6 grid md:col-span-2 row-span-2 grid-cols-2 gap-5">
                <div className="flex items-center gap-2 col-span-full">
                    <IconTextPlus />
                    <h5>Detalles del curso</h5>
                </div>

                <div className="col-span-full">
                    <Label
                        htmlFor="course_name"
                    >Nombre del estudiante</Label>
                    <Input
                        minLength={2}
                        maxLength={255}
                        required
                        placeholder="Nombres completos"
                        id="course_name"
                        type="text"
                    // value={formDataStudent.studentFirstName || ""}
                    // onChange={handleChangeStudent}
                    />

                </div>

                <div>
                    <Label>Nivel educativo</Label>
                    <Select
                    // value={courseId}
                    // onValueChange={(value) => {
                    //     setCourseId(value)
                    //     // console.log(courseId) //DEBUG
                    // }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* {courses?.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {c.course_name}
                                </SelectItem>
                            ))} */}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Sección <span className="text-red-500">*</span></Label>
                    <Select
                    // value={courseId}
                    // onValueChange={(value) => {
                    //     setCourseId(value)
                    //     // console.log(courseId) //DEBUG
                    // }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* {courses?.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {c.course_name}
                                </SelectItem>
                            ))} */}
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-full">
                    <Label
                        htmlFor="professor_id"
                    >Asignar profesor</Label>
                    <Input
                        minLength={2}
                        maxLength={255}
                        required
                        placeholder="Buscar profesor por nombre o ID ..."
                        id="professor_id"
                        type="text"
                    // value={formDataStudent.studentFirstName || ""}
                    // onChange={handleChangeStudent}
                    />

                </div>

            </form>


            <div className="bg-blue-primary rounded-primary p-6">
                <h5>Consejos rápidos para el registro</h5>
                <div className="flex gap-1">
                    <IconAlertCircle />
                    <p>Los nombres de los cursos deben ser únicos dentro de la misma sección y turno para evitar conflictos de horario.</p>
                </div>
                <div className="flex gap-1">
                    <IconRosetteDiscountCheck />
                    <p>Los profesores solo aparecen en la lista si tienen un estado activo en el registro del sistema.
                    </p>
                </div>

                <div>
                    <p>"La precisión del registro es la base de la excelencia institucional"</p>
                </div>
            </div>
        </>
    )
}