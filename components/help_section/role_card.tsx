import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconShape } from "../ui/icon-shape";
import { color } from "@/lib/constants/data-type";

interface RoleCardProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    iconColor?: color;
}


export function RoleCard({
    icon: LucideIcon,
    title,
    description,
    iconColor="gray",   
    }: RoleCardProps
) {

    return (
    <>
        <div className="bg-white-primary rounded-primary p-6 gap-4 flex flex-col items-center text-center">
            {LucideIcon && <LucideIcon size={48} color={iconColor} />}
                <h3 className="text-black-primary font-semibold text-2xl">{title}</h3>
                <p className="text-black-secondary font-medium text-lg">{description}</p>
        </div>
    </>
    )}