"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { course } from "@/types/courses"
import { educationalLevel } from "@/types/levels"
import { Section } from "@/types/section"
import { professor } from "@/types/users"
import { IconAlertCircle, IconRosetteDiscountCheck, IconTextPlus, IconUserCircle } from "@tabler/icons-react"
import axios from "axios"
import { use, useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
    params: Promise<{
        action: 'create' | 'edit';
        id: string;
    }>; 
}

export default function CourseEditPage({ params }: Props) {

    const { action, id } = use(params);


    // Dialog 
    const [open, setOpen] = useState(false)


    const [sections, setSections] = useState<Section[]>([]);
    const [isLoadingSections, setIsLoadingSections] = useState(true);
    const [educationalLevels, setEducationalLevels] = useState<educationalLevel[]>([]);
    const [isLoadingEducationalLevels, setIsLoadingEducationalLevels] = useState(true);
    const [teachers, setTeachers] = useState<professor[]>([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
    const [courseData, setCourseData] = useState<course | null>(null);

    const [isLoadingCourseData, setIsLoadingCourseData] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState(false);



    async function loadSections() {
        try {
            const response = await axios.get('/api/sections');
            if (response.data.success) {
                setSections(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching sections:', error)
        } finally {
            setIsLoadingSections(false)
        }
    }
    async function loadEducationalLevels() {
        try {
            const response = await axios.get('/api/educational-levels');
            if (response.data.success) {
                setEducationalLevels(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching educational levels:', error)
        } finally {
            setIsLoadingEducationalLevels(false)
        }
    }
    async function loadTeachers() {
        try {
            const response = await axios.get('/api/usersc?role=profesor');
            if (response.data.success) {
                setTeachers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching proffesors:', error)
        } finally {
            setIsLoadingTeachers(false)
        }
    }
    async function loadCourse() {
        try {
            const response = await axios.get('/api/coursesc/' + id);
            if (response.data.success) {
                const data = response.data.data;
                setCourseData(data);
                setFormData({
                    course_name: data.course_name,
                });
                setEducationalLevelId(data.educational_level_id.toString());
                setSectionId(data.section_id.toString());
                if (data.professor_id) {
                    setTeacherId(data.professor_id.toString());
                    setTeacherName(data.professor_name || "");
                }

            }
        } catch (error) {
            console.error('Error fetching course:', error)
        } finally {
            setIsLoadingCourseData(false)
        }
    }

    useEffect(() => {
        loadEducationalLevels();
        loadTeachers();
        loadSections();

        if (action === 'edit' && id) {
            loadCourse();
        }

    }, [action, id]);


    const [educationalLevelId, setEducationalLevelId] = useState<string>("");
    const [sectionId, setSectionId] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [teacherName, setTeacherName] = useState<string>("");

    const [formData, setFormData] = useState({
        course_name: "",
    })

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        // console.log(formData) //DEBUG
    };


    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const loadingToast = toast.loading('Creando curso...');

    //     setProcessing(true)

    //     const payload = {
    //         course_name: formData.course_name,
    //         educational_level_id: educationalLevelId,
    //         section_id: sectionId,
    //         professor_id: teacherId ? teacherId : null,
    //     }

    //     // console.log(payload) //DEBUG

    //     try {
    //         await axios.post('/api/coursesc', payload)
    //         toast.success('Curso creado con exito', {
    //             id: loadingToast,
    //         })
    //     } catch (error) {
    //         console.error('Error create course', error)
    //         toast.error('No se pudo crear el curso', {
    //             id: loadingToast,
    //         })
    //     } finally {
    //         setProcessing(false)
    //     }
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = action === 'edit';
        const loadingToast = toast.loading(isEdit ? 'Actualizando curso...' : 'Creando curso...');
        setProcessing(true);

        const payload = {
            course_name: formData.course_name,
            educational_level_id: educationalLevelId,
            section_id: sectionId,
            professor_id: teacherId || null,
        };

        try {
            if (isEdit) {
                await axios.put(`/api/coursesc/${id}`, payload); // Usar PUT para editar
                toast.success('Curso actualizado con éxito', { id: loadingToast });
            } else {
                await axios.post('/api/coursesc', payload);
                toast.success('Curso creado con éxito', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error al procesar la solicitud', { id: loadingToast });
        } finally {
            setProcessing(false);
        }
    };



    return (
        <>
            <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">

                <form
                    onSubmit={handleSubmit}
                    className="border border-gray-200 bg-white-primary rounded-primary p-6 grid md:col-span-2 row-span-2 grid-cols-2 gap-5">
                    <div className="flex items-center gap-2 col-span-full">
                        <IconTextPlus className="text-blue-primary" />
                        <h5 className="font-bold text-xl text-blue-primary">Detalles del curso</h5>
                    </div>

                    <div className="col-span-full">
                        <Label
                            htmlFor="course_name"
                        >Nombre del curso <span className="text-red-500">*</span></Label>
                        <Input
                            minLength={2}
                            maxLength={255}
                            required
                            placeholder="Ej: Tercero de Bachillerato Informatica"
                            id="course_name"
                            type="text"
                            value={formData.course_name || ""}
                            onChange={handleChangeForm}
                        />

                    </div>

                    <div>
                        <Label>Nivel educativo <span className="text-red-500">*</span></Label>
                        <Select
                            value={educationalLevelId}
                            onValueChange={(value) => {
                                setEducationalLevelId(value)
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un nivel educativo" />
                            </SelectTrigger>
                            <SelectContent>
                                {educationalLevels?.map((e) => (
                                    <SelectItem key={e.id} value={e.id.toString()}>
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Sección <span className="text-red-500">*</span></Label>
                        <Select
                            value={sectionId}
                            onValueChange={(value) => {
                                setSectionId(value)
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una sección" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections?.map((e) => (
                                    <SelectItem key={e.id} value={e.id.toString()}>
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-full">
                        <Label
                            htmlFor="professor_id"
                        >Asignar profesor</Label>

                        <div className="col-span-full p-4 rounded-xl cursor-pointer justify-between mt-6 border border-blue-primary/15 hover:border-blue-primary/25 transition-all duration-300 bg-blue-secondary/40 flex items-center gap-4" onClick={() => setOpen(true)}>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-secondary grid place-items-center size-15 rounded-full">
                                    <IconUserCircle className="text-blue-primary" />
                                </div>
                                <p className="font-bold text-black-primary text-lg">{teacherName ? `Lic. ${teacherName}` : "Selecciona un profesor"}</p>
                            </div>
                            <Badge color="blue">{teacherName ? 'Cambiar' : 'Seleccionar'}</Badge>
                        </div>

                    </div>


                    <div className="flex items-center gap-3 justify-end col-span-full">
                        <Button variant="outline" disabled={processing} type="button">Cancelar</Button>
                        <Button disabled={processing} type="submit"> {processing && <Spinner />} {processing ? 'Registrando...' : 'Registrar curso'}</Button>
                    </div>

                </form>


                <CommandDialog showCloseButton={false} open={open} onOpenChange={setOpen} className="w-full max-w-[400px] p-3 rounded-xl">
                    <Command
                        value={teacherId}
                        onValueChange={(value) => {
                            setTeacherId(value)
                            // console.log(courseId) //DEBUG
                        }}

                    >
                        <CommandInput placeholder="Buscar por nombre..." />
                        <CommandList >
                            <CommandEmpty>Sin resultados.</CommandEmpty>
                            <CommandGroup heading="Sugerencias">
                                {teachers.map((e) => (
                                    <CommandItem key={e.id} value={e.id.toString()} onSelect={() => {
                                        setOpen(false)
                                        setTeacherName(`${e.first_name} ${e.last_name}`)
                                    }} >{e.first_name} {e.last_name}</CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </CommandDialog>


                <div className="bg-blue-primary rounded-primary px-8 py-12 space-y-4">
                    <h5 className="font-bold text-white-primary text-2xl">Consejos rápidos para el registro</h5>
                    <div className="flex gap-3">
                        <IconAlertCircle className="text-white-primary/80 size-20" />
                        <p className="font-medium text-white-primary/80">Los nombres de los cursos deben ser únicos dentro de la misma sección y turno para evitar conflictos de horario.</p>
                    </div>
                    <div className="flex gap-3">
                        <IconRosetteDiscountCheck className="text-white-primary/80 size-17" />
                        <p className="font-medium text-white-primary/80">Los profesores solo aparecen en la lista si tienen un estado activo en el registro del sistema.
                        </p>
                    </div>

                    <div className="mt-9 border border-white-primary/60 rounded-primary p-6 w-full bg-white-primary/20">
                        <p className="text-white-primary/80 italic font-medium">"La precisión del registro es la base de la excelencia institucional"</p>
                    </div>
                </div>
            </div>
        </>
    )
}