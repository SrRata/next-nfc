// "use client"

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { course } from "@/types/courses";
// import { IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
// import axios from "axios";
// import Link from "next/link";
// import { use, useEffect, useState } from "react";
// import { toast } from "sonner"


// interface Props {
//     params: Promise<{
//         action: 'create' | 'edit';
//         id: string;
//     }>;
// }


// export default function CreateStudentsPage({ params }: Props) {

//     const { action, id } = use(params);

//     const [courses, setCourses] = useState<course[]>([]);
//     const [isLoadingCourses, setIsLoadingCourses] = useState(true);

//     async function loadCourses() {
//         try {
//             const response = await axios.get('/api/coursesc');
//             if (response.data.success) {
//                 setCourses(response.data.data);
//             }

//         } catch (error) {
//             console.error('Error fetching courses:', error)

//         } finally {
//             setIsLoadingCourses(false)
//         }
//     }

//     useEffect(() => {
//         loadCourses();
//     }, []);


//     const [courseId, setCourseId] = useState<string>("");


//     const [formDataStudent, setFormDataStudent] = useState({
//         studentFirstName: "",
//         studentLastName: "",
//         stuedntCdl: "",
//         studentPhoneNumber: "",
//         studentEmail: "",
//         nfcUid: "",
//     })

//     const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormDataStudent({
//             ...formDataStudent,
//             [e.target.id]: e.target.value,
//         });
//         // console.log(formDataStudent) //DEBUG
//     };

//     const [formDataParent, setFormDataParent] = useState({
//         parentFirstName: "",
//         parentLastName: "",
//         parentCdl: "",
//         parentPhoneNumber: "",
//         parentEmail: "",
//     })

//     const handleChangeParent = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormDataParent({
//             ...formDataParent,
//             [e.target.id]: e.target.value
//         });
//         // console.log(formDataParent)  //DEBUG
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();


//         const validarCedula = (cdl: string): boolean => {
//             if (!/^\d{10}$/.test(cdl)) return false;
//             const digits = cdl.split('').map(Number);
//             const provincia = parseInt(cdl.substring(0, 2));
//             if (provincia < 1 || provincia > 24) return false;
//             const verificador = digits[9];
//             const suma = digits.slice(0, 9).reduce((acc, d, i) => {
//                 if (i % 2 === 0) { const v = d * 2; return acc + (v > 9 ? v - 9 : v); }
//                 return acc + d;
//             }, 0);
//             const residuo = suma % 10;
//             return (residuo === 0 ? 0 : 10 - residuo) === verificador;
//         };

//         if (!validarCedula(formDataStudent.stuedntCdl)) {
//             toast.error("La cédula del estudiante no es válida");
//             return;
//         }

//         if (formDataParent.parentCdl && !validarCedula(formDataParent.parentCdl)) {
//             toast.error("La cédula del representante no es válida");
//             return;
//         }

//         // Curso seleccionado
//         if (!courseId) {
//             toast.error("Debes asignar un curso al estudiante");
//             return;
//         }

//         // NFC: formato básico (hexadecimal, no vacío)
//         if (!formDataStudent.nfcUid.trim()) {
//             toast.error("Debes vincular una tarjeta NFC");
//             return;
//         }

//         // Teléfonos: solo dígitos, 10 caracteres
//         const telRegex = /^\d{10}$/;
//         if (formDataStudent.studentPhoneNumber && !telRegex.test(formDataStudent.studentPhoneNumber)) {
//             toast.error("El teléfono del estudiante debe tener 10 dígitos");
//             return;
//         }
//         if (formDataParent.parentPhoneNumber && !telRegex.test(formDataParent.parentPhoneNumber)) {
//             toast.error("El teléfono del representante debe tener 10 dígitos");
//             return;
//         }

