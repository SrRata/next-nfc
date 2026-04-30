"use client"

import { InfoCard } from "@/components/info-card";
import { Button } from "@/components/ui/button";
import { Circle, CirclePlus, Pen, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import SchedulesManagement from "./schedules";
import { useEffect, useState } from "react";
import axios from "axios";
import { educationalLevel } from "@/types/levels";
import { getActiveBadgeColor } from "@/lib/constants/get-badge-color";
import { toast } from "sonner";

interface LevelsManagementProps {
    educationalLevels: educationalLevel[];
}


export default function LevelsManagement({ educationalLevels }: LevelsManagementProps) {

    const [isOpenForm, setIsOpenForm] = useState(false);


    const [formDataLevel, setFormDataLevel] = useState({
        name: "",
    })

    const handleChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDataLevel({
            ...formDataLevel,
            [e.target.id]: e.target.value,
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formDataLevel.name,
        }

        console.log(payload) //Debug    

        try {
            axios.post('/api/educational-levels', payload)
            toast.success(`Nivel educativo ${formDataLevel.name} creado con exito`)
        } catch (erorr) {
            console.error('Error create level', erorr)
            toast.error(`No se pudo crear el nivel educativo ${formDataLevel.name}`)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/educational-levels/${id}`)
            toast.success(`Nivel educativo ${formDataLevel.name} eliminado con exito`)
        } catch (error) {
            console.error('Error delete level', error)
            toast.error(`No se pudo eliminar el nivel educativo ${formDataLevel.name}`)
        }
    }


    return (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 p-6 rounded-primary bg-white-primary">

            <div className="col-span-full">
                <h4 className="font-bold text-2xl text-blue-primary">Niveles educativos</h4>
                <p className="font-medium text-black-primary text-sm">Define los niveles del colegio (Básica, Bachillerato, etc.)</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className={`gap-3 bg-gray border border-gray-200 p-6 space-y-2 rounded-primary col-span-full ${isOpenForm ? "" : "hidden"}`}>

                <div>
                    <Label>Nombre del nivel</Label>
                    <Input
                        value={formDataLevel.name ?? ""}
                        onChange={handleChangeLevel}
                        id="name"
                        required
                        type="text"
                        placeholder="Ej: Educación Básica, Bachillerato ..."
                    />
                </div>

                <div className="flex items-center gap-3 justify-end col-span-full">
                    <Button
                        onClick={() => setIsOpenForm(false)}
                        variant="outline" type="button">Cancelar</Button>
                    <Button variant="outline" type="submit">Guardar horario</Button>
                </div>


            </form>

            <div className="col-span-full space-y-3">

                {educationalLevels.map((e) => (

                    <div className="bg-gray border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-primary p-6 flex items-center justify-between">
                        <div className="flex items-center justify-between gap-5">
                            <Badge color="red">&nbsp;</Badge>
                            <div>
                                <p className="font-bold text-black-primary">{e.name}</p>
                                <p className="font-medium text-black-secondary text-sm">ID {e.id} . 1 horario(s)</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">

                            <Button 
                            onClick={()=> {
                                handleDelete(e.id)
                            }}
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