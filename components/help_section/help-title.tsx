import { LucideIcon } from "lucide-react"
import { color } from "@/lib/constants/data-type";




interface HelpPageProps {
    title: string;
    icon?: LucideIcon;
    iconColor: color;

}

export function HelpTitle({ icon: Icon, iconColor, title }: HelpPageProps) {
  return (
    <> 
    <div className="col-span-full">

        <div className="py-5 flex gap-6 bg-blue-primary rounded-primary items-center justify-center">
            <div>
                {Icon && <Icon size={40} color="white" />}
            </div>
            <h2 className="text-4xl font-bold text-white-primary">
                {title}
            </h2>

        </div>
    </div>
    </>
  )
}