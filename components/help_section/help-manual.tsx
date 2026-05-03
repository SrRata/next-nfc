import { LucideIcon } from "lucide-react"
import { color } from "@/lib/constants/data-type";




interface HelpPageProps {
    title: string;
    icon?: LucideIcon;
    iconColor?: color;

}

export function HelpManual({ icon: Icon, iconColor, title }: HelpPageProps) {
  return (
    <> 
    <div className="col-span-full">

        <div className="py- flex gap-1 bg-white-primary rounded-primary items-center justify-center">
            <div>
                {Icon && <Icon size={40} color={iconColor} />}
            </div>
            <h2 className="text-4xl font-bold text-black-primary">
                {title}
            </h2>

        </div>
    </div>
    </>
  )
}