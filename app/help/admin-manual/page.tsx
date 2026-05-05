import { HelpTitle } from "@/components/help_section/help-title"
import { UserCogIcon } from "lucide-react"
import { HelpStep } from "@/components/help_section/help-step"

export default function HelpAdminPage() {
  return (
    <>
        <HelpTitle
        icon={UserCogIcon}
        iconColor="blue"
        title="Manual de Administrador"
        />

        <HelpStep
          title="Paso 1: Iniciar Sesión"
          icon={UserCogIcon}
          iconColor="blue"
          description="Aprenda cómo iniciar sesión en el sistema de administración."
        />
    </>
  )
}