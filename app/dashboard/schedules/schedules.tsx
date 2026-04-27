"use client"

import { Button } from "@/components/ui/button";
import { Pen, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { Schedule } from "@/types/attendance";
import { educationalLevel } from "@/types/levels";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section } from "@/types/section";
import { toast } from 'sonner';

interface SchedulesManagementProps {
    schedules: Schedule[]
    educationalLevels: educationalLevel[]
    sections: Section[]
}



export default function SchedulesManagement({ schedules, educationalLevels, sections }: SchedulesManagementProps) {

    const [sectionId, setSectionId] = useState<string>("");

    const [educationalLevelId, setEducationalLevelId] = useState<string>("");

    const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

    const [isOpenForm, setIsOpenForm] = useState(false);

    const [formDataSchedule, setFormDataSchedule] = useState({
        entry_time: "",
        exit_time: "",
        entry_tolerance: "10",
        exit_tolerance: "20",
    })

    const handleChangeSchedule = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDataSchedule({
            ...formDataSchedule,
            [e.target.id]: e.target.value,
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let format_entry_time = formDataSchedule.entry_time

        if (format_entry_time && format_entry_time.length === 5) {
            format_entry_time += ":00"
        }

        let format_exit_time = formDataSchedule.exit_time

        if (format_exit_time && format_exit_time.length === 5) {
            format_exit_time += ":00"
        }

        const payload = {
            educational_level_id: educationalLevelId,
            section_id: sectionId,
            entry_time: format_entry_time,
            exit_time: format_exit_time,
            entry_tolerance: formDataSchedule.entry_tolerance,
            exit_tolerance: formDataSchedule.exit_tolerance,
        }

        console.log(payload) //Debug

        try {
            axios.post('/api/schedules', payload)
            toast.success('¡Logrado!')
        } catch (erorr) {
            console.error('Error create schedule', erorr)
        }

    }


    return (

        <div className="space-y-6 p-6 rounded-primary bg-white-primary col-span-2 row-span-3">

            <div className="bg-blue-secondary w-full p-3 pl-6 relative">
                <p className="font-medium text-blue-primary">Los horarios se crean por combinación de nivel educativo + sección. Cada combinación puede tener un único horario base.</p>
                <div className="bg-blue-primary h-full w-1 absolute left-0 top-0"></div>
            </div>

            <div className="flex items-center justify-between col-span-full">
                <div>
                    <h4 className="font-bold text-2xl text-blue-primary">Horarios</h4>
                    <p className="font-medium text-black-primary text-sm">Horario de entrada y salida por nivel y sección</p>
                </div>
                <Button
                    onClick={() => setIsOpenForm(true)}
                >
                    <Plus />
                    Nuevo horario
                </Button>
            </div>

            <form
                onSubmit={handleSubmit}
                className={`bg-gray border border-gray-200 p-6 rounded-primary ${isOpenForm ? "grid" : "hidden"} grid-cols-2 gap-3`}>

                <div>
                    <Label>Nivel educativo</Label>
                    <Select
                        value={educationalLevelId}
                        onValueChange={(value) => {
                            setEducationalLevelId(value)
                        }}
                    >
                        <SelectTrigger className="capitalize">
                            <SelectValue placeholder="Sin asignar curso" />
                        </SelectTrigger>
                        <SelectContent>
                            {educationalLevels?.map((e) => (
                                <SelectItem className="capitalize" key={e.id} value={e.id.toString()}>
                                    {e.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Sección</Label>
                    <Select
                        value={sectionId}
                        onValueChange={(value) => {
                            setSectionId(value)
                        }}
                    >
                        <SelectTrigger className="capitalize">
                            <SelectValue placeholder="Sin asignar sección" />
                        </SelectTrigger>
                        <SelectContent>
                            {sections?.map((e) => (
                                <SelectItem className="capitalize" key={e.id} value={e.id.toString()}>
                                    {e.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Hora de entrada</Label>
                    <Input
                        value={formDataSchedule.entry_time ?? ""}
                        onChange={handleChangeSchedule}
                        id="entry_time"
                        required
                        type="time"
                    />
                </div>

                <div>
                    <Label>Hora de salida</Label>
                    <Input
                        value={formDataSchedule.exit_time ?? ""}
                        onChange={handleChangeSchedule}
                        id="exit_time"
                        required
                        type="time"
                    />
                </div>

                <div>
                    <Label>Tolerancia entrada (min)</Label>
                    <Input
                        value={formDataSchedule.entry_tolerance ?? ""}
                        onChange={handleChangeSchedule}
                        id="entry_tolerance"
                        type="number"
                        required
                        defaultValue={10}
                    />
                    <p className="font-medium text-sm text-black-secondary">Minutos de gracia para marcar "Puntual"</p>
                </div>

                <div>
                    <Label>Tolerancia salida (min)</Label>
                    <Input
                        value={formDataSchedule.entry_tolerance ?? ""}
                        onChange={handleChangeSchedule}
                        id="exit_tolerance"
                        type="number"
                        required
                        defaultValue={20}
                    />
                    <p className="font-medium text-sm text-black-secondary">Ventana válida antes/después de salida</p>
                </div>

                <div className="col-span-full bg-white-primary border border-white-primary hover:border-gray-200 transition-all duration-300 cursor-pointer p-5 rounded-primary space-y-2 mt-6">

                    <p className="font-medium uppercase text-black-primary">vista previa del horario</p>

                    <div className="flex items-center gap-4">
                        <div>
                            <p className="font-bold text-sm text-black-secondary">Entrada puntual hasta</p>
                            <p className="font-bold text-black-primary text-xl">07:30</p>
                        </div>
                        <div className="bg-black-secondary h-10 w-0.5 mx-2"></div>
                        <div>
                            <p className="font-bold text-sm text-black-secondary">Ventana de salida</p>
                            <p className="font-bold text-black-primary text-xl">12:40 - 13:20</p>
                        </div>
                        <div className="bg-black-secondary h-10 w-0.5 mx-2"></div>
                        <div>
                            <p className="font-bold text-sm text-black-secondary">Duración jornada</p>
                            <p className="font-bold text-black-primary text-xl">5h 30min</p>
                        </div>
                    </div>
                </div>


                <div className="flex items-center gap-3 justify-end col-span-full">
                    <Button
                        onClick={() => setIsOpenForm(false)}
                        variant="outline" type="button">Cancelar</Button>
                    <Button variant="outline" type="submit">Guardar horario</Button>
                </div>


            </form>

            {schedules.map((e) => (
                <div key={e.id} className="p-6 rounded-primary bg-gray border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-black-primary">{e.educational_level_name} · {e.section_name}</p>
                            <p className="font-medium text-black-secondary text-sm">Duración: 5h 30min</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline" size="icon">
                                <Pen />
                            </Button>
                            <Button
                                variant="outline" size="icon">
                                <X />
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white-primary rounded-primary p-3">
                            <p className="font-bold text-sm text-black-secondary">Entrada</p>
                            <p className="font-bold text-black-primary text-2xl">{e.entry_time}</p>
                        </div>
                        <div className="bg-white-primary rounded-primary p-3">
                            <p className="font-bold text-sm text-black-secondary">Salida</p>
                            <p className="font-bold text-black-primary text-2xl">{e.exit_time}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge color="blue">Puntual hasta 07:40</Badge>
                        <Badge color="purple">Salida: 12:40 – 13:20</Badge>
                    </div>
                </div>

            ))}
        </div>

    )
}