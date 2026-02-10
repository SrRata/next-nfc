import { Check } from "lucide-react"
import { IconShape } from "./ui/icon-shape"
import { InternalLink } from "./ui/link"

interface NotificationContainProps {
    children?: React.ReactNode;
}


export function NotificationContain({children}: NotificationContainProps) {
    return (
        <div className="bg-white-primary p-7 rounded-primary col-span-3 flex flex-col gap-8">
            {children}
        </div>
    )
}


interface NotificationHeaderProps {
    title?: string;
    description?: string;
}


export function NotificationHeader({title = "title", description = "description"}: NotificationHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-10">
            <div>
                <h3 className="text-black-primary font-bold text-2xl">{title}</h3>
                <p className="text-black-secondary font-medium ">{description}</p>
            </div>
            <InternalLink href="/">Ver todo</InternalLink>
        </div>
    )
}

interface NotificationProps {
    name?: string;
    notification?: string;
    time?: string;
    course?: string;
    color?: string;
}

export function Notification({name = "name", notification = "notification", time = "00:00 AM/PM", course = "course", color = ""}: NotificationProps) {
    return (
        <div className="flex items-center justify-between px-5 py-2.5 rounded-primary hover:bg-gray transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-5">
                <IconShape circle icon={Check} color={color} />
                <div>
                    <p className="text-black-primary font-medium"><span className="font-bold">{name}</span> {notification}</p>
                    <p className="text-black-secondary text-sm font-medium">Hace 3 minutos - {course}</p>
                </div>
            </div>
            <span className="text-black-primary font-semibold">
                {time}
            </span>
        </div>
    )
}


