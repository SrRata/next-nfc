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
import { color, section } from "@/lib/constants/data-type";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconLayersIntersect, IconMoodPuzzled, IconTrash } from "@tabler/icons-react";
import { ColorPicker } from "@/components/color-picker";


interface SectionsManagementProps {
    sections: Section[]
    setSections: React.Dispatch<React.SetStateAction<Section[]>>
    loadSections: () => void
}

export default function SectionsManagement({ sections, setSections, loadSections }: SectionsManagementProps) {

    const [isOpenForm, setIsOpenForm] = useState(false);
    const [selectedColor, setSelectedColor] = useState<color>("gray");


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
            color: selectedColor,
        }

        const loadingToast = toast.loading('Creando sección...');


        // console.log(payload) //Debug    

        try {
            await axios.post('/api/sections', payload)
            await loadSections();
            resetForm();
            setIsOpenForm(false);
            toast.success(`Seccion creada con exito`, {
                id: loadingToast,
            })
        } catch (error) {
            console.error('Error create level', error)
            toast.error(`No se pudo crear la sección.`, {
                id: loadingToast,
            })
        }
    }

    const handleDelete = async (id: number) => {
        const loadingToast = toast.loading('Eliminando sección...');

        try {
            await axios.delete(`/api/sections/${id}`)
            setSections((prev) =>
                prev.filter((s) => s.id !== id)
            );
            toast.success(`Seccion eliminada con exito.`, {
                id: loadingToast,
            })
            setOpenDialog(false)
        } catch (error) {
            console.error('Error delete level', error)
            toast.error(`No se pudo eliminar la sección.`, {
                id: loadingToast,
            })
        }
    }


    const resetForm = () => {
        setFormDataSection({
            name: "",
        })
    }

    const [selectedItem, setSelectedItem] = useState<Section | null>(null);

    const [openDialog, setOpenDialog] = useState(false);

    function handleOpenDelete(item: any) {
        setSelectedItem(item);
        setOpenDialog(true);
    }


    return (
        <>
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
                            autoComplete="off"
                            value={formDataSection.name}
                            onChange={handleChangeSection}
                            id="name"
                            required
                            minLength={3}
                            maxLength={255}
                            type="text"
                            placeholder="Ej: Matutina, Vespertina, Nocturna ..."
                        />
                    </div>

                    <ColorPicker selected={selectedColor} onChange={setSelectedColor}/>

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

                {sections.length === 0 ?
                    (
                        <div className="flex flex-col gap-3 items-center justify-center p-5">
                            <div className="size-17 rounded-primary grid place-items-center bg-orange-secondary mb-5">
                                <IconLayersIntersect className="size-12 text-orange-primary" />
                            </div>
                            <p className="text-black-primary font-bold text-3xl">¡Prepara los grupos!</p>
                            <p className="text-black-secondary font-medium max-w-md text-center mb-5"> Antes de marcar asistencia, necesitamos saber quiénes son. Crea las secciones para empezar a organizar a tus alumnos.</p>
                            <Button
                                onClick={() => {
                                    setIsOpenForm(true)
                                    resetForm
                                }}
                            >
                                <Plus />
                                Crear Sección
                            </Button>
                        </div>

                    )
                    :
                    (<div className="col-span-full space-y-3">
                        {sections.map((e) => (
                            <div key={e.id} className="bg-gray border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-primary p-6 flex items-center justify-between">
                                <div className="flex items-center justify-between gap-5">
                                    <Badge color={e.color} variant="solid">&nbsp;</Badge>
                                    <div>
                                        <p className="font-bold text-black-primary capitalize">{e.name}</p>
                                        <p className="font-medium text-black-secondary text-sm">ID {e.id} . 2 horario(s)</p>
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
                    </div>)}

            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Borrar sección</DialogTitle>
                    <DialogDescription>
                        Este modal borra la sección seleccionado
                    </DialogDescription>
                </DialogHeader>
                <DialogContent showCloseButton={false} className="flex flex-col gap-5 items-center w-full max-w-130">
                    <div className="bg-red-secondary size-15 rounded-primary grid place-items-center">
                        <IconTrash className="text-red-primary size-10" />
                    </div>
                    <p className="text-center text-black-primary font-bold text-xl">¿Borrar esta sección?</p>
                    <p className="text-center text-black-secondary font-medium">Esto eliminará la sección seleccionada. Los estudiantes y horarios relacionados a esta podrian afrontar problemas de registros.</p>
                    <div className="grid grid-cols-2 w-full gap-5">
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={() => selectedItem && handleDelete(selectedItem.id)}>Borrar</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}