//         // Si se llena parcialmente la sección del representante, exigir campos mínimos
//         const parentFilled = Object.values(formDataParent).some(v => v !== "");
//         if (parentFilled && (!formDataParent.parentFirstName || !formDataParent.parentLastName || !formDataParent.parentCdl || !formDataParent.parentEmail)) {
//             toast.error("Si ingresas datos del representante, completa nombre, apellido, cédula y correo");
//             return;
//         }

//         const payload = {
//             first_name: formDataStudent.studentFirstName,
//             last_name: formDataStudent.studentLastName,
//             cdl: formDataStudent.stuedntCdl,
//             email: formDataStudent.studentEmail,
//             course_id: courseId,
//             nfc_uid: formDataStudent.nfcUid,
//             phone_number: formDataStudent.studentPhoneNumber,
//             ...(formDataParent.parentCdl && {
//                 parent: {
//                     first_name: formDataParent.parentFirstName,
//                     last_name: formDataParent.parentLastName,
//                     cdl: formDataParent.parentCdl,
//                     email: formDataParent.parentEmail,
//                     username: formDataParent.parentEmail.split('@')[0],
//                     password: formDataParent.parentCdl,
//                     phone_number: formDataParent.parentPhoneNumber
//                 }
//             })
//         }

//         try {
//             await axios.post('/api/students', payload)
//             toast.success(`El estudiante ${formDataStudent.studentFirstName} fue creado con exito`)
//         } catch (error) {
//             await console.error('Error create student', error)
//             toast.error(`Error al ${formDataStudent.studentFirstName} no pudo ser creado`)
//         }
//     }

//     return (

//         <>
//             <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">
//                 <form
//                     onSubmit={handleSubmit}
//                     className="col-span-full grid grid-cols-3 gap-7">

//                     <div className="col-span-full flex justify-between my-2">

//                         <div>
//                             <h3 className="text-4xl text-blue-primary font-extrabold">Nuevo Registro</h3>
//                             <p className="font-medium text-black-secondary">Inscripción de un nuevo estudiante en el sistema institucional.</p>
//                         </div>

//                         <div className="flex gap-2 items-center">
//                             <Link href="./">
//                                 <Button
//                                     variant="outline"
//                                 >
//                                     Cancelar registro
//                                 </Button>
//                             </Link>

//                             <Button type="submit">
//                                 Registrar nuevo estudiante
//                             </Button>

//                         </div>

//                     </div>

//                     <div className="bg-white-primary col-span-2 row-span-2 rounded-primary p-7 border border-gray-200">

//                         <div className="grid grid-cols-2 gap-7">
//                             <div className="col-span-full flex justify-between items-center">
//                                 <div className="flex items-center gap-2 col-span-full">
//                                     <IconIdBadge2 className="text-blue-primary" />
//                                     <h5 className="font-bold text-xl text-blue-primary">Detalles del estudiante</h5>
//                                 </div>

//                                 <Badge color="blue">
//                                     Requerido
//                                 </Badge>

//                             </div>

//                             <div>
//                                 <Label
//                                     htmlFor="studentFirstName"
//                                 >Nombre del estudiante <span className="text-red-500">*</span></Label>
//                                 <Input
//                                     minLength={2}
//                                     maxLength={255}
//                                     required
//                                     placeholder="Nombres completos"
//                                     id="studentFirstName"
//                                     type="text"
//                                     value={formDataStudent.studentFirstName || ""}
//                                     onChange={handleChangeStudent}
//                                 />

//                             </div>

//                             <div>
//                                 <Label
//                                     htmlFor="studentLastName"
//                                 >Apellido del estudiante <span className="text-red-500">*</span></Label>
//                                 <Input
//                                     required
//                                     minLength={2}
//                                     maxLength={255}
//                                     placeholder="Apelldios completos"
//                                     id="studentLastName"
//                                     type="text"
//                                     value={formDataStudent.studentLastName || ""}
//                                     onChange={handleChangeStudent}
//                                 />
//                             </div>

