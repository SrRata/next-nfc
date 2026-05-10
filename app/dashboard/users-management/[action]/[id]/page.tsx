// "use client"

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { course } from "@/types/courses";
// import { IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
// import axios from "axios";
// import { fi } from "date-fns/locale";
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

//     const [processing, setProcessing] = useState(false);


//     const [formData, setFormData] = useState({
//         first_name: "",
//         last_name: "",
//         cdl: "",
//         phone_number: "",
//         email: "",
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
//         const loadingToast = toast.loading(isEdit ? 'Actualizando usuario...' : 'Creando usuario...');
//         setProcessing(true);

//         const payload = {
//             first_name: formData.first_name,
//             last_name: formData.last_name,
//             username: `user_${formData.cdl}`,
//             password: formData.cdl,
//             cdl: formData.cdl,
//             phone_number: formData.phone_number,
//             email: formData.email,
//             role: role
//         };

//         try {
//             if (isEdit) {
//                 await axios.put(`/api/usersc/${id}`, payload); // Usar PUT para editar
//                 toast.success('Usuario actualizado con éxito', { id: loadingToast });
//             } else {
//                 await axios.post('/api/usersc', payload);
//                 toast.success('Usuario creado con éxito', { id: loadingToast });
//             }
//         } catch (error) {
//             toast.error('Error al procesar la solicitud', { id: loadingToast });
//         } finally {
//             setProcessing(false);
//         }
//     };

//     const [role, setRole] = useState('');


//     return (

//         <>
//             <form className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] items-start col-span-full w-full" onSubmit={handleSubmit}>

//                 <div

//                     className="col-span-2">

//                     <div className="bg-white-primary col-span-2 row-span-2 rounded-primary p-7 border border-gray-200">

//                         <div className="grid grid-cols-2 gap-7">
//                             <div className="col-span-full flex justify-between items-center">
//                                 <div className="flex items-center gap-2 col-span-full">
//                                     <IconIdBadge2 className="text-blue-primary" />
//                                     <h5 className="font-bold text-xl text-blue-primary">Detalles del usuario</h5>
//                                 </div>

//                             </div>

//                             <div>
//                                 <Label
//                                     htmlFor="studentFirstName"
//                                 >Nombres completos <span className="text-red-500">*</span></Label>
//                                 <Input
//                                     minLength={2}
//                                     maxLength={255}
//                                     required
//                                     placeholder="Nombres completos"
//                                     id="first_name"
//                                     type="text"
//                                     value={formData.first_name || ""}
//                                     onChange={handleChangeForm}
//                                 />

//                             </div>

//                             <div>
//                                 <Label
//                                     htmlFor="studentLastName"
//                                 >Apellidos completos <span className="text-red-500">*</span></Label>
//                                 <Input
//                                     required
//                                     minLength={2}
//                                     maxLength={255}
//                                     placeholder="Apelldios completos"
//                                     id="last_name"
//                                     type="text"
//                                     value={formData.last_name || ""}
//                                     onChange={handleChangeForm}
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
//                                     id="cdl"
//                                     type="text"
//                                     value={formData.cdl || ""}
//                                     onChange={handleChangeForm}
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
//                                     id="phone_number"
//                                     type="text"
//                                     value={formData.phone_number || ""}
//                                     onChange={handleChangeForm}
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
//                                     id="email"
//                                     value={formData.email || ""}
//                                     onChange={handleChangeForm}
//                                 />
//                             </div>
//                         </div>

//                     </div>

//                 </div>

