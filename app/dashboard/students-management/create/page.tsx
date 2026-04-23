"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sections } from "@/lib/constants/data-type";
import { useCreateStudent } from "@/lib/hooks/fetch/students";
import { useCourseList } from "@/lib/hooks/fetch/system/courses";
import { IconBinaryTree, IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";



type FormState = {
    firstName: string;
    lastName: string;
    cdl: string;
    email: string;
    phoneNumber: string;
    nfc: string;
    courseId: string | null;

    parent: {
        firstName: string;
        lastName: string;
        cdl: string;
        email: string;
        phoneNumber: string;
    };
};

export default function CreateStudentsPage() {

    const { data: coursesList, isLoading: loadingCoursesList } = useCourseList();


    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        cdl: "",
        email: "",
        phoneNumber: "",
        nfc: "",
        courseId: null,

        parent: {
            firstName: "",
            lastName: "",
            cdl: "",
            email: "",
            phoneNumber: "",
        },
    });

    const { mutate, isPending } = useCreateStudent();


    return (


        <>
            <div className="col-span-full grid grid-cols-3 gap-7">

                <div className="col-span-full flex justify-between my-2">

                    <div>
                        <h3 className="text-4xl text-blue-primary font-extrabold">Nuevo Registro</h3>
                        <p className="font-medium text-black-secondary">Inscripción de un nuevo estudiante en el sistema institucional.</p>
                    </div>

                    <div className="flex gap-2 items-center">
                        <Link href="./">
                            <Button
                                variant="outline"
                            >
                                Cancelar
                            </Button>
                        </Link>

                        <Button
                            onClick={() => {

                                if (!form.firstName || !form.cdl || !form.email) {
                                    alert("Faltan campos obligatorios");
                                    return;
                                }

                                const hasParent =
                                    form.parent.firstName &&
                                    form.parent.lastName &&
                                    form.parent.cdl;

                                console.log(form)

                                mutate({
                                    firstName: form.firstName,
                                    lastName: form.lastName,
                                    cdl: form.cdl,
                                    email: form.email,
                                    phoneNumber: form.phoneNumber,
                                    nfc: form.nfc,
                                    courseId: form.courseId ? Number(form.courseId) : null,

                                    parent: hasParent
                                        ? {
                                            firstName: form.parent.firstName,
                                            lastName: form.parent.lastName,
                                            cdl: form.parent.cdl,
                                            email: form.parent.email,
                                            phoneNumber: form.parent.phoneNumber,
                                        }
                                        : null,
                                });
                            }}

                            disabled={isPending}
                        >
                            {isPending ? "Guardando..." : "Guardar Registro"}
                        </Button>

                    </div>

                </div>

                <div className="bg-white-primary col-span-2 row-span-2 rounded-primary p-7">

                    <div className="grid grid-cols-2 gap-7">
                        <div className="col-span-full flex justify-between items-center">

                            <div className="flex items-center gap-2 text-2xl">
                                <IconIdBadge2 className="size-10 text-blue-primary" />
                                <p className="text-blue-primary font-bold">Datos del Estudiante</p>
                            </div>

                            <Badge color="blue">
                                Requerido
                            </Badge>

                        </div>

                        <div>
                            <Label
                                htmlFor="name"
                            >Nombre del estudiante</Label>
                            <Input
                                placeholder="Ej. Juan Andres"
                                id="name"
                                onChange={(e) =>
                                    setForm({ ...form, firstName: e.target.value })
                                }
                            />

                        </div>

                        <div>
                            <Label
                                htmlFor="lastname"
                            >Apellido del estudiante</Label>
                            <Input
                                placeholder="Pérez García"
                                id="lastname"
                                onChange={(e) =>
                                    setForm({ ...form, lastName: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="id"
                            >Cédula / Identificación</Label>
                            <Input
                                placeholder="17xxxxxxx-x"
                                id="id"
                                onChange={(e) =>
                                    setForm({ ...form, cdl: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="phonenumber"
                            >Teléfono de contacto</Label>
                            <Input
                                placeholder="+593 9..."
                                id="phonenumber"
                                onChange={(e) =>
                                    setForm({ ...form, phoneNumber: e.target.value })
                                }
                            />
                        </div>

                        <div className="col-span-full">
                            <Label
                                htmlFor="email"
                            >Correo Electrónico</Label>
                            <Input
                                placeholder="estudiante@ejemplo.edu.ec"
                                id="email"
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>
                    </div>

                </div>

                <div className="bg-white-primary rounded-primary p-7 space-y-7">

                    <div className="col-span-full flex justify-between items-center">

                        <div className="flex items-center gap-2 text-2xl">
                            <IconSchool className="size-10 text-blue-primary" />
                            <p className="text-blue-primary font-bold">Información de registro</p>
                        </div>

                    </div>

                    <Label>Curso / Nivel</Label>
                    <Select
                        onValueChange={(value) =>
                            setForm({ ...form, courseId: value })
                        }
                        value={form.courseId?.toString() || ""}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sin asignar curso" />
                        </SelectTrigger>
                        <SelectContent>
                            {coursesList?.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {c.courseName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>


                <div className="bg-blue-primary rounded-primary p-7">

                    <div className="flex items-center gap-2 mb-6">
                        <IconNfc className="size-10 text-white-primary" />
                        <p className="text-white-primary font-bold text-xl">Hardware NFC</p>
                    </div>
                    <div className="w-full">
                        <Label
                            className="text-white-primary uppercase"
                            htmlFor="email"
                        >Código de identificación digital</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="00 : 00 : 00 : 00"
                                value={form.nfc}
                                onChange={(e) =>
                                    setForm({ ...form, nfc: e.target.value })
                                }
                            />
                            <Button className="size-fit bg-white-primary border-white">
                                <IconRefresh className="size-7 text-blue-primary" />
                            </Button>
                        </div>
                    </div>

                    <p className="font-medium text-white/80 mt-8">Mantenga la tarjeta cerca del lector para vinculación automática.</p>

                </div>

                <div className="bg-white-primary col-span-full rounded-primary p-7 grid grid-cols-6 gap-7">

                    <div className="col-span-full flex justify-between items-center">

                        <div className="flex items-center gap-2 text-2xl">
                            <IconBinaryTree2 className="size-10 text-blue-primary" />
                            <p className="text-blue-primary font-bold">Datos del Representante</p>
                        </div>

                        <Badge color="gray">
                            Opcional
                        </Badge>

                    </div>


                    <div className="col-span-2">
                        <Label
                            htmlFor="parentname"
                        >Nombre del representante</Label>
                        <Input
                            placeholder="Nombres completos"
                            id="parentname"
                            value={form.parent.firstName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    parent: { ...form.parent, firstName: e.target.value }
                                })
                            }
                        />
                    </div>

                    <div className="col-span-2">
                        <Label
                            htmlFor="parentlastname"
                        >Apellido del representante</Label>
                        <Input
                            placeholder="Apellidos completos"
                            id="parentlastname"
                            value={form.parent.lastName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    parent: { ...form.parent, lastName: e.target.value }
                                })
                            }
                        />
                    </div>

                    <div className="col-span-2">
                        <Label
                            htmlFor="parentid"
                        >Cédula / Identificación</Label>
                        <Input
                            placeholder="17xxxxxxx-x"
                            id="parentid"
                            value={form.parent.cdl}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    parent: { ...form.parent, cdl: e.target.value }
                                })
                            }
                        />
                    </div>

                    <div className="col-span-3">
                        <Label
                            htmlFor="parent"
                        >Correo Electrónico</Label>
                        <Input
                            placeholder="representante@ejemplo.com"
                            id="parent"
                            value={form.parent.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    parent: { ...form.parent, email: e.target.value }
                                })
                            }
                        />
                    </div>

                    <div className="col-span-3">
                        <Label
                            htmlFor="parentphonenumber"
                        >Télefono de contacto</Label>
                        <Input
                            value={form.parent.phoneNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    parent: { ...form.parent, phoneNumber: e.target.value }
                                })
                            }
                            placeholder="+593 9..."
                            id="parentphonenumber"
                        />
                    </div>

                </div>

            </div>

        </>
    );
}