//                             <div>
//                                 <Label
//                                     htmlFor="stuedntCdl"
//                                 >Cédula / Identificación <span className="text-red-500">*</span></Label>
//                                 <Input
//                                     maxLength={10}
//                                     minLength={10}
//                                     required
//                                     placeholder="17xxxxxxx-x"
//                                     id="stuedntCdl"
//                                     type="text"
//                                     value={formDataStudent.stuedntCdl || ""}
//                                     onChange={handleChangeStudent}
//                                 />
//                             </div>

//                             <div>
//                                 <Label
//                                     htmlFor="studentPhoneNumber"
//                                 >Teléfono de contacto </Label>
//                                 <Input
//                                     maxLength={10}
//                                     minLength={10}
//                                     placeholder="+593 9..."
//                                     id="studentPhoneNumber"
//                                     type="text"
//                                     value={formDataStudent.studentPhoneNumber || ""}
//                                     onChange={handleChangeStudent}
//                                 />
//                             </div>

//                             <div className="col-span-full">
//                                 <Label
//                                     htmlFor="studentEmail"
//                                 >Correo Electrónico <span className="text-red-500">*</span></Label>
//                                 <Input
//                                     required
//                                     maxLength={255}
//                                     type="email"
//                                     placeholder="estudiante@ejemplo.com"
//                                     id="studentEmail"
//                                     value={formDataStudent.studentEmail || ""}
//                                     onChange={handleChangeStudent}
//                                 />
//                             </div>
//                         </div>

//                     </div>

//                     <div className="bg-white-primary rounded-primary p-7 space-y-7 border border-gray-200">

//                         <div className="col-span-full flex justify-between items-center">

//                             <div className="flex items-center gap-2 col-span-full">
//                                 <IconSchool className="text-blue-primary" />
//                                 <h5 className="font-bold text-xl text-blue-primary">Información de registro</h5>
//                             </div>

//                         </div>

//                         <Label>Curso / Nivel <span className="text-red-500">*</span></Label>
//                         <Select
//                             required
//                             value={courseId}
//                             onValueChange={(value) => {
//                                 setCourseId(value)
//                                 // console.log(courseId) //DEBUG
//                             }}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Sin asignar curso" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {courses?.map((c) => (
//                                     <SelectItem key={c.id} value={c.id.toString()}>
//                                         {c.course_name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>



//                     <div className="bg-blue-primary rounded-primary p-7">

//                         <div className="flex items-center gap-2 mb-6">
//                             <IconNfc className="size-10 text-white-primary" />
//                             <p className="text-white-primary font-bold text-xl">Hardware NFC</p>
//                         </div>
//                         <div className="w-full">
//                             <Label
//                                 className="text-white-primary uppercase"
//                                 htmlFor="nfcUid"
//                             >Código de identificación digital</Label>
//                             <div className="flex items-center gap-2">
//                                 <Input
//                                     type="text"
//                                     maxLength={50}
//                                     required
//                                     placeholder="00 : 00 : 00 : 00"
//                                     id="nfcUid"
//                                     value={formDataStudent.nfcUid || ""}
//                                     onChange={handleChangeStudent}
//                                 />
//                                 <Button
//                                     type="button"
//                                     className="size-fit bg-white-primary border-white hover:bg-white-primary/80"
//                                     onClick={() => setFormDataStudent(prev => ({ ...prev, nfcUid: "" }))}
//                                 >
//                                     <IconRefresh className="size-7 text-blue-primary" />
//                                 </Button>
//                             </div>
//                         </div>

//                         <p className="font-medium text-white/80 mt-8">Mantenga la tarjeta cerca del lector para vinculación automática.</p>

//                     </div>

//                     <div className="bg-white-primary border border-gray-200 col-span-full rounded-primary p-7 grid grid-cols-6 gap-7">

//                         <div className="col-span-full flex justify-between items-center">

//                             <div className="flex items-center gap-2 col-span-full">
//                                 <IconBinaryTree2 className="text-blue-primary" />
//                                 <h5 className="font-bold text-xl text-blue-primary">Información de registro</h5>
//                             </div>
//                             <Badge color="gray">
//                                 Opcional
//                             </Badge>

