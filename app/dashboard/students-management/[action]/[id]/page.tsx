



"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { course } from "@/types/courses";
import { IconAlertCircle, IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    params: Promise<{
        action: 'create' | 'edit';
        id: string;
    }>;
}

// ── Algoritmo dígito verificador cédula ecuatoriana ───────────────────────────
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

// ── Tipos de errores ──────────────────────────────────────────────────────────
interface StudentErrors {
    studentFirstName?: string;
    studentLastName?: string;
    studentCdl?: string;
    studentPhoneNumber?: string;
    studentEmail?: string;
    nfcUid?: string;
    courseId?: string;
}

interface ParentErrors {
    parentFirstName?: string;
    parentLastName?: string;
    parentCdl?: string;
    parentPhoneNumber?: string;
    parentEmail?: string;
}

// ── Helper: error inline ──────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="text-red-500 mt-1 flex items-center gap-1">
            <IconAlertCircle className="size-4 shrink-0" />
            {message}
        </p>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
    return (
        <>
        <div className="bg-gray-200 h-140 rounded-primary col-span-2 row-span-2"></div>
        <div className="bg-gray-200 rounded-primary "></div>
        <div className="bg-gray-200 rounded-primary "></div>
        <div className="bg-gray-200 h-80 rounded-primary col-span-full"></div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CreateStudentsPage({ params }: Props) {

    const router = useRouter();


    const { action, id } = use(params);
    const isEdit = action === 'edit';

    const [isLoadingData, setIsLoadingData] = useState(isEdit);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
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

    // ── Errores por campo ─────────────────────────────────────────────────
    const [studentErrors, setStudentErrors] = useState<StudentErrors>({});
    const [parentErrors, setParentErrors] = useState<ParentErrors>({});

    // ── Carga de cursos ───────────────────────────────────────────────────
    useEffect(() => {
        async function loadCourses() {
            try {
                const response = await axios.get('/api/coursesc');
                if (response.data.success) setCourses(response.data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('No se pudieron cargar los cursos');
            } finally {
                setIsLoadingCourses(false);
            }
        }
        loadCourses();
    }, []);

    // ── Carga en modo edición ─────────────────────────────────────────────
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

                if (d.parent_id) {
                    setFormDataParent({
                        parentFirstName: d.parent_name?.split(' ')[0] ?? "",
                        parentLastName: d.parent_name?.split(' ').slice(1).join(' ') ?? "",
                        parentCdl: "",
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

    // ── Handlers con limpieza de error al escribir ────────────────────────
    const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormDataStudent(prev => ({ ...prev, [id]: value }));
        if (studentErrors[id as keyof StudentErrors]) {
            setStudentErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleChangeParent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormDataParent(prev => ({ ...prev, [id]: value }));
        if (parentErrors[id as keyof ParentErrors]) {
            setParentErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleCourseChange = (value: string) => {
        setCourseId(value);
        if (studentErrors.courseId) {
            setStudentErrors(prev => ({ ...prev, courseId: undefined }));
        }
    };

    // ── Validación ────────────────────────────────────────────────────────
    function validate(): boolean {
        const sErr: StudentErrors = {};
        const pErr: ParentErrors = {};
        const telRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

        // — Nombre del estudiante
        const fn = formDataStudent.studentFirstName.trim();
        if (!fn) {
            sErr.studentFirstName = "El nombre es obligatorio.";
        } else if (fn.length < 2) {
            sErr.studentFirstName = "El nombre debe tener al menos 2 caracteres.";
        } else if (!nameRegex.test(fn)) {
            sErr.studentFirstName = "El nombre solo debe contener letras.";
        }

        // — Apellido del estudiante
        const ln = formDataStudent.studentLastName.trim();
        if (!ln) {
            sErr.studentLastName = "El apellido es obligatorio.";
        } else if (ln.length < 2) {
            sErr.studentLastName = "El apellido debe tener al menos 2 caracteres.";
        } else if (!nameRegex.test(ln)) {
            sErr.studentLastName = "El apellido solo debe contener letras.";
        }

        // — Cédula del estudiante
        const cdl = formDataStudent.studentCdl.trim();
        if (!cdl) {
            sErr.studentCdl = "La cédula es obligatoria.";
        } else if (!/^\d{10}$/.test(cdl)) {
            sErr.studentCdl = "La cédula debe tener exactamente 10 dígitos.";
        } else if (!validarCedula(cdl)) {
            sErr.studentCdl = "La cédula ingresada no es válida.";
        }

        // — Teléfono del estudiante (opcional)
        const tel = formDataStudent.studentPhoneNumber.trim();
        if (tel && !telRegex.test(tel)) {
            sErr.studentPhoneNumber = "El teléfono debe tener exactamente 10 dígitos.";
        }

        // — Email del estudiante
        const email = formDataStudent.studentEmail.trim();
        if (!email) {
            sErr.studentEmail = "El correo electrónico es obligatorio.";
        } else if (!emailRegex.test(email)) {
            sErr.studentEmail = "Ingresa un correo electrónico válido.";
        }

        // — NFC
        if (!formDataStudent.nfcUid.trim()) {
            sErr.nfcUid = "Debes vincular una tarjeta NFC.";
        }

        // — Curso
        if (!courseId) {
            sErr.courseId = "Debes asignar un curso al estudiante.";
        }

        // — Representante (validar solo si algún campo está lleno)
        const parentFilled = Object.values(formDataParent).some(v => v.trim() !== "");
        if (parentFilled) {
            const pfn = formDataParent.parentFirstName.trim();
            if (!pfn) {
                pErr.parentFirstName = "El nombre del representante es obligatorio.";
            } else if (!nameRegex.test(pfn)) {
                pErr.parentFirstName = "Solo debe contener letras.";
            }

            const pln = formDataParent.parentLastName.trim();
            if (!pln) {
                pErr.parentLastName = "El apellido del representante es obligatorio.";
            } else if (!nameRegex.test(pln)) {
                pErr.parentLastName = "Solo debe contener letras.";
            }

            const pcdl = formDataParent.parentCdl.trim();
            if (!pcdl) {
                pErr.parentCdl = "La cédula del representante es obligatoria.";
            } else if (!/^\d{10}$/.test(pcdl)) {
                pErr.parentCdl = "La cédula debe tener exactamente 10 dígitos.";
            } else if (!validarCedula(pcdl)) {
                pErr.parentCdl = "La cédula del representante no es válida.";
            }

            const ptel = formDataParent.parentPhoneNumber.trim();
            if (ptel && !telRegex.test(ptel)) {
                pErr.parentPhoneNumber = "El teléfono debe tener exactamente 10 dígitos.";
            }

            const pemail = formDataParent.parentEmail.trim();
            if (!pemail) {
                pErr.parentEmail = "El correo del representante es obligatorio.";
            } else if (!emailRegex.test(pemail)) {
                pErr.parentEmail = "Ingresa un correo electrónico válido.";
            }
        }

        setStudentErrors(sErr);
        setParentErrors(pErr);

        const hasErrors = Object.keys(sErr).length > 0 || Object.keys(pErr).length > 0;
        if (hasErrors) toast.error("Por favor corrige los errores antes de continuar.");
        return !hasErrors;
    }

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const parentFilled = Object.values(formDataParent).some(v => v.trim() !== "");

        const payload = {
            first_name: formDataStudent.studentFirstName.trim(),
            last_name: formDataStudent.studentLastName.trim(),
            cdl: formDataStudent.studentCdl.trim(),
            email: formDataStudent.studentEmail.trim(),
            course_id: courseId,
            nfc_uid: formDataStudent.nfcUid.trim(),
            phone_number: formDataStudent.studentPhoneNumber.trim(),
            ...(parentFilled && {
                parent: {
                    first_name: formDataParent.parentFirstName.trim(),
                    last_name: formDataParent.parentLastName.trim(),
                    cdl: formDataParent.parentCdl.trim(),
                    email: formDataParent.parentEmail.trim(),
                    username: formDataParent.parentEmail.split('@')[0],
                    password: formDataParent.parentCdl.trim(),
                    phone_number: formDataParent.parentPhoneNumber.trim(),
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
            router.push('/dashboard/students-management');

        } catch (error: any) {
            const msg = error?.response?.data?.message;
            toast.error(msg || `No se pudo ${isEdit ? 'actualizar' : 'crear'} al estudiante`);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────
    if (isLoadingData || isLoadingCourses) return <PageSkeleton />;

    // ─────────────────────────────────────────────────────────────────────

    return (
        <>

            <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] col-span-full">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="col-span-full grid grid-cols-3 gap-7"
                >
                    {/* <div className="col-span-full flex justify-between my-2">
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
                            <Button variant="outline" onClick={() => router.push('/dashboard/students-management')}>Cancelar</Button>
                            <Button type="submit">
                                {isEdit ? 'Guardar cambios' : 'Registrar nuevo estudiante'}
                            </Button>
                        </div>
                    </div> */}

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

                            {/* Nombre */}
                            <div>
                                <Label htmlFor="studentFirstName">
                                    Nombre del estudiante <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    maxLength={255}
                                    placeholder="Nombres completos"
                                    id="studentFirstName"
                                    type="text"
                                    value={formDataStudent.studentFirstName}
                                    onChange={handleChangeStudent}
                                    className={studentErrors.studentFirstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                <FieldError message={studentErrors.studentFirstName} />
                            </div>

                            {/* Apellido */}
                            <div>
                                <Label htmlFor="studentLastName">
                                    Apellido del estudiante <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    maxLength={255}
                                    placeholder="Apellidos completos"
                                    id="studentLastName"
                                    type="text"
                                    value={formDataStudent.studentLastName}
                                    onChange={handleChangeStudent}
                                    className={studentErrors.studentLastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                <FieldError message={studentErrors.studentLastName} />
                            </div>

                            {/* Cédula */}
                            <div>
                                <Label htmlFor="studentCdl">
                                    Cédula / Identificación <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    maxLength={10}
                                    placeholder="17xxxxxxxx"
                                    id="studentCdl"
                                    type="text"
                                    value={formDataStudent.studentCdl}
                                    onChange={handleChangeStudent}
                                    className={studentErrors.studentCdl ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                <FieldError message={studentErrors.studentCdl} />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <Label htmlFor="studentPhoneNumber">Teléfono de contacto</Label>
                                <Input
                                    maxLength={10}
                                    placeholder="+593 9..."
                                    id="studentPhoneNumber"
                                    type="text"
                                    value={formDataStudent.studentPhoneNumber}
                                    onChange={handleChangeStudent}
                                    className={studentErrors.studentPhoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                <FieldError message={studentErrors.studentPhoneNumber} />
                            </div>

                            {/* Email */}
                            <div className="col-span-full">
                                <Label htmlFor="studentEmail">
                                    Correo Electrónico <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    maxLength={255}
                                    type="email"
                                    placeholder="estudiante@ejemplo.com"
                                    id="studentEmail"
                                    value={formDataStudent.studentEmail}
                                    onChange={handleChangeStudent}
                                    className={studentErrors.studentEmail ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                <FieldError message={studentErrors.studentEmail} />
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
                            <Select value={courseId} onValueChange={handleCourseChange}>
                                <SelectTrigger className={studentErrors.courseId ? "border-red-500 focus:ring-red-500" : ""}>
                                    <SelectValue placeholder="Sin asignar curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses?.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.course_name} - {c.section_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError message={studentErrors.courseId} />
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
                                    type="text"
                                    maxLength={50}
                                    placeholder="00 : 00 : 00 : 00"
                                    id="nfcUid"
                                    value={formDataStudent.nfcUid}
                                    onChange={handleChangeStudent}
                                    className={studentErrors.nfcUid ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                <Button
                                    type="button"
                                    className="size-fit bg-white-primary border-white hover:bg-white-primary/80"
                                    onClick={() => {
                                        setFormDataStudent(prev => ({ ...prev, nfcUid: "" }));
                                        setStudentErrors(prev => ({ ...prev, nfcUid: undefined }));
                                    }}
                                >
                                    <IconRefresh className="size-7 text-blue-primary" />
                                </Button>
                            </div>
                            {/* Error en blanco para que sea visible sobre fondo azul */}
                            {studentErrors.nfcUid && (
                                <p className="text-white/90 text-sm mt-1 flex items-center gap-1">
                                    <IconAlertCircle className="size-4 shrink-0" />
                                    {studentErrors.nfcUid}
                                </p>
                            )}
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

                        {/* Nombre representante */}
                        <div className="col-span-2">
                            <Label htmlFor="parentFirstName">Nombre del representante</Label>
                            <Input
                                maxLength={255}
                                type="text"
                                placeholder="Nombres completos"
                                id="parentFirstName"
                                value={formDataParent.parentFirstName}
                                onChange={handleChangeParent}
                                className={parentErrors.parentFirstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={parentErrors.parentFirstName} />
                        </div>

                        {/* Apellido representante */}
                        <div className="col-span-2">
                            <Label htmlFor="parentLastName">Apellido del representante</Label>
                            <Input
                                maxLength={255}
                                type="text"
                                placeholder="Apellidos completos"
                                id="parentLastName"
                                value={formDataParent.parentLastName}
                                onChange={handleChangeParent}
                                className={parentErrors.parentLastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={parentErrors.parentLastName} />
                        </div>

                        {/* Cédula representante */}
                        <div className="col-span-2">
                            <Label htmlFor="parentCdl">Cédula / Identificación</Label>
                            <Input
                                maxLength={10}
                                type="text"
                                placeholder="17xxxxxxxx"
                                id="parentCdl"
                                value={formDataParent.parentCdl}
                                onChange={handleChangeParent}
                                className={parentErrors.parentCdl ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={parentErrors.parentCdl} />
                        </div>

                        {/* Teléfono representante */}
                        <div className="col-span-3">
                            <Label htmlFor="parentPhoneNumber">Teléfono de contacto</Label>
                            <Input
                                type="text"
                                maxLength={10}
                                placeholder="+593 9..."
                                id="parentPhoneNumber"
                                value={formDataParent.parentPhoneNumber}
                                onChange={handleChangeParent}
                                className={parentErrors.parentPhoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={parentErrors.parentPhoneNumber} />
                        </div>

                        {/* Email representante */}
                        <div className="col-span-3">
                            <Label htmlFor="parentEmail">Correo Electrónico</Label>
                            <Input
                                maxLength={255}
                                type="email"
                                placeholder="representante@ejemplo.com"
                                id="parentEmail"
                                value={formDataParent.parentEmail}
                                onChange={handleChangeParent}
                                className={parentErrors.parentEmail ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={parentErrors.parentEmail} />
                        </div>
                    </div>

<div className="col-span-full flex items-center justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => router.push('/dashboard/students-management')}>Cancelar</Button>
                    <Button type="submit">
                        {isEdit ? 'Guardar cambios' : 'Registrar nuevo estudiante'}
                    </Button>
</div>

                </form>
            </div>
        </>
    );
}