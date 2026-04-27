"use client"

import { InfoCard } from "@/components/info-card";
import { Button } from "@/components/ui/button";
import { Circle, CirclePlus, Pen, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { Section } from "@/types/section";
import { useEffect, useState } from "react";
import axios from "axios";
import { section } from "@/lib/constants/data-type";
import { toast } from "sonner";

interface SectionsManagementProps {
    sections: Section[]
}

export default function SectionsManagement({ sections }: SectionsManagementProps) {

    const [isOpenForm, setIsOpenForm] = useState(false);

    const [formDataSection, setFormDataSection] = useState({
        name: "",
    })

    const handleChangeSection = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDataSection({
            ...formDataSection,
            [e.target.id]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formDataSection.name,
        }

        // console.log(payload) //Debug    

        try {
            await axios.post('/api/sections', payload)
            toast.success(`Seccion creada con exito`)
        } catch (error) {
            console.error('Error create level', error)
            toast.error(`No se pudo crear la sección ${formDataSection.name}`)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/sections/${id}`)
            toast.success(`Seccion ${formDataSection.name} eliminada con exito`)
        } catch (error) {
            console.error('Error delete level', error)
            toast.error(`No se pudo eliminar la sección ${formDataSection.name}`)
        }
    }

    return (
        <div className="space-y-6 bg-white-primary rounded-primary p-6">
            <div>
                <h4 className="font-bold text-2xl text-blue-primary">Secciones</h4>
                <p className="font-medium text-black-primary text-sm">Grupos horarios (Matutina, Vespertina, Nocturna)</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className={`gap-3 bg-gray border border-gray-200 p-6 space-y-2 rounded-primary col-span-full ${isOpenForm ? "" : "hidden"}`}>

                <div>
                    <Label>Nombre de la sección</Label>
                    <Input
                        value={formDataSection.name}
                        onChange={handleChangeSection}
                        id="name"
                        required
                        type="text"
                        placeholder="Ej: Matutina, Vespertina, Nocturna ..."
                    />
                </div>

                <div className="flex items-center gap-3 justify-end col-span-full">
                    <Button
                        onClick={() => setIsOpenForm(false)}
                        type="button"
                        variant="outline">Cancelar</Button>
                    <Button
                        type="submit"
                        variant="outline">Guardar horario</Button>
                </div>


            </form>

            <div className="col-span-full space-y-3">
                {sections.map((e) => (
                    <div className="bg-gray border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-primary p-6 flex items-center justify-between">
                        <div className="flex items-center justify-between gap-5">
                            <Badge color="purple">&nbsp;</Badge>
                            <div>
                                <p className="font-bold text-black-primary capitalize">{e.name}</p>
                                <p className="font-medium text-black-secondary text-sm">ID {e.id} . 2 horario(s)</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <Button
                                onClick={() => handleDelete(e.id)}
                                variant="outline" size="icon">
                                <X />
                            </Button>
                        </div>
                    </div>
                ))}
                <div
                    onClick={() => setIsOpenForm(true)}
                    className="group bg-gray border-3 border-dotted border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-primary p-6 flex items-center justify-center ">
                    <CirclePlus className="size-10 text-gray-300 group-hover:text-gray-400 transition-all  duration-300" />
                </div>
            </div>
        </div>
    )
}