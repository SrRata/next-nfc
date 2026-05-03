import { HelpTitle } from "@/components/help_section/help-title"
import { UserCogIcon } from "lucide-react"

export default function HelpAdminPage() {
  return (
    <>
        <HelpTitle
        icon={UserCogIcon}
        iconColor="blue"
        title="Manual de Administrador"
        />
    </>
  )
}