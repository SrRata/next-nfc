import { HelpManual } from "@/components/help_section/help-manual"
import { UserCogIcon } from "lucide-react"

export default function HelpAdminPage() {
  return (
    <>
        <HelpManual
        icon={UserCogIcon}
        iconColor="blue"
        title="Manual de Administrador"
        />
    </>
  )
}