//                 <RadioGroup
//                     value={role}          
//                     onValueChange={setRole}
//                 >
//                     <Label htmlFor="admin">
//                         <div className="border border-gray-200 rounded-primary p-7 bg-white-primary has-data-checked:border-gray-500 w-full ">
//                             <p>
//                                 Administrador
//                             </p>
//                             <RadioGroupItem value="admin" id="admin" className="sr-only" />
//                         </div>
//                     </Label>
//                     <Label htmlFor="profesor">
//                         <div className="border border-gray-200 rounded-primary p-7 bg-white-primary has-data-checked:border-gray-500 w-full ">
//                             <p>
//                                 Profesor
//                             </p>
//                             <RadioGroupItem value="profesor" id="profesor" className="sr-only" />
//                         </div>
//                     </Label>
//                     <Label htmlFor="usuario">
//                         <div className="border border-gray-200 rounded-primary p-7 bg-white-primary has-data-checked:border-gray-500 w-full ">
//                             <p>
//                                 Usuario
//                             </p>
//                             <RadioGroupItem value="usuario" id="usuario" className="sr-only" />
//                         </div>
//                     </Label>

//                 </RadioGroup>


//                 <div className="flex gap-2 items-center col-span-full justify-end">
//                     <Link href="./">
//                         <Button
//                             variant="outline"
//                         >
//                             Cancelar registro
//                         </Button>
//                     </Link>

//                     <Button type="submit">
//                         Registrar nuevo estudiante
//                     </Button>

//                 </div>
//             </form>

//         </>
//     );
// }




"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { IconAlertCircle, IconIdBadge2, IconSchool, IconSettings, IconShieldCheck, IconUser } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

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

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface FormErrors {
    first_name?: string;
    last_name?: string;
    cdl?: string;
    phone_number?: string;
    email?: string;
    role?: string;
}

type Role = 'admin' | 'profesor' | 'usuario';

const ROLES: { value: Role; label: string; description: string; icon: React.ReactNode }[] = [
    {
        value: 'admin',
        label: 'Administrador',
        description: 'Acceso total al sistema, gestión de usuarios y configuración.',
        icon: <IconShieldCheck className="size-6" />,
    },
    {
        value: 'profesor',
        label: 'Profesor',
        description: 'Gestión de su curso, asistencia y seguimiento de estudiantes.',
        icon: <IconSchool className="size-6" />,
    },
    {
        value: 'usuario',
        label: 'Representante',
        description: 'Acceso básico de solo lectura de su representado.',
        icon: <IconUser className="size-6" />,
    },
];

