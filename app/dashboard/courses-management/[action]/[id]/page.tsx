// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Spinner } from "@/components/ui/spinner"
// import { course } from "@/types/courses"
// import { educationalLevel } from "@/types/levels"
// import { Section } from "@/types/section"
// import { professor } from "@/types/users"
// import { IconAlertCircle, IconRosetteDiscountCheck, IconTextPlus, IconUserCircle } from "@tabler/icons-react"
// import axios from "axios"
// import { useRouter } from "next/navigation"
// import { use, useEffect, useState } from "react"
// import { toast } from "sonner"

// interface Props {
//     params: Promise<{
//         action: 'create' | 'edit';
//         id: string;
//     }>;
// }

// export default function CourseEditPage({ params }: Props) {

//     const { action, id } = use(params);

//     const router = useRouter();


//     // Dialog 
//     const [open, setOpen] = useState(false)


//     const [sections, setSections] = useState<Section[]>([]);
//     const [isLoadingSections, setIsLoadingSections] = useState(true);
//     const [educationalLevels, setEducationalLevels] = useState<educationalLevel[]>([]);
//     const [isLoadingEducationalLevels, setIsLoadingEducationalLevels] = useState(true);
//     const [teachers, setTeachers] = useState<professor[]>([]);
//     const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
//     const [courseData, setCourseData] = useState<course | null>(null);

//     const [isLoadingCourseData, setIsLoadingCourseData] = useState(true);

//     const [isLoading, setIsLoading] = useState(true);
//     const [processing, setProcessing] = useState(false);



//     async function loadSections() {
//         try {
//             const response = await axios.get('/api/sections');
//             if (response.data.success) {
//                 setSections(response.data.data);
//             }
//         } catch (error) {
//             console.error('Error fetching sections:', error)
//         } finally {
//             setIsLoadingSections(false)
//         }
//     }
//     async function loadEducationalLevels() {
//         try {
//             const response = await axios.get('/api/educational-levels');
//             if (response.data.success) {
//                 setEducationalLevels(response.data.data);
//             }
//         } catch (error) {
//             console.error('Error fetching educational levels:', error)
//         } finally {
//             setIsLoadingEducationalLevels(false)
//         }
//     }
//     async function loadTeachers() {
//         try {
//             const response = await axios.get('/api/usersc?role=profesor');
//             if (response.data.success) {
//                 setTeachers(response.data.data);
//             }
//         } catch (error) {
//             console.error('Error fetching proffesors:', error)
//         } finally {
//             setIsLoadingTeachers(false)
//         }
//     }
//     async function loadCourse() {
//         try {
//             const response = await axios.get('/api/coursesc/' + id);
//             if (response.data.success) {
//                 const data = response.data.data;
//                 setCourseData(data);
//                 setFormData({
//                     course_name: data.course_name,
//                 });
//                 setEducationalLevelId(data.educational_level_id.toString());
//                 setSectionId(data.section_id.toString());
//                 if (data.professor_id) {
//                     setTeacherId(data.professor_id.toString());
//                     setTeacherName(data.professor_name || "");
//                 }

//             }
//         } catch (error) {
//             console.error('Error fetching course:', error)
//         } finally {
//             setIsLoadingCourseData(false)
//         }
//     }

//     useEffect(() => {
//         loadEducationalLevels();
//         loadTeachers();
//         loadSections();

//         if (action === 'edit' && id) {
//             loadCourse();
//         }

//     }, [action, id]);


//     const [educationalLevelId, setEducationalLevelId] = useState<string>("");
//     const [sectionId, setSectionId] = useState<string>("");
//     const [teacherId, setTeacherId] = useState<string>("");
//     const [teacherName, setTeacherName] = useState<string>("");

//     const [formData, setFormData] = useState({
//         course_name: "",
//     })

//     const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.id]: e.target.value,
//         });
//         // console.log(formData) //DEBUG
//     };


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const isEdit = action === 'edit';
//         const loadingToast = toast.loading(isEdit ? 'Actualizando curso...' : 'Creando curso...');
//         setProcessing(true);

