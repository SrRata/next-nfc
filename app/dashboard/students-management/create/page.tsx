"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourseList } from "@/lib/hooks/fetch/system/courses";
import { IconBinaryTree, IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
import { useState } from "react";

export default function CreateStudentsPage() {

    const [courseID, setCourseID] = useState<string | null>(null);

    const { data: coursesList, isLoading: loadingCoursesList } = useCourseList();


    return (
        <>
        <div className="col-span-full grid grid-cols-3 gap-7">

            <div className="col-span-full flex justify-between my-2">

                <div>
                    <h3 className="text-4xl text-blue-primary font-extrabold">Nuevo Registro</h3>
                    <p className="font-medium text-black-secondary">Inscripción de un nuevo estudiante en el sistema institucional.</p>
                </div>

                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                    >
                        Cancelar
                    </Button>
                    <Button
                    >
                        Guardar Registro
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
                            id="name" />
                    </div>

                    <div>
                        <Label
                            htmlFor="lastname"
                        >Apellido del estudiante</Label>
                        <Input
                            placeholder="Pérez García"
                            id="lastname" />
                    </div>

                    <div>
                        <Label
                            htmlFor="id"
                        >Cédula / Identificación</Label>
                        <Input
                            placeholder="17xxxxxxx-x"
                            id="id" />
                    </div>

                    <div>
                        <Label
                            htmlFor="phonenumber"
                        >Teléfono de contacto</Label>
                        <Input
                            placeholder="+593 9..."
                            id="phonenumber" />
                    </div>

                    <div className="col-span-full">
                        <Label
                            htmlFor="email"
                        >Correo Electrónico</Label>
                        <Input
                            placeholder="estudiante@ejemplo.edu.ec"
                            id="email"
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
                <Select onValueChange={setCourseID} value={courseID || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sin asignar curso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Ninguno</SelectItem>
                        {coursesList?.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                                {c.courseName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


                <Label>Paralelo</Label>
                <Select onValueChange={setCourseID} value={courseID || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sin asignar curso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Ninguno</SelectItem>
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
                            className=""
                            type="text"
                            placeholder="00 : 00 : 00 : 00"
                            id="email"
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
                    />
                </div>

                <div className="col-span-2">
                    <Label
                        htmlFor="parentlastname"
                    >Apellido del representante</Label>
                    <Input
                        placeholder="Apellidos completos"
                        id="parentlastname"
                    />
                </div>

                <div className="col-span-2">
                    <Label
                        htmlFor="parentid"
                    >Cédula / Identificación</Label>
                    <Input
                        placeholder="17xxxxxxx-x"
                        id="parentid"
                    />
                </div>

                <div className="col-span-3">
                    <Label
                        htmlFor="parent"
                    >Correo Electrónico</Label>
                    <Input
                        placeholder="representante@ejemplo.com"
                        id="parent"
                    />
                </div>

                <div className="col-span-3">
                    <Label
                        htmlFor="parentphonenumber"
                    >Télefono de contacto</Label>
                    <Input
                        placeholder="+593 9..."
                        id="parentphonenumber"
                    />
                </div>

            </div>

            </div>

        </>
    );
}
