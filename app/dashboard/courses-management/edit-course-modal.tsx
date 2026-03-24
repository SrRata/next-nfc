"use client"

import React, { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"; // Importa los iconos
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { educationLevels, sections } from "@/lib/constants/data-type";
import { Course } from "@/lib/hooks/fetch/courses";
import { useProfessors } from "@/lib/hooks/fetch/professor";

interface EditCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course | null | undefined;
}

export function EditCourseModal({ isOpen, onClose, course }: EditCourseModalProps) {
    const [openPopover, setOpenPopover] = useState(false);
    const { professors, loading } = useProfessors();
    
    // Estado para el ID del tutor seleccionado
    const [tutorId, setTutorId] = useState<string>(course?.id?.toString() || "");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar curso: {course?.courseName}</DialogTitle>
                </DialogHeader>

                {course && (
                    <form className="grid grid-cols-2 gap-6 py-4">

                        <div>
                            <Label>Nombre *</Label>
                            <Input
                                name="firstName"
                                className="capitalize"
                                defaultValue={course.courseName}
                                required
                                placeholder="Ej. 1 bachillerato"
                            />
                        </div>

                        <div>
                            <Label>Paralelo *</Label>
                            <Input
                                name="lastName"
                                className="capitalize"
                                defaultValue={course.parallel}
                                required
                                placeholder="Ej. A"
                            />
                        </div>


                        <div>
                            <Label>Seccion</Label>

                            <Select
                                required
                                defaultValue={course.section}
                            >
                                <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {sections.map((s) => (
                                        <SelectItem key={s} value={s} className="capitalize">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* <div>
                            <Label>Tutor</Label>

                            <Select
                                required
                                defaultValue={course.section}
                            >
                                <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {professors.map((p) => (
                                        <SelectItem key={p.id} value={p.id.toString()} className="capitalize">
                                            {p.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div> */}

                        <div>
                            <Label>Nivel educativo</Label>

                            <Select
                                required
                                defaultValue={course.level}
                            >
                                <SelectTrigger className="capitalize">
                                    <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {educationLevels.map((l) => (
                                        <SelectItem key={l} value={l} className="capitalize">
                                            {l}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tutor (Buscador)</Label>
                            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openPopover}
                                        className="w-full justify-between font-normal"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : tutorId 
                                            ? professors.find((p) => p.id.toString() === tutorId)?.fullName 
                                            : "Seleccionar profesor..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-75 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar profesor..." />
                                        <CommandEmpty>No se encontró al profesor.</CommandEmpty>
                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                            {professors.map((p) => (
                                                <CommandItem
                                                    key={p.id}
                                                    value={p.fullName} // Esto es lo que el buscador filtra
                                                    onSelect={() => {
                                                        setTutorId(p.id.toString());
                                                        setOpenPopover(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            tutorId === p.id.toString() ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {p.fullName}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                    </form>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={() => console.log("Datos:", tutorId)}>Guardar cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
