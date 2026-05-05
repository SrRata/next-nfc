"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { course } from "@/types/courses";
import { IconBinaryTree2, IconIdBadge2, IconNfc, IconRefresh, IconSchool } from "@tabler/icons-react";
import axios from "axios";
import { fi } from "date-fns/locale";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner"



interface Props {
    params: Promise<{
        action: 'create' | 'edit';
        id: string;
    }>;
}


export default function CreateStudentsPage({ params }: Props) {

    const { action, id } = use(params);

    const [processing, setProcessing] = useState(false);


    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        cdl: "",
        phone_number: "",
        email: "",
    })

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        // console.log(formData) //DEBUG
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = action === 'edit';
        const loadingToast = toast.loading(isEdit ? 'Actualizando usuario...' : 'Creando usuario...');
        setProcessing(true);

        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: `user_${formData.cdl}`,
            password: formData.cdl,
            cdl: formData.cdl,
            phone_number: formData.phone_number,
            email: formData.email,
            role: role
        };

        try {
            if (isEdit) {
                await axios.put(`/api/usersc/${id}`, payload); // Usar PUT para editar
                toast.success('Usuario actualizado con éxito', { id: loadingToast });
            } else {
                await axios.post('/api/usersc', payload);
                toast.success('Usuario creado con éxito', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error al procesar la solicitud', { id: loadingToast });
        } finally {
            setProcessing(false);
        }
    };

    const [role, setRole] = useState('');


    return (

        <>
            <form className="grid grid-cols-3 gap-6 mx-auto max-w-[900px] items-start col-span-full w-full" onSubmit={handleSubmit}>

                <div

                    className="col-span-2">

                    <div className="bg-white-primary col-span-2 row-span-2 rounded-primary p-7 border border-gray-200">

                        <div className="grid grid-cols-2 gap-7">
                            <div className="col-span-full flex justify-between items-center">
                                <div className="flex items-center gap-2 col-span-full">
                                    <IconIdBadge2 className="text-blue-primary" />
                                    <h5 className="font-bold text-xl text-blue-primary">Detalles del usuario</h5>
                                </div>

                            </div>

                            <div>
                                <Label
                                    htmlFor="studentFirstName"
                                >Nombres completos <span className="text-red-500">*</span></Label>
                                <Input
                                    minLength={2}
                                    maxLength={255}
                                    required
                                    placeholder="Nombres completos"
                                    id="first_name"
                                    type="text"
                                    value={formData.first_name || ""}
                                    onChange={handleChangeForm}
                                />

                            </div>

                            <div>
                                <Label
                                    htmlFor="studentLastName"
                                >Apellidos completos <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    minLength={2}
                                    maxLength={255}
                                    placeholder="Apelldios completos"
                                    id="last_name"
                                    type="text"
                                    value={formData.last_name || ""}
                                    onChange={handleChangeForm}
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="stuedntCdl"
                                >Cédula / Identificación <span className="text-red-500">*</span></Label>
                                <Input
                                    maxLength={10}
                                    minLength={10}
                                    required
                                    placeholder="17xxxxxxx-x"
                                    id="cdl"
                                    type="text"
                                    value={formData.cdl || ""}
                                    onChange={handleChangeForm}
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="studentPhoneNumber"
                                >Teléfono de contacto </Label>
                                <Input
                                    maxLength={10}
                                    minLength={10}
                                    placeholder="+593 9..."
                                    id="phone_number"
                                    type="text"
                                    value={formData.phone_number || ""}
                                    onChange={handleChangeForm}
                                />
                            </div>

                            <div className="col-span-full">
                                <Label
                                    htmlFor="studentEmail"
                                >Correo Electrónico <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    maxLength={255}
                                    type="email"
                                    placeholder="estudiante@ejemplo.com"
                                    id="email"
                                    value={formData.email || ""}
                                    onChange={handleChangeForm}
                                />
                            </div>
                        </div>

                    </div>

                </div>

                <RadioGroup
                    value={role}          
                    onValueChange={setRole}
                >
                    <Label htmlFor="admin">
                        <div className="border border-gray-200 rounded-primary p-7 bg-white-primary has-data-checked:border-gray-500 w-full ">
                            <p>
                                Administrador
                            </p>
                            <RadioGroupItem value="admin" id="admin" className="sr-only" />
                        </div>
                    </Label>
                    <Label htmlFor="profesor">
                        <div className="border border-gray-200 rounded-primary p-7 bg-white-primary has-data-checked:border-gray-500 w-full ">
                            <p>
                                Profesor
                            </p>
                            <RadioGroupItem value="profesor" id="profesor" className="sr-only" />
                        </div>
                    </Label>
                    <Label htmlFor="usuario">
                        <div className="border border-gray-200 rounded-primary p-7 bg-white-primary has-data-checked:border-gray-500 w-full ">
                            <p>
                                Usuario
                            </p>
                            <RadioGroupItem value="usuario" id="usuario" className="sr-only" />
                        </div>
                    </Label>

                </RadioGroup>


                <div className="flex gap-2 items-center col-span-full justify-end">
                    <Link href="./">
                        <Button
                            variant="outline"
                        >
                            Cancelar registro
                        </Button>
                    </Link>

                    <Button type="submit">
                        Registrar nuevo estudiante
                    </Button>

                </div>
            </form>

        </>
    );
}