//                         </div>


//                         <div className="col-span-2">
//                             <Label
//                                 htmlFor="parentFirstName"
//                             >Nombre del representante</Label>
//                             <Input
//                                 minLength={2}
//                                 maxLength={255}
//                                 type="text"
//                                 placeholder="Nombres completos"
//                                 id="parentFirstName"
//                                 value={formDataParent.parentFirstName || ""}
//                                 onChange={handleChangeParent}
//                             />
//                         </div>

//                         <div className="col-span-2">
//                             <Label
//                                 htmlFor="parentLastName"
//                             >Apellido del representante</Label>
//                             <Input
//                                 minLength={2}
//                                 maxLength={255}
//                                 type="text"
//                                 placeholder="Apellidos completos"
//                                 id="parentLastName"
//                                 value={formDataParent.parentLastName || ""}
//                                 onChange={handleChangeParent}
//                             />
//                         </div>

//                         <div className="col-span-2">
//                             <Label
//                                 htmlFor="parentCdl"
//                             >Cédula / Identificación</Label>
//                             <Input
//                                 minLength={10}
//                                 maxLength={10}
//                                 type="text"
//                                 placeholder="17xxxxxxx-x"
//                                 id="parentCdl"
//                                 value={formDataParent.parentCdl || ""}
//                                 onChange={handleChangeParent}
//                             />
//                         </div>

//                         <div className="col-span-3">
//                             <Label
//                                 htmlFor="parentPhoneNumber"
//                             >Télefono de contacto</Label>
//                             <Input
//                                 type="text"
//                                 maxLength={10}
//                                 minLength={10}
//                                 placeholder="+593 9..."
//                                 id="parentPhoneNumber"
//                                 value={formDataParent.parentPhoneNumber || ""}
//                                 onChange={handleChangeParent}
//                             />
//                         </div>

//                         <div className="col-span-3">
//                             <Label
//                                 htmlFor="parentEmail"
//                             >Correo Electrónico</Label>
//                             <Input
//                                 maxLength={255}
//                                 type="email"
//                                 placeholder="representante@ejemplo.com"
//                                 id="parentEmail"
//                                 value={formDataParent.parentEmail || ""}
//                                 onChange={handleChangeParent}
//                             />
//                         </div>


//                     </div>

//                 </form>

//             </div>

//         </>
//     );
// }



