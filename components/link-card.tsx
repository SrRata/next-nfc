import { ChevronRight, LucideIcon, User } from "lucide-react";
import { IconColor, IconShape } from "./ui/icon-shape";
import { InternalLink } from "./ui/link";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  title: string
  description?: string
  href: string
  icon: LucideIcon
  iconColor?: IconColor
  ctaText?: string
  className?: string
}



export function LinkCard({
    title,
    description,
    href,
    icon: Icon,
    iconColor = "blue",
    ctaText = "Ver más",
    className,
}: LinkCardProps) {
    return (
        <div className={cn("bg-white-primary p-6 rounded-primary flex flex-col gap-5 justify-between", className)}>
            <div className="flex flex-col gap-7">
            <IconShape icon={Icon} color={iconColor}/>
            <div className="flex flex-col gap-2">
                <h4 className="text-black-primary font-bold text-2xl">{title}</h4>
                <p className="text-black-secondary leading-primary font-medium">{description}</p>
            </div>
            </div>
            <InternalLink href={href}>
                {ctaText ?? "Ver más"}
                <ChevronRight size={18} strokeWidth={3}/>
            </InternalLink>
        </div>
    )
}

//posible version final