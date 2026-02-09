import { LucideIcon } from "lucide-react";

interface IconShapeProps {
    icon: LucideIcon;
    className?: string;
    color?: "red" | "green" | "yellow" | "blue" | "purple" | "orange" | string;
    circle?: boolean;
    iconSize?: number;
}

function addColor(color?:string): string {
    switch (color) {
        case "red": 
            return "bg-red-secondary text-red-primary"
        case "green":
            return "bg-green-secondary text-green-primary"
        case "yellow":
            return "bg-yellow-secondary text-yellow-primary"
        case "blue":
            return "bg-blue-secondary text-blue-primary"
        case "purple":
            return "bg-purple-secondary text-purple-primary"
        case "orange":
            return "bg-orange-secondary text-orange-primary"
        default:
            return "bg-gray text-black-primary"
    }
};


export function IconShape({icon: Icon, className, color, circle, iconSize = 24}: IconShapeProps) {
    return (
        <span className={`size-15 ${circle ? "rounded-full" : "rounded-primary"} grid place-content-center ${addColor(color)} ${className ?? ""}`}>
            <Icon size={iconSize} strokeWidth={2}/>
        </span>
    )
}