"use client"

import { Button } from "@/components/ui/button";
import { CirclePlus, Pen, Plus, X } from "lucide-react";
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
import { minutesToTime, timeToMinutes } from "@/lib/format-time";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconClockPlay, IconMoodPuzzled, IconTrash } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";

interface SchedulesManagementProps {
    schedules: Schedule[]
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>
    loadSchedules: () => void
    educationalLevels: educationalLevel[]
    sections: Section[]
}


interface SchedulePreviewInput {
    entry_time: string;
    exit_time: string;
    entry_tolerance: string | number;
    exit_tolerance: string | number;
}


function calculateSchedulePreview(
    data: SchedulePreviewInput
) {

    if (!data.entry_time || !data.exit_time) {
        return null;
    }

    const entryMinutes =
        timeToMinutes(data.entry_time);

    const exitMinutes =
        timeToMinutes(data.exit_time);

    const entryTolerance =
        Number(data.entry_tolerance);

    const exitTolerance =
        Number(data.exit_tolerance);

    const punctualUntil =
        minutesToTime(
            entryMinutes + entryTolerance
        );

    const exitWindowStart =
        minutesToTime(
            exitMinutes - exitTolerance
        );

    const exitWindowEnd =
        minutesToTime(
            exitMinutes + exitTolerance
        );

    const duration =
        exitMinutes - entryMinutes;

    const durationHours =
        Math.floor(duration / 60);

    const durationMinutes =
        duration % 60;


    return {
        punctualUntil,
        exitWindowStart,
        exitWindowEnd,
        durationText:
            `${durationHours}h ${durationMinutes}min`,
    };
}

