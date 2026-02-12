import { AlertCircle } from "lucide-react";
import { IconShape } from "./ui/icon-shape";

export function AlertCard(){
    return(
        <div className="flex col-span-full items-center  bg-white-primary p-7 rounded-primary gap-5">
            <IconShape circle icon={AlertCircle} color="blue"/>
            <p>Esta es una vista de solo lectura. Los cursos presentados han sido asignados por la dirección académica. Si nota alguna discrepancia en la lista de alumnos o materias, por favor contacte al administrador del sistema SiaeNFC.</p>
        </div>
    )
}