//         const payload = {
//             course_name: formData.course_name,
//             educational_level_id: educationalLevelId,
//             section_id: sectionId,
//             professor_id: teacherId || null,
//         };

//         try {
//             if (isEdit) {
//                 await axios.put(`/api/coursesc/${id}`, payload); // Usar PUT para editar
//                 toast.success('Curso actualizado con éxito', { id: loadingToast });
//             } else {
//                 await axios.post('/api/coursesc', payload);
//                 toast.success('Curso creado con éxito', { id: loadingToast });
//             }
//         } catch (error) {
//             toast.error('Error al procesar la solicitud', { id: loadingToast });
//         } finally {
//             setProcessing(false);
//         }
//     };



//     return (
//         <>
//             <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">

//                 <form
//                     onSubmit={handleSubmit}
//                     className="border border-gray-200 bg-white-primary rounded-primary p-6 grid md:col-span-2 row-span-2 grid-cols-2 gap-5">
//                     <div className="flex items-center gap-2 col-span-full">
//                         <IconTextPlus className="text-blue-primary" />
//                         <h5 className="font-bold text-xl text-blue-primary">Detalles del curso</h5>
//                     </div>

//                     <div className="col-span-full">
//                         <Label
//                             htmlFor="course_name"
//                         >Nombre del curso <span className="text-red-500">*</span></Label>
//                         <Input
//                             minLength={2}
//                             maxLength={255}
//                             required
//                             placeholder="Ej: Tercero de Bachillerato Informatica"
//                             id="course_name"
//                             type="text"
//                             value={formData.course_name || ""}
//                             onChange={handleChangeForm}
//                         />

//                     </div>

//                     <div>
//                         <Label>Nivel educativo <span className="text-red-500">*</span></Label>
//                         <Select
//                             value={educationalLevelId}
//                             onValueChange={(value) => {
//                                 setEducationalLevelId(value)
//                             }}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Selecciona un nivel educativo" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {educationalLevels?.map((e) => (
//                                     <SelectItem key={e.id} value={e.id.toString()}>
//                                         {e.name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div>
//                         <Label>Sección <span className="text-red-500">*</span></Label>
//                         <Select
//                             value={sectionId}
//                             onValueChange={(value) => {
//                                 setSectionId(value)
//                             }}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Selecciona una sección" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {sections?.map((e) => (
//                                     <SelectItem key={e.id} value={e.id.toString()}>
//                                         {e.name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="col-span-full">
//                         <Label
//                             htmlFor="professor_id"
//                         >Asignar profesor</Label>

//                         <div className="col-span-full p-4 rounded-xl cursor-pointer justify-between mt-6 border border-blue-primary/15 hover:border-blue-primary/25 transition-all duration-300 bg-blue-secondary/40 flex items-center gap-4" onClick={() => setOpen(true)}>
//                             <div className="flex items-center gap-4">
//                                 <div className="bg-blue-secondary grid place-items-center size-15 rounded-full">
//                                     <IconUserCircle className="text-blue-primary" />
//                                 </div>
//                                 <p className="font-bold text-black-primary text-lg">{teacherName ? `Lic. ${teacherName}` : "Selecciona un profesor"}</p>
//                             </div>
//                             <Badge color="blue">{teacherName ? 'Cambiar' : 'Seleccionar'}</Badge>
//                         </div>

//                     </div>


//                     <div className="flex items-center gap-3 justify-end col-span-full">
//                         <Button variant="outline" disabled={processing} type="button" onClick={() => router.push('/dashboard/courses-management')}>Cancelar</Button>
//                         <Button disabled={processing} type="submit"> {processing && <Spinner />} {processing ? 'Registrando...' : 'Registrar curso'}</Button>
//                     </div>

//                 </form>


//                 <CommandDialog showCloseButton={false} open={open} onOpenChange={setOpen} className="w-full max-w-[400px] p-3 rounded-xl">
//                     <Command
//                         value={teacherId}
//                         onValueChange={(value) => {
//                             setTeacherId(value)
//                             // console.log(courseId) //DEBUG
//                         }}