// ── Helper error inline ───────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <IconAlertCircle className="size-4 shrink-0" />
            {message}
        </p>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
    return (
        // <div className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] items-start col-span-full w-full">
        //     <div className="col-span-2 bg-white-primary rounded-primary p-7 border border-gray-200 space-y-5">
        //         <div className="flex items-center gap-2">
        //             <Skeleton className="size-5 rounded" />
        //             <Skeleton className="h-5 w-40 rounded" />
        //         </div>
        //         <div className="grid grid-cols-2 gap-5">
        //             {[...Array(5)].map((_, i) => (
        //                 <div key={i} className={`space-y-2 ${i === 4 ? 'col-span-full' : ''}`}>
        //                     <Skeleton className="h-4 w-32 rounded" />
        //                     <Skeleton className="h-10 w-full rounded-md" />
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        //     <div className="space-y-3">
        //         {[...Array(3)].map((_, i) => (
        //             <Skeleton key={i} className="h-28 w-full rounded-primary" />
        //         ))}
        //     </div>
        //     <div className="col-span-full flex justify-end gap-2">
        //         <Skeleton className="h-10 w-32 rounded-md" />
        //         <Skeleton className="h-10 w-44 rounded-md" />
        //     </div>
        // </div>

        <>
        <div className="bg-gray-200 border-primary h-120 col-span-2"></div>
        <div className="bg-gray-200 border-primary h-120"></div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CreateUsersPage({ params }: Props) {

    const router = useRouter();


    const { action, id } = use(params);
    const isEdit = action === 'edit';

    const [isLoadingData, setIsLoadingData] = useState(isEdit);
    const [processing, setProcessing] = useState(false);
    const [role, setRole] = useState<Role | ''>('');

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        cdl: "",
        phone_number: "",
        email: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // ── Carga en modo edición ─────────────────────────────────────────────
    useEffect(() => {
        if (!isEdit || !id) return;

        async function loadUser() {
            try {
                const response = await axios.get(`/api/usersc/${id}`);
                if (!response.data.success) throw new Error('No encontrado');
                const d = response.data.data;

                setFormData({
                    first_name: d.first_name ?? "",
                    last_name: d.last_name ?? "",
                    cdl: d.cdl ?? "",
                    phone_number: d.phone_number ?? "",
                    email: d.email ?? "",
                });
                if (d.role) setRole(d.role as Role);
            } catch (error) {
                console.error('Error loading user:', error);
                toast.error('No se pudo cargar la información del usuario');
            } finally {
                setIsLoadingData(false);
            }
        }
        loadUser();
    }, [isEdit, id]);

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleRoleChange = (value: Role) => {
        setRole(value);
        if (errors.role) setErrors(prev => ({ ...prev, role: undefined }));
    };

    // ── Validación ────────────────────────────────────────────────────────
    function validate(): boolean {
        const newErrors: FormErrors = {};
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telRegex = /^\d{10}$/;

        // Nombre
        const fn = formData.first_name.trim();
        if (!fn) {
            newErrors.first_name = "El nombre es obligatorio.";
        } else if (fn.length < 2) {
            newErrors.first_name = "El nombre debe tener al menos 2 caracteres.";
        } else if (!nameRegex.test(fn)) {
            newErrors.first_name = "El nombre solo debe contener letras.";
        }

        // Apellido
        const ln = formData.last_name.trim();
        if (!ln) {
            newErrors.last_name = "El apellido es obligatorio.";
        } else if (ln.length < 2) {
            newErrors.last_name = "El apellido debe tener al menos 2 caracteres.";
        } else if (!nameRegex.test(ln)) {
            newErrors.last_name = "El apellido solo debe contener letras.";
        }

        // Cédula
        const cdl = formData.cdl.trim();
        if (!cdl) {
            newErrors.cdl = "La cédula es obligatoria.";
        } else if (!/^\d{10}$/.test(cdl)) {
            newErrors.cdl = "La cédula debe tener exactamente 10 dígitos.";
        } else if (!validarCedula(cdl)) {
            newErrors.cdl = "La cédula ingresada no es válida.";
        }

        // Teléfono (opcional)
        const tel = formData.phone_number.trim();
        if (tel && !telRegex.test(tel)) {
            newErrors.phone_number = "El teléfono debe tener exactamente 10 dígitos.";
        }

        // Email
        const email = formData.email.trim();
        if (!email) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Ingresa un correo electrónico válido.";
        }

        // Rol
        if (!role) {
            newErrors.role = "Debes seleccionar un tipo de usuario.";
        }

        setErrors(newErrors);
        const hasErrors = Object.keys(newErrors).length > 0;
        if (hasErrors) toast.error("Por favor corrige los errores antes de continuar.");
        return !hasErrors;
    }

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const loadingToast = toast.loading(isEdit ? 'Actualizando usuario...' : 'Creando usuario...');
        setProcessing(true);

        const payload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            username: `user_${formData.cdl.trim()}`,
            password: formData.cdl.trim(),
            cdl: formData.cdl.trim(),
            phone_number: formData.phone_number.trim(),
            email: formData.email.trim(),
            role,
        };

        try {
            if (isEdit) {
                await axios.put(`/api/usersc/${id}`, payload);
                toast.success('Usuario actualizado con éxito', { id: loadingToast });
            } else {
                await axios.post('/api/usersc', payload);
                toast.success('Usuario creado con éxito', { id: loadingToast });
            }

            router.push('/dashboard/users-management');


        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Error al procesar la solicitud';
            toast.error(msg, { id: loadingToast });
        } finally {
            setProcessing(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────
    if (isLoadingData) return <PageSkeleton />;

    // ─────────────────────────────────────────────────────────────────────

    return (
        <>
            <form
                onSubmit={handleSubmit}
                noValidate
                className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] items-start col-span-full w-full"
            >
                {/* ── Datos del usuario ── */}
                <div className="col-span-2 bg-white-primary rounded-primary p-7 border border-gray-200">
                    <div className="grid grid-cols-2 gap-7">
                        <div className="col-span-full flex items-center gap-2">
                            <IconIdBadge2 className="text-blue-primary" />
                            <h5 className="font-bold text-xl text-blue-primary">Detalles del usuario</h5>
                        </div>

                        {/* Nombre */}
                        <div>
                            <Label htmlFor="first_name">
                                Nombres completos <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                maxLength={255}
                                placeholder="Nombres completos"
                                id="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChangeForm}
                                className={errors.first_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={errors.first_name} />
                        </div>

                        {/* Apellido */}
                        <div>
                            <Label htmlFor="last_name">
                                Apellidos completos <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                maxLength={255}
                                placeholder="Apellidos completos"
                                id="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChangeForm}
                                className={errors.last_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={errors.last_name} />
                        </div>

                        {/* Cédula */}
                        <div>
                            <Label htmlFor="cdl">
                                Cédula / Identificación <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                maxLength={10}
                                placeholder="17xxxxxxxx"
                                id="cdl"
                                type="text"
                                value={formData.cdl}
                                onChange={handleChangeForm}
                                className={errors.cdl ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={errors.cdl} />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <Label htmlFor="phone_number">Teléfono de contacto</Label>
                            <Input
                                maxLength={10}
                                placeholder="+593 9..."
                                id="phone_number"
                                type="text"
                                value={formData.phone_number}
                                onChange={handleChangeForm}
                                className={errors.phone_number ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={errors.phone_number} />
                        </div>

                        {/* Email */}
                        <div className="col-span-full">
                            <Label htmlFor="email">
                                Correo Electrónico <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                maxLength={255}
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                id="email"
                                value={formData.email}
                                onChange={handleChangeForm}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <FieldError message={errors.email} />
                        </div>
                    </div>
                </div>

                {/* ── Selector de rol ── */}
                <div className="space-y-3">

                    {ROLES.map((r) => {
                        const isSelected = role === r.value;
                        return (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => handleRoleChange(r.value)}
                                className={`
                                    w-full text-left rounded-primary p-5 border-2 transition-all duration-200
                                    flex items-start gap-4 cursor-pointer
                                    ${isSelected
                                        ? "border-blue-primary bg-blue-primary shadow-md shadow-blue-primary/20"
                                        : "border-gray-200 bg-white-primary hover:border-blue-primary/30 hover:bg-blue-secondary/20"
                                    }
                                    ${errors.role ? "border-red-400" : ""}
                                `}
                            >
                                {/* Ícono */}
                                <div className={`
                                    shrink-0 size-10 rounded-primary grid place-items-center transition-colors
                                    ${isSelected ? "bg-white/20 text-white" : "bg-blue-secondary text-blue-primary"}
                                `}>
                                    {r.icon}
                                </div>

                                {/* Texto */}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold font-medium leading-tight ${isSelected ? "text-white" : "text-black-primary"}`}>
                                        {r.label}
                                    </p>
                                    <p className={`mt-1 font-medium leading-snug ${isSelected ? "text-white/75" : "text-gray-500"}`}>
                                        {r.description}
                                    </p>
                                </div>

                                {/* Indicador seleccionado */}
                                <div className={`
                                    shrink-0 size-4 rounded-full border-2 mt-0.5 transition-all
                                    ${isSelected
                                        ? "border-white bg-white"
                                        : "border-gray-200 bg-transparent"
                                    }
                                `} />
                            </button>
                        );
                    })}

                    {errors.role && (
                        <p className="text-red-500 text-sm flex items-center gap-1 px-1">
                            <IconAlertCircle className="size-4 shrink-0" />
                            {errors.role}
                        </p>
                    )}
                </div>

                {/* ── Acciones ── */}
                <div className="flex gap-2 items-center col-span-full justify-end">
                    <Button variant="outline" type="button" disabled={processing} onClick={() => router.push('/dashboard/users-management')}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}
                    >
                        {processing
                            ? (isEdit ? 'Guardando...' : 'Registrando...')
                            : (isEdit ? 'Guardar cambios' : 'Registrar usuario')
                        }
                    </Button>
                </div>
            </form>
        </>
    );
}