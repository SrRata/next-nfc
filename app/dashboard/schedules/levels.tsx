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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconSchool, IconTrash } from "@tabler/icons-react";

interface LevelsManagementProps {
    educationalLevels: educationalLevel[];
    setEducationLevels: React.Dispatch<React.SetStateAction<educationalLevel[]>>;
    loadEducationalLevels: () => void;
}



export default function LevelsManagement({ educationalLevels, setEducationLevels, loadEducationalLevels }: LevelsManagementProps) {

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loadingToast = toast.loading('Creando nivel educativo...');

        const payload = {
            name: formDataLevel.name,
        }

        console.log(payload) //Debug    

        try {
            const response = await axios.post('/api/educational-levels', payload)

            await loadEducationalLevels();

            resetForm();

            setIsOpenForm(false);

            toast.success(`Nivel educativo creado con exito`, {
                id: loadingToast,
            })
        } catch (error) {
            console.error('Error create level', error)
            toast.error(`No se pudo crear el nivel educativo`, {
                id: loadingToast,
            })
        }
    }

    const handleDelete = async (id: number) => {

        const loadingToast = toast.loading('Eliminando nivel educativo...');

        try {
            const response = await axios.delete(`/api/educational-levels/${id}`)
            setEducationLevels((prev) =>
                prev.filter((s) => s.id !== id)
            );
            setOpenDialog(false)
            toast.success(`Nivel educativo eliminado con exito`, {
                id: loadingToast,
            })
        } catch (error) {
            console.error('Error delete level', error)
            toast.error(`No se pudo eliminar el nivel educativo`, {
                id: loadingToast,
            })
        }
    }


    const resetForm = () => {
        setFormDataLevel({
            name: "",
        })
    }

    const [selectedItem, setSelectedItem] = useState<educationalLevel | null>(null);

    const [openDialog, setOpenDialog] = useState(false);

    function handleOpenDelete(item: any) {
        setSelectedItem(item);
        setOpenDialog(true);
    }

    return (
        <>
            <div className="space-y-6 p-6 rounded-primary bg-white-primary">

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
                            autoComplete="off"
                            value={formDataLevel.name ?? ""}
                            onChange={handleChangeLevel}
                            id="name"
                            required
                            type="text"
                            minLength={3}
                            maxLength={255}
                            placeholder="Ej: Educación Básica, Bachillerato ..."
                        />
                    </div>

                    <div className="flex items-center gap-3 justify-end col-span-full">
                        <Button
                            onClick={() => {
                                setIsOpenForm(false)
                                resetForm()
                            }}
                            variant="outline" type="button">Cancelar</Button>
                        <Button variant="outline" type="submit">Guardar horario</Button>
                    </div>


                </form>

                {educationalLevels.length === 0 ?
                    (
                        <div className="flex flex-col gap-3 items-center justify-center p-5">
                            <div className="size-17 rounded-primary grid place-items-center bg-blue-secondary mb-5">
                                <IconSchool className="size-12 text-blue-primary" />
                            </div>
                            <p className="text-black-primary font-bold text-3xl">Define los niveles</p>
                            <p className="text-black-secondary font-medium max-w-md text-center mb-5">Configura los grados o niveles académicos de tu institución. ¡Es el primer gran paso para un control de asistencia perfecto!</p>
                            <Button
                                onClick={() => {
                                    setIsOpenForm(true)
                                    resetForm
                                }}
                            >
                                <Plus />
                                Crear nivel
                            </Button>
                        </div>
                    ) :
                    (
                        <div className="col-span-full space-y-3">

                            {educationalLevels.map((e) => (

                                <div key={e.id} className="bg-gray border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-primary p-6 flex items-center justify-between">
                                    <div className="flex items-center justify-between gap-5">
                                        <Badge color="red">&nbsp;</Badge>
                                        <div>
                                            <p className="font-bold text-black-primary">{e.name}</p>
                                            <p className="font-medium text-black-secondary text-sm">ID {e.id} . 1 horario(s)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">

                                        <Button
                                            onClick={() => handleOpenDelete(e)}
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
                    )}

            </div >

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Borrar nivel educativo</DialogTitle>
                    <DialogDescription>
                        Este modal borra el nivel educativo seleccionado
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
                        <Button variant="destructive" onClick={() => selectedItem && handleDelete(selectedItem.id)}>Borrar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}