//                     >
//                         <CommandInput placeholder="Buscar por nombre..." />
//                         <CommandList >
//                             <CommandEmpty>Sin resultados.</CommandEmpty>
//                             <CommandGroup heading="Sugerencias">
//                                 {teachers.map((e) => (
//                                     <CommandItem key={e.id} value={e.id.toString()} onSelect={() => {
//                                         setOpen(false)
//                                         setTeacherName(`${e.first_name} ${e.last_name}`)
//                                     }} >{e.first_name} {e.last_name}</CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         </CommandList>
//                     </Command>
//                 </CommandDialog>


//                 <div className="bg-blue-primary rounded-primary px-8 py-12 space-y-4">
//                     <h5 className="font-bold text-white-primary text-2xl">Consejos rápidos para el registro</h5>
//                     <div className="flex gap-3">
//                         <IconAlertCircle className="text-white-primary/80 size-20" />
//                         <p className="font-medium text-white-primary/80">Los nombres de los cursos deben ser únicos dentro de la misma sección y turno para evitar conflictos de horario.</p>
//                     </div>
//                     <div className="flex gap-3">
//                         <IconRosetteDiscountCheck className="text-white-primary/80 size-17" />
//                         <p className="font-medium text-white-primary/80">Los profesores solo aparecen en la lista si tienen un estado activo en el registro del sistema.
//                         </p>
//                     </div>

//                     <div className="mt-9 border border-white-primary/60 rounded-primary p-6 w-full bg-white-primary/20">
//                         <p className="text-white-primary/80 italic font-medium">"La precisión del registro es la base de la excelencia institucional"</p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }




"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { course } from "@/types/courses"
import { educationalLevel } from "@/types/levels"
import { Section } from "@/types/section"
import { professor } from "@/types/users"
import { IconAlertCircle, IconRosetteDiscountCheck, IconTextPlus, IconUserCircle } from "@tabler/icons-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
    params: Promise<{
        action: 'create' | 'edit';
        id: string;
    }>;
}

// ── Tipos de errores por campo ──────────────────────────────────────────────
interface FormErrors {
    course_name?: string;
    educational_level_id?: string;
    section_id?: string;
}

// ── Helper: mensaje de error inline ────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="text-red-500 mt-1 flex items-center gap-1">
            <IconAlertCircle className="size-4 shrink-0" />
            {message}
        </p>
    );
}

// ── Skeleton del formulario ─────────────────────────────────────────────────
function FormSkeleton() {
    return (
        // <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">

        //     {/* Skeleton del formulario principal */}
        //     <div className="border border-gray-200 bg-white-primary rounded-primary p-6 grid md:col-span-2 row-span-2 grid-cols-2 gap-5">

        //         {/* Título */}
        //         <div className="flex items-center gap-2 col-span-full">
        //             <Skeleton className="size-5 rounded" />
        //             <Skeleton className="h-6 w-48 rounded" />
        //         </div>

        //         {/* Nombre del curso */}
        //         <div className="col-span-full space-y-2">
        //             <Skeleton className="h-4 w-36 rounded" />
        //             <Skeleton className="h-10 w-full rounded-md" />
        //         </div>

        //         {/* Nivel educativo */}
        //         <div className="space-y-2">
        //             <Skeleton className="h-4 w-28 rounded" />
        //             <Skeleton className="h-10 w-full rounded-md" />
        //         </div>

        //         {/* Sección */}
        //         <div className="space-y-2">
        //             <Skeleton className="h-4 w-20 rounded" />
        //             <Skeleton className="h-10 w-full rounded-md" />
        //         </div>

        //         {/* Profesor */}
        //         <div className="col-span-full space-y-2">
        //             <Skeleton className="h-4 w-32 rounded" />
        //             <Skeleton className="h-[72px] w-full rounded-xl mt-2" />
        //         </div>

        //         {/* Botones */}
        //         <div className="flex items-center gap-3 justify-end col-span-full">
        //             <Skeleton className="h-10 w-24 rounded-md" />
        //             <Skeleton className="h-10 w-36 rounded-md" />
        //         </div>
        //     </div>

        //     {/* Skeleton del panel lateral */}
        //     <div className="bg-blue-primary/10 rounded-primary px-8 py-12 space-y-6">
        //         <Skeleton className="h-7 w-3/4 rounded" />
        //         <div className="flex gap-3">
        //             <Skeleton className="size-8 shrink-0 rounded" />
        //             <div className="space-y-2 flex-1">
        //                 <Skeleton className="h-4 w-full rounded" />
        //                 <Skeleton className="h-4 w-5/6 rounded" />
        //                 <Skeleton className="h-4 w-4/6 rounded" />
        //             </div>
        //         </div>
        //         <div className="flex gap-3">
        //             <Skeleton className="size-8 shrink-0 rounded" />
        //             <div className="space-y-2 flex-1">
        //                 <Skeleton className="h-4 w-full rounded" />
        //                 <Skeleton className="h-4 w-3/4 rounded" />
        //             </div>
        //         </div>
        //         <Skeleton className="h-24 w-full rounded-primary mt-4" />
        //     </div>

        // </div>

        <>
            <div className="bg-gray-200 border-primary h-120 col-span-2"></div>
            <div className="bg-gray-200 border-primary h-120"></div>
        </>
    );
}

