import { InfoCard } from "@/components/info-card"
import { HelpCircle, UserCog, UserPenIcon, UserSearch } from "lucide-react"
import { RoleCard } from "@/components/help_section/role_card"
import { CogIcon, UserCogIcon} from "lucide-react"
import { userAgent } from "next/server"
import { HelpTitle } from "@/components/help_section/help-title"


export default function HelpPage() {
  return (
    <>
    <div className="col-span-full">
      <div className="py-20 px-25 flex flex-col gap-10 bg-blue-primary rounded-primary text-center ">
        <HelpTitle 
          icon={HelpCircle}
          iconColor="blue"
          title="Manual de Usuario"
        />
        <p className="text-white-primary font-bold text-3xl">
          !Estamos aquí para ayudarte!
        </p>
        <p className="text-white-primary font-medium text-lg">
          Aprende a usar nuestra plataforma de manera fácil y rápida con nuestro manual de usuario. Aquí encontrarás guías paso a paso, consejos útiles y respuestas a las preguntas más frecuentes para aprovechar al máximo todas las funciones que ofrecemos.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-x-5 gap-y-10 px-30 py-15">
        <h2 className="col-span-full font-bold text-5xl text-blue-primary text-center">Roles de Usuario</h2>
        <RoleCard 
        iconColor="blue"
        icon={UserCogIcon}
        title="Administrador"
        description="Encargado de gestionar y controlar la plataforma y los usuarios, solucionar problemas técnicos y configurar los ajustes del sistema."
        href="/help/admin-manual"
        />
        <RoleCard 
        iconColor="orange"
        icon={UserPenIcon}
        title="Profesor"
        description="Responsable de gestionar sus cursos, registrar la asistencia y revisar el historial de sus estudiantes asignados."
        href="#"  
        />
        <RoleCard 
        iconColor="red"
        icon={UserSearch}
        title="Representante"
        description="Padre de familia o representante legal que accede a la plataforma para revisar el historial de asistencia y cursos registrados de su representado."
        href="#"
        />
      </div>
    </div>



    </>
  )
}