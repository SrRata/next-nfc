import { ChevronRight, User } from "lucide-react";
import { IconShape } from "./ui/icon-shape";
import { InternalLink } from "./ui/link";
import { Badge, BadgeCircle } from "./ui/badge";

interface LinkCardProps {
    title?: string;
    description?: string;
    href: string;
    link?: string;

}


export function LinkCard({title, description, href, link}: LinkCardProps) {
    return (
        <div className="bg-white-primary p-7 rounded-primary flex flex-col gap-5 justify-between">
            <div className="flex flex-col gap-7">
            <IconShape icon={User} color="blue"/>
            <div className="flex flex-col gap-2">
                <h4 className="text-black-primary font-bold text-2xl">{title}</h4>
                <p className="text-black-secondary leading-primary font-medium">{description}</p>
            </div>
            </div>
            <InternalLink href={href}>
                {link ?? "Ver más"}
                <ChevronRight size={18} strokeWidth={3}/>
            </InternalLink>
        </div>
    )
}