export default function CourseEditPage({ params }: Props) {


    const { action, id } = use(params);
    const router = useRouter();

    // Dialog
    const [open, setOpen] = useState(false);

    const [sections, setSections] = useState<Section[]>([]);
    const [isLoadingSections, setIsLoadingSections] = useState(true);
    const [educationalLevels, setEducationalLevels] = useState<educationalLevel[]>([]);
    const [isLoadingEducationalLevels, setIsLoadingEducationalLevels] = useState(true);
    const [teachers, setTeachers] = useState<professor[]>([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
    const [courseData, setCourseData] = useState<course | null>(null);
    const [isLoadingCourseData, setIsLoadingCourseData] = useState(true);
    const [processing, setProcessing] = useState(false);

    // ── Estado del formulario ─────────────────────────────────────────────
    const [educationalLevelId, setEducationalLevelId] = useState<string>("");
    const [sectionId, setSectionId] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [teacherName, setTeacherName] = useState<string>("");

    const [formData, setFormData] = useState({ course_name: "" });

    // ── Errores de validación ─────────────────────────────────────────────
    const [errors, setErrors] = useState<FormErrors>({});

    // ── Carga de datos ────────────────────────────────────────────────────
    async function loadSections() {
        try {
            const response = await axios.get('/api/sections');
            if (response.data.success) setSections(response.data.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setIsLoadingSections(false);
        }
    }

    async function loadEducationalLevels() {
        try {
            const response = await axios.get('/api/educational-levels');
            if (response.data.success) setEducationalLevels(response.data.data);
        } catch (error) {
            console.error('Error fetching educational levels:', error);
        } finally {
            setIsLoadingEducationalLevels(false);
        }
    }

    async function loadTeachers() {
        try {
            const response = await axios.get('/api/usersc?role=profesor');
            if (response.data.success) setTeachers(response.data.data);
        } catch (error) {
            console.error('Error fetching professors:', error);
        } finally {
            setIsLoadingTeachers(false);
        }
    }

    async function loadCourse() {
        try {
            const response = await axios.get('/api/coursesc/' + id);
            if (response.data.success) {
                const data = response.data.data;
                setCourseData(data);
                setFormData({ course_name: data.course_name });
                setEducationalLevelId(data.educational_level_id.toString());
                setSectionId(data.section_id.toString());
                if (data.professor_id) {
                    setTeacherId(data.professor_id.toString());
                    setTeacherName(data.professor_name || "");
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setIsLoadingCourseData(false);
        }
    }

    useEffect(() => {
        loadEducationalLevels();
        loadTeachers();
        loadSections();
        if (action === 'edit' && id) loadCourse();
    }, [action, id]);

    // ── Handlers ──────────────────────────────────────────────────────────

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Limpiar error del campo mientras el usuario escribe
        if (errors[id as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleEducationalLevelChange = (value: string) => {
        setEducationalLevelId(value);
        if (errors.educational_level_id) {
            setErrors(prev => ({ ...prev, educational_level_id: undefined }));
        }
    };

    const handleSectionChange = (value: string) => {
        setSectionId(value);
        if (errors.section_id) {
            setErrors(prev => ({ ...prev, section_id: undefined }));
        }
    };

    // ── Validación ────────────────────────────────────────────────────────

    /**
     * Valida todos los campos y devuelve true si el formulario es válido.
     * Actualiza el estado `errors` con los mensajes correspondientes.
     */
    function validate(): boolean {
        const newErrors: FormErrors = {};

        // Nombre del curso
        const trimmedName = formData.course_name.trim();
        if (!trimmedName) {
            newErrors.course_name = "El nombre del curso es obligatorio.";
        } else if (trimmedName.length < 2) {
            newErrors.course_name = "El nombre debe tener al menos 2 caracteres.";
        } else if (trimmedName.length > 255) {
            newErrors.course_name = "El nombre no puede superar los 255 caracteres.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 ,.\-()]+$/.test(trimmedName)) {
            // Permite letras (incluyendo acentos y ñ), números, espacios y puntuación básica
            newErrors.course_name = "El nombre contiene caracteres no permitidos.";
        }

        // Nivel educativo
        if (!educationalLevelId) {
            newErrors.educational_level_id = "Debes seleccionar un nivel educativo.";
        }

        // Sección
        if (!sectionId) {
            newErrors.section_id = "Debes seleccionar una sección.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ejecutar validación antes de cualquier llamada a la API
        if (!validate()) {
            toast.error("Por favor corrige los errores antes de continuar.");
            return;
        }

        const isEdit = action === 'edit';
        const loadingToast = toast.loading(isEdit ? 'Actualizando curso...' : 'Creando curso...');
        setProcessing(true);

        const payload = {
            course_name: formData.course_name.trim(),
            educational_level_id: educationalLevelId,
            section_id: sectionId,
            professor_id: teacherId || null,
        };

        try {
            if (isEdit) {
                await axios.put(`/api/coursesc/${id}`, payload);
                toast.success('Curso actualizado con éxito', { id: loadingToast });
            } else {
                await axios.post('/api/coursesc', payload);
                toast.success('Curso creado con éxito', { id: loadingToast });
            }
            // Redirigir tras éxito
            router.push('/dashboard/courses-management');
        } catch (error: any) {
            // Mostrar mensaje de error del servidor si está disponible
            const serverMessage =
                error?.response?.data?.message || 'Error al procesar la solicitud';
            toast.error(serverMessage, { id: loadingToast });
        } finally {
            setProcessing(false);
        }
    };

    // ── Estado de carga global ────────────────────────────────────────────
    // En modo "create" no necesitamos esperar courseData, solo los catálogos.
    // En modo "edit" esperamos además que se carguen los datos del curso.
    const isPageLoading =
        isLoadingSections ||
        isLoadingEducationalLevels ||
        isLoadingTeachers ||
        (action === 'edit' && isLoadingCourseData);

    // ─────────────────────────────────────────────────────────────────────

    if (isPageLoading) return <FormSkeleton />;

    return (
        <>
            <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">

                <form
                    onSubmit={handleSubmit}
                    noValidate // Desactivamos la validación nativa para usar la propia
                    className="border border-gray-200 bg-white-primary rounded-primary p-6 grid md:col-span-2 row-span-2 grid-cols-2 gap-5"
                >
                    <div className="flex items-center gap-2 col-span-full">
                        <IconTextPlus className="text-blue-primary" />
                        <h5 className="font-bold text-xl text-blue-primary">Detalles del curso</h5>
                    </div>

                    {/* Nombre del curso */}
                    <div className="col-span-full">
                        <Label htmlFor="course_name">
                            Nombre del curso <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            minLength={2}
                            maxLength={255}
                            placeholder="Ej: Tercero de Bachillerato Informática"
                            id="course_name"
                            type="text"
                            value={formData.course_name}
                            onChange={handleChangeForm}
                            className={errors.course_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        <FieldError message={errors.course_name} />
                    </div>

                    {/* Nivel educativo */}
                    <div>
                        <Label>Nivel educativo <span className="text-red-500">*</span></Label>
                        <Select
                            value={educationalLevelId}
                            onValueChange={handleEducationalLevelChange}
                        >
                            <SelectTrigger className={errors.educational_level_id ? "border-red-500 focus:ring-red-500" : ""}>
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
                        <FieldError message={errors.educational_level_id} />
                    </div>

                    {/* Sección */}
                    <div>
                        <Label>Sección <span className="text-red-500">*</span></Label>
                        <Select
                            value={sectionId}
                            onValueChange={handleSectionChange}
                        >
                            <SelectTrigger className={errors.section_id ? "border-red-500 focus:ring-red-500" : ""}>
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
                        <FieldError message={errors.section_id} />
                    </div>

                    {/* Asignar profesor (opcional) */}
                    <div className="col-span-full">
                        <Label htmlFor="professor_id">Asignar profesor</Label>
                        <div
                            className="col-span-full p-4 rounded-xl cursor-pointer justify-between mt-6 border border-blue-primary/15 hover:border-blue-primary/25 transition-all duration-300 bg-blue-secondary/40 flex items-center gap-4"
                            onClick={() => setOpen(true)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-secondary grid place-items-center size-15 rounded-full">
                                    <IconUserCircle className="text-blue-primary" />
                                </div>
                                <p className="font-bold text-black-primary text-lg">
                                    {teacherName ? `Lic. ${teacherName}` : "Selecciona un profesor"}
                                </p>
                            </div>
                            <Badge color="blue">{teacherName ? 'Cambiar' : 'Seleccionar'}</Badge>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-3 justify-end col-span-full">
                        <Button
                            variant="outline"
                            disabled={processing}
                            type="button"
                            onClick={() => router.push('/dashboard/courses-management')}
                        >
                            Cancelar
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing && <Spinner />}
                            {processing
                                ? (action === 'edit' ? 'Actualizando...' : 'Registrando...')
                                : (action === 'edit' ? 'Actualizar curso' : 'Registrar curso')
                            }
                        </Button>
                    </div>
                </form>

                {/* Dialog búsqueda de profesor */}
                <CommandDialog
                    showCloseButton={false}
                    open={open}
                    onOpenChange={setOpen}
                    className="w-full max-w-[400px] p-3 rounded-xl"
                >
                    <Command
                        value={teacherId}
                        onValueChange={(value) => setTeacherId(value)}
                    >
                        <CommandInput placeholder="Buscar por nombre..." />
                        <CommandList>
                            <CommandEmpty>Sin resultados.</CommandEmpty>
                            <CommandGroup heading="Sugerencias">
                                {teachers.map((e) => (
                                    <CommandItem
                                        key={e.id}
                                        value={e.id.toString()}
                                        onSelect={() => {
                                            setOpen(false);
                                            setTeacherName(`${e.first_name} ${e.last_name}`);
                                        }}
                                    >
                                        {e.first_name} {e.last_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </CommandDialog>

                {/* Panel de consejos */}
                <div className="bg-blue-primary rounded-primary px-8 py-12 space-y-4">
                    <h5 className="font-bold text-white-primary text-2xl">Consejos rápidos para el registro</h5>
                    <div className="flex gap-3">
                        <IconAlertCircle className="text-white-primary/80 size-20" />
                        <p className="font-medium text-white-primary/80">
                            Los nombres de los cursos deben ser únicos dentro de la misma sección y turno para evitar conflictos de horario.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <IconRosetteDiscountCheck className="text-white-primary/80 size-17" />
                        <p className="font-medium text-white-primary/80">
                            Los profesores solo aparecen en la lista si tienen un estado activo en el registro del sistema.
                        </p>
                    </div>
                    <div className="mt-9 border border-white-primary/60 rounded-primary p-6 w-full bg-white-primary/20">
                        <p className="text-white-primary/80 italic font-medium">
                            "La precisión del registro es la base de la excelencia institucional"
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
