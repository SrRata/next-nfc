import { InfoCard } from "@/components/info-card"
import { HelpCircle } from "lucide-react"
import { RoleCard } from "@/components/help_section/role_card"
import { CogIcon, UserCogIcon} from "lucide-react"

export default function HelpPage() {
  return (
    <>
    <div className="col-span-full">
      <div className="py-20 px-25 flex flex-col gap-10 bg-blue-primary rounded-primary text-center ">
        <h1 className="text-7xl font-bold text-white-primary">
          Manual de Usuario
        </h1>
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
        description="Encargado de gestionar y controlar la plataforma y los usuarios."
        />
        <InfoCard
        variant="compact"
        icon={HelpCircle}
        colorIcon="blue"
        title="Estamos aquí para ayudarte"
        value="Contacto "
        alert="Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos."
        alertColor="blue"
        />
        <InfoCard
        variant="compact"
        icon={HelpCircle}
        colorIcon="blue"
        title="Estamos aquí para ayudarte"
        value="Contacto "
        alert="Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos."
        alertColor="blue"
        />

      </div>
    </div>
    </>
  )
}