"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { course } from "@/types/courses";
import { IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner"


interface Props {
    params: Promise<{
        action: 'create' | 'edit';
        id: string;
    }>;
}

// ── Algoritmo dígito verificador cédula ecuatoriana ──────────────────────────
function validarCedula(cdl: string): boolean {
    if (!/^\d{10}$/.test(cdl)) return false;
    const digits = cdl.split('').map(Number);
    const provincia = parseInt(cdl.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;
    const verificador = digits[9];
    const suma = digits.slice(0, 9).reduce((acc, d, i) => {
        if (i % 2 === 0) { const v = d * 2; return acc + (v > 9 ? v - 9 : v); }
        return acc + d;
    }, 0);
    const residuo = suma % 10;
    return (residuo === 0 ? 0 : 10 - residuo) === verificador;
}

export default function CreateStudentsPage({ params }: Props) {

    const { action, id } = use(params);
    const isEdit = action === 'edit';

    const [isLoadingData, setIsLoadingData] = useState(isEdit);
    const [courses, setCourses] = useState<course[]>([]);
    const [courseId, setCourseId] = useState<string>("");

    const [formDataStudent, setFormDataStudent] = useState({
        studentFirstName: "",
        studentLastName: "",
        studentCdl: "",
        studentPhoneNumber: "",
        studentEmail: "",
        nfcUid: "",
    });

    const [formDataParent, setFormDataParent] = useState({
        parentFirstName: "",
        parentLastName: "",
        parentCdl: "",
        parentPhoneNumber: "",
        parentEmail: "",
    });

    // ── Carga de cursos ──────────────────────────────────────────────────────
    useEffect(() => {
        async function loadCourses() {
            try {
                const response = await axios.get('/api/coursesc');
                if (response.data.success) setCourses(response.data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('No se pudieron cargar los cursos');
            }
        }
        loadCourses();
    }, []);

    // ── Carga de datos del estudiante en modo edición ────────────────────────
    useEffect(() => {
        if (!isEdit || !id) return;

        async function loadStudent() {
            try {
                const response = await axios.get(`/api/students/${id}`);
                if (!response.data.success) throw new Error('No encontrado');

                const d = response.data.data;

                setFormDataStudent({
                    studentFirstName: d.first_name ?? "",
                    studentLastName: d.last_name ?? "",
                    studentCdl: d.cdl ?? "",
                    studentPhoneNumber: d.phone_number ?? "",
                    studentEmail: d.email ?? "",
                    nfcUid: d.nfc_uid ?? "",
                });

                setCourseId(d.course_id ? d.course_id.toString() : "");

                // Solo poblar el representante si existe
                if (d.parent_id) {
                    setFormDataParent({
                        parentFirstName: d.parent_name?.split(' ')[0] ?? "",
                        parentLastName: d.parent_name?.split(' ').slice(1).join(' ') ?? "",
                        parentCdl: "",           // la API no lo devuelve aplanado; dejar vacío
                        parentPhoneNumber: d.parent_phone ?? "",
                        parentEmail: d.parent_email ?? "",
                    });
                }
            } catch (error) {
                console.error('Error loading student:', error);
                toast.error('No se pudo cargar la información del estudiante');
            } finally {
                setIsLoadingData(false);
            }
        }

        loadStudent();
    }, [isEdit, id]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDataStudent(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleChangeParent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDataParent(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    // ── Validaciones ─────────────────────────────────────────────────────────
    function validate(): boolean {
        // if (!validarCedula(formDataStudent.studentCdl)) {
        //     toast.error("La cédula del estudiante no es válida");
        //     return false;
        // }

        if (!courseId) {
            toast.error("Debes asignar un curso al estudiante");
            return false;
        }

        if (!formDataStudent.nfcUid.trim()) {
            toast.error("Debes vincular una tarjeta NFC");
            return false;
        }

        const telRegex = /^\d{10}$/;
        if (formDataStudent.studentPhoneNumber && !telRegex.test(formDataStudent.studentPhoneNumber)) {
            toast.error("El teléfono del estudiante debe tener 10 dígitos");
            return false;
        }

        const parentFilled = Object.values(formDataParent).some(v => v !== "");
        if (parentFilled) {
            if (!formDataParent.parentFirstName || !formDataParent.parentLastName ||
                !formDataParent.parentCdl || !formDataParent.parentEmail) {
                toast.error("Si ingresas datos del representante, completa nombre, apellido, cédula y correo");
                return false;
            }
            // if (!validarCedula(formDataParent.parentCdl)) {
            //     toast.error("La cédula del representante no es válida");
            //     return false;
            // }
            if (formDataParent.parentPhoneNumber && !telRegex.test(formDataParent.parentPhoneNumber)) {
                toast.error("El teléfono del representante debe tener 10 dígitos");
                return false;
            }
        }

        return true;
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const parentFilled = Object.values(formDataParent).some(v => v !== "");

        const payload = {
            first_name: formDataStudent.studentFirstName,
            last_name: formDataStudent.studentLastName,
            cdl: formDataStudent.studentCdl,
            email: formDataStudent.studentEmail,
            course_id: courseId,
            nfc_uid: formDataStudent.nfcUid,
            phone_number: formDataStudent.studentPhoneNumber,
            ...(parentFilled && {
                parent: {
                    first_name: formDataParent.parentFirstName,
                    last_name: formDataParent.parentLastName,
                    cdl: formDataParent.parentCdl,
                    email: formDataParent.parentEmail,
                    username: formDataParent.parentEmail.split('@')[0],
                    password: formDataParent.parentCdl,
                    phone_number: formDataParent.parentPhoneNumber,
                }
            })
        };

        try {
            if (isEdit) {
                await axios.put(`/api/students/${id}`, payload);
                toast.success(`El estudiante ${formDataStudent.studentFirstName} fue actualizado con éxito`);
            } else {
                await axios.post('/api/students', payload);
                toast.success(`El estudiante ${formDataStudent.studentFirstName} fue creado con éxito`);
            }
        } catch (error) {
            console.error('Error saving student:', error);
            toast.error(`El estudiante ${formDataStudent.studentFirstName} no pudo ser ${isEdit ? 'actualizado' : 'creado'}`);
        }
    };

    // ── Loading state ─────────────────────────────────────────────────────────
    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px] col-span-full">
                <div className="flex flex-col items-center gap-3 text-black-secondary">
                    <IconRefresh className="size-8 animate-spin text-blue-primary" />
                    <p className="font-medium">Cargando información del estudiante…</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">
                <form
                    onSubmit={handleSubmit}
                    className="col-span-full grid grid-cols-3 gap-7">

                    {/* ── Header ── */}
                    <div className="col-span-full flex justify-between my-2">
                        <div>
                            <h3 className="text-4xl text-blue-primary font-extrabold">
                                {isEdit ? 'Editar Estudiante' : 'Nuevo Registro'}
                            </h3>
                            <p className="font-medium text-black-secondary">
                                {isEdit
                                    ? 'Modifica los datos del estudiante en el sistema institucional.'
                                    : 'Inscripción de un nuevo estudiante en el sistema institucional.'
                                }
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Link href="./">
                                <Button variant="outline">Cancelar</Button>
                            </Link>
                            <Button type="submit">
                                {isEdit ? 'Guardar cambios' : 'Registrar nuevo estudiante'}
                            </Button>
                        </div>
                    </div>

                    {/* ── Datos del estudiante ── */}
                    <div className="bg-white-primary col-span-2 row-span-2 rounded-primary p-7 border border-gray-200">
                        <div className="grid grid-cols-2 gap-7">
                            <div className="col-span-full flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <IconIdBadge2 className="text-blue-primary" />
                                    <h5 className="font-bold text-xl text-blue-primary">Detalles del estudiante</h5>
                                </div>
                                <Badge color="blue">Requerido</Badge>
                            </div>

                            <div>
                                <Label htmlFor="studentFirstName">
                                    Nombre del estudiante <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    required minLength={2} maxLength={255}
                                    placeholder="Nombres completos"
                                    id="studentFirstName" type="text"
                                    value={formDataStudent.studentFirstName}
                                    onChange={handleChangeStudent}
                                />
                            </div>

                            <div>
                                <Label htmlFor="studentLastName">
                                    Apellido del estudiante <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    required minLength={2} maxLength={255}
                                    placeholder="Apellidos completos"
                                    id="studentLastName" type="text"
                                    value={formDataStudent.studentLastName}
                                    onChange={handleChangeStudent}
                                />
                            </div>

                            <div>
                                <Label htmlFor="studentCdl">
                                    Cédula / Identificación <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    required maxLength={10} minLength={10}
                                    placeholder="17xxxxxxxx"
                                    id="studentCdl" type="text"
                                    value={formDataStudent.studentCdl}
                                    onChange={handleChangeStudent}
                                />
                            </div>

                            <div>
                                <Label htmlFor="studentPhoneNumber">Teléfono de contacto</Label>
                                <Input
                                    maxLength={10} minLength={10}
                                    placeholder="+593 9..."
                                    id="studentPhoneNumber" type="text"
                                    value={formDataStudent.studentPhoneNumber}
                                    onChange={handleChangeStudent}
                                />
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="studentEmail">
                                    Correo Electrónico <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    required maxLength={255} type="email"
                                    placeholder="estudiante@ejemplo.com"
                                    id="studentEmail"
                                    value={formDataStudent.studentEmail}
                                    onChange={handleChangeStudent}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Curso ── */}
                    <div className="bg-white-primary rounded-primary p-7 space-y-7 border border-gray-200">
                        <div className="flex items-center gap-2">
                            <IconSchool className="text-blue-primary" />
                            <h5 className="font-bold text-xl text-blue-primary">Información de registro</h5>
                        </div>
                        <div>
                            <Label>Curso / Nivel <span className="text-red-500">*</span></Label>
                            <Select
                                required value={courseId}
                                onValueChange={setCourseId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sin asignar curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses?.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.course_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ── NFC ── */}
                    <div className="bg-blue-primary rounded-primary p-7">
                        <div className="flex items-center gap-2 mb-6">
                            <IconNfc className="size-10 text-white-primary" />
                            <p className="text-white-primary font-bold text-xl">Hardware NFC</p>
                        </div>
                        <div className="w-full">
                            <Label className="text-white-primary uppercase" htmlFor="nfcUid">
                                Código de identificación digital
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text" maxLength={50} required
                                    placeholder="00 : 00 : 00 : 00"
                                    id="nfcUid"
                                    value={formDataStudent.nfcUid}
                                    onChange={handleChangeStudent}
                                    // En edición podrías deshabilitar si no quieres permitir reasignación:
                                    // readOnly={isEdit}
                                />
                                <Button
                                    type="button"
                                    className="size-fit bg-white-primary border-white hover:bg-white-primary/80"
                                    onClick={() => setFormDataStudent(prev => ({ ...prev, nfcUid: "" }))}
                                >
                                    <IconRefresh className="size-7 text-blue-primary" />
                                </Button>
                            </div>
                        </div>
                        <p className="font-medium text-white/80 mt-8">
                            Mantenga la tarjeta cerca del lector para vinculación automática.
                        </p>
                    </div>

                    {/* ── Representante ── */}
                    <div className="bg-white-primary border border-gray-200 col-span-full rounded-primary p-7 grid grid-cols-6 gap-7">
                        <div className="col-span-full flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <IconBinaryTree2 className="text-blue-primary" />
                                <h5 className="font-bold text-xl text-blue-primary">Datos del representante</h5>
                            </div>
                            <Badge color="gray">Opcional</Badge>
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="parentFirstName">Nombre del representante</Label>
                            <Input
                                minLength={2} maxLength={255} type="text"
                                placeholder="Nombres completos"
                                id="parentFirstName"
                                value={formDataParent.parentFirstName}
                                onChange={handleChangeParent}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="parentLastName">Apellido del representante</Label>
                            <Input
                                minLength={2} maxLength={255} type="text"
                                placeholder="Apellidos completos"
                                id="parentLastName"
                                value={formDataParent.parentLastName}
                                onChange={handleChangeParent}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="parentCdl">Cédula / Identificación</Label>
                            <Input
                                minLength={10} maxLength={10} type="text"
                                placeholder="17xxxxxxxx"
                                id="parentCdl"
                                value={formDataParent.parentCdl}
                                onChange={handleChangeParent}
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="parentPhoneNumber">Teléfono de contacto</Label>
                            <Input
                                type="text" maxLength={10} minLength={10}
                                placeholder="+593 9..."
                                id="parentPhoneNumber"
                                value={formDataParent.parentPhoneNumber}
                                onChange={handleChangeParent}
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="parentEmail">Correo Electrónico</Label>
                            <Input
                                maxLength={255} type="email"
                                placeholder="representante@ejemplo.com"
                                id="parentEmail"
                                value={formDataParent.parentEmail}
                                onChange={handleChangeParent}
                            />
                        </div>
                    </div>

                </form>
            </div>
        </>
    );
}