export default function SchedulesManagement({ schedules, educationalLevels, setSchedules, loadSchedules, sections }: SchedulesManagementProps) {

    const [sectionId, setSectionId] = useState<string>("");
    const [educationalLevelId, setEducationalLevelId] = useState<string>("");
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

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

    const resetForm = () => {

        setEditingSchedule(null);

        setEducationalLevelId("");

        setSectionId("");

        setFormDataSchedule({
            entry_time: "",
            exit_time: "",
            entry_tolerance: "10",
            exit_tolerance: "20",
        });

        setIsOpenForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        // console.log(payload) //Debug


        const loadingToast = toast.loading(
            editingSchedule
                ? "Actualizando horario..."
                : "Creando horario..."
        );


        try {
            setIsLoadingCreate(true);

            if (editingSchedule) {
                const response = await axios.put(
                    `/api/schedules/${editingSchedule.id}`,
                    payload
                );

                await loadSchedules();


                toast.success("Horario actualizado correctamente", {
                    id: loadingToast,
                });

                resetForm();

            } else {
                setIsLoadingCreate(true);

                const response = await axios.post("/api/schedules", payload);

                await loadSchedules();

                toast.success("Horario creado correctamente", {
                    id: loadingToast,
                });

                resetForm();

            }

            setIsOpenForm(false);

        } catch (error) {
            console.error("Error create schedule", error);
            toast.error(
                editingSchedule
                    ? "Error al actualizar horario"
                    : "Error al crear horario",
                {
                    id: loadingToast,
                }
            );

        } finally {
            setIsLoadingCreate(false);
        }
    }

    const handleDelete = async (id: number) => {

        const loadingToastCreate = toast.loading("Borrando horario...");

        try {

            setIsLoadingDelete(true)

            const response = await axios.delete(`/api/schedules/${id}`)

            setSchedules((prev) =>
                prev.filter((s) => s.id !== id)
            );

            toast.success("Horario eliminado", {
                id: loadingToastCreate,
            });

            setOpenDialog(false)
            setIsLoadingDelete(false)

        } catch (erorr) {
            console.error('Error create schedule', erorr)
            toast.error("Error al eliminar horario", {
                id: loadingToastCreate,
            });
        }
    }


    const handleEdit = (schedule: Schedule) => {

        setEditingSchedule(schedule);

        setEducationalLevelId(
            schedule.educational_level_id.toString()
        );

        setSectionId(
            schedule.section_id.toString()
        );

        setFormDataSchedule({
            entry_time: schedule.entry_time.slice(0, 5),
            exit_time: schedule.exit_time.slice(0, 5),
            entry_tolerance: schedule.entry_tolerance.toString(),
            exit_tolerance: schedule.exit_tolerance.toString(),
        });

        setIsOpenForm(true);
    };



    //TIEMPO PREVISUALIZADO 

    const preview =
        calculateSchedulePreview(formDataSchedule);


    // MODAL DELETE

    const [selectedItem, setSelectedItem] = useState<Schedule | null>(null);

    const [openDialog, setOpenDialog] = useState(false);

    function handleOpenDelete(item: any) {
        setSelectedItem(item);
        setOpenDialog(true);
    }

    return (
        <>
            <div className="space-y-6 p-6 rounded-primary bg-white-primary md:col-span-2 md:row-span-3">

                <div className="flex items-center justify-between col-span-full">
                    <div>
                        <h4 className="font-bold text-2xl text-blue-primary">Horarios</h4>
                        <p className="font-medium text-black-secondary text-sm">Horario de entrada y salida por nivel y sección</p>
                    </div>
                    {/* <Button
                        onClick={() => {
                            setIsOpenForm(true)
                            resetForm
                        }}
                    >
                        <Plus />
                        Nuevo horario
                    </Button> */}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={`bg-gray border border-gray-200 p-6 rounded-primary ${isOpenForm ? "grid" : "hidden"} grid-cols-2 gap-3`}>

                    <div className="bg-blue-secondary w-full p-3 pl-6 relative col-span-full">
                        <p className="font-medium text-blue-primary">Los horarios se crean por combinación de nivel educativo + sección. Cada combinación puede tener un único horario.</p>
                        <div className="bg-blue-primary h-full w-1 absolute left-0 top-0"></div>
                    </div>


                    <div>
                        <Label>Nivel educativo</Label>
                        <Select
                            required
                            value={educationalLevelId}
                            onValueChange={(value) => {
                                setEducationalLevelId(value)
                            }}
                        >
                            <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Sin asignar nivel educativo" />
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
                            required
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
                            min={0}
                        />
                        <p className="font-medium text-sm text-black-secondary">Minutos de gracia para marcar "Puntual"</p>
                    </div>

                    <div>
                        <Label>Tolerancia salida (min)</Label>
                        <Input
                            value={formDataSchedule.exit_tolerance ?? ""}
                            onChange={handleChangeSchedule}
                            id="exit_tolerance"
                            type="number"
                            required
                            min={0}
                        />
                        <p className="font-medium text-sm text-black-secondary">Ventana válida antes/después de salida</p>
                    </div>

                    <div className="col-span-full bg-white-primary border border-white-primary hover:border-gray-200 transition-all duration-300 cursor-pointer p-5 rounded-primary space-y-2 mt-6">

                        <p className="font-medium uppercase text-black-primary">vista previa del horario</p>

                        <div className="flex items-center gap-4">
                            <div>
                                <p className="font-bold text-sm text-black-secondary">Entrada puntual hasta</p>
                                <p className="font-bold text-black-primary text-xl">{preview?.punctualUntil ? preview.punctualUntil : "--:--"}</p>
                            </div>
                            <div className="bg-black-secondary h-10 w-0.5 mx-2"></div>
                            <div>
                                <p className="font-bold text-sm text-black-secondary">Ventana de salida</p>
                                <p className="font-bold text-black-primary text-xl">{preview?.exitWindowStart ? preview.exitWindowStart : "--:--"} - {preview?.exitWindowEnd ? preview.exitWindowEnd : "--:--"}</p>
                            </div>
                            <div className="bg-black-secondary h-10 w-0.5 mx-2"></div>
                            <div>
                                <p className="font-bold text-sm text-black-secondary">Duración jornada</p>
                                <p className="font-bold text-black-primary text-xl">{preview?.durationText ? preview.durationText : "0h 0min"}</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center gap-3 justify-end col-span-full">
                        <Button
                            onClick={resetForm}
                            variant="outline" type="button">Cancelar</Button>
                        <Button variant="outline" type="submit">
                            {isLoadingCreate && <Spinner />}
                            {editingSchedule ? 'Actualizar horario' : 'Guardar horario'}
                        </Button>
                    </div>


                </form>

                {schedules.length === 0 ? (
                    <div className="flex flex-col pt-30 gap-3 items-center justify-center">
                        <div className="size-20 rounded-primary grid place-items-center bg-purple-secondary mb-5">
                            <IconClockPlay className="size-15 text-purple-primary" />
                        </div>
                        <p className="text-black-primary font-bold text-3xl">¡Casi listo para empezar!</p>
                        <p className="text-black-secondary font-medium max-w-md text-center mb-5">En cuanto tengas tus secciones y niveles creados, aquí podrás diseñar los horarios de clases en un abrir y cerrar de ojos.</p>
                        <Button
                            disabled={educationalLevels.length === 0 || sections.length === 0}
                            onClick={() => {
                                setIsOpenForm(true)
                                resetForm
                            }}
                        >
                            <Plus />
                            {isLoadingCreate && <Spinner />}
                            {educationalLevels.length === 0 || sections.length === 0 ? "Esperando niveles y secciones..." : "Nuevo horario"}
                        </Button>
                    </div>
                ) : (
                    <>
                        {schedules.map((e) => {
                            const scheduleData = calculateSchedulePreview(e);

                            return (
                                <div
                                    key={e.id}
                                    className="p-6 rounded-primary bg-gray border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-black-primary">
                                                <Badge color={e.educational_level_color}>{e.educational_level_name}</Badge> <span className="text-xl">·</span> <Badge color={e.section_color}>{e.section_name}</Badge>
                                            </p>

                                            <p className="font-medium text-black-secondary text-sm mt-2">
                                                Duración: {scheduleData?.durationText}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={() => handleEdit(e)}
                                                variant="outline"
                                                size="icon"
                                            >
                                                <Pen />
                                            </Button>

                                            <Button
                                                onClick={() => handleOpenDelete(e)}
                                                variant="outline"
                                                size="icon"
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white-primary rounded-primary p-3">
                                            <p className="font-bold text-sm text-black-secondary">
                                                Entrada
                                            </p>

                                            <p className="font-bold text-black-primary text-2xl">
                                                {e.entry_time}
                                            </p>
                                        </div>

                                        <div className="bg-white-primary rounded-primary p-3">
                                            <p className="font-bold text-sm text-black-secondary">
                                                Salida
                                            </p>

                                            <p className="font-bold text-black-primary text-2xl">
                                                {e.exit_time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge color="blue">
                                            Puntual hasta {scheduleData?.punctualUntil}
                                        </Badge>

                                        <Badge color="purple">
                                            Salida:
                                            {" "}
                                            {scheduleData?.exitWindowStart}
                                            {" - "}
                                            {scheduleData?.exitWindowEnd}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}

                        <div
                            onClick={() => setIsOpenForm(true)}
                            className="group bg-gray border-3 border-dotted border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer h-50 rounded-primary p-6 flex items-center justify-center "
                        >
                            <CirclePlus className="size-10 text-gray-300 group-hover:text-gray-400 transition-all duration-300" />
                        </div>
                    </>
                )}


                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogHeader className="sr-only">
                        <DialogTitle>Borrar horario</DialogTitle>
                        <DialogDescription>
                            Este modal borra el horario seleccionado
                        </DialogDescription>
                    </DialogHeader>
                    <DialogContent showCloseButton={false} className="flex flex-col gap-5 items-center w-full max-w-130">
                        <div className="bg-red-secondary size-15 rounded-primary grid place-items-center">
                            <IconTrash className="text-red-primary size-10" />
                        </div>
                        <p className="text-center text-black-primary font-bold text-xl">¿Borrar nivel educativo?</p>
                        <p className="text-center text-black-secondary font-medium">Esto eliminará este nivel educativo. Los estudiantes y horarios relacionados a este podria afrontar problemas de registros.</p>
                        <div className="grid grid-cols-2 w-full gap-5">
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                            <Button variant="destructive" onClick={() => selectedItem && handleDelete(selectedItem.id)}>
                                {isLoadingDelete && <Spinner />}
                                Borrar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div >
        </>
    )
}