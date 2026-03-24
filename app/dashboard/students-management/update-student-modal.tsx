import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { educationLevels, sections } from "@/lib/constants/data-type";
import { Student } from "@/lib/hooks/fetch/students";
import { AlertCircle, GraduationCap, IdCard, Save } from "lucide-react";

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null | undefined;
}

export function UpdateStudentModal({ isOpen, onClose, student }: DeleteStudentModalProps) {
  return (

    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-230 max-h-[95vh] overflow-y-auto no-scrollbar"
        showCloseButton={false}
      >

        <DialogHeader className="sr-only">
          <DialogTitle>Editar estudiante</DialogTitle>
        </DialogHeader>
        <form action="">
          <div className="grid grid-cols-2 gap-5">
            <p className="flex items-center gap-4 col-span-2 font-bold text-xl text-blue-primary">
              <IdCard />
              Información personal
            </p>

            <Separator />

            <div>
              <Label htmlFor="name">Nombres *</Label>
              <Input required
              type="text"
                id="name"
                className="capitalize"
                defaultValue={student?.firstName}
                placeholder="Ej. Juan Alberto"
              />
            </div>
            <div>
              <Label htmlFor="lastname">Apellidos *</Label>
              <Input required
              type="text"
                id="lastname"
                className="capitalize"
                defaultValue={student?.lastName}
                placeholder="Ej. Perez Garcia"
              />
            </div>
            <div>
              <Label id="id">Numero de cedula *</Label>
              <Input required id="id" type="text" defaultValue={student?.id} maxLength={10}/>
            </div>

            <div>
              <Label id="id">Numero de telefono</Label>
              <Input id="id" type="text" defaultValue={student?.id} maxLength={10}/>
            </div>

            <div className="col-span-full">
              <Label id="id">Correo electronico</Label>
              <Input id="id" defaultValue={student?.id} type="email" placeholder="estudiante@colegio.com"/>
            </div>

            <p className="flex items-center gap-4 col-span-full font-bold text-xl text-blue-primary">
              <GraduationCap />
              Información academica
            </p>

            <Separator />

            <div>
              <Label>Curso</Label>
              <Input required defaultValue={student?.course} />
            </div>

            <div>
              <Label>Sección</Label>
              <Select required
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="seleccione un nivel educativo" />
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

            <div className="col-span-full border-2 border-blue-primary/15 bg-blue-secondary rounded-primary p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xl text-blue-primary font-bold">
                  Hardware & Acceso
                </p>
                <Badge color="blue" variant="solid">
                  Esperando tag
                </Badge>
              </div>
              <Label>Código NFC</Label>
              <Input defaultValue={student?.nfc} required />
              <p className="text-sm text-black-secondary font-semibold mt-3 flex items-center gap-2">
                <AlertCircle className="size-4" />
                Acerce el tag NFC al lector para capturar el código
                automáticamente.
              </p>
            </div>
          </div>

          <Separator />

          <DialogFooter>
            <Button variant="outline" size="lg" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="lg">
              <Save />
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}