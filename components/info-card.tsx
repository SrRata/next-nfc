import { LucideIcon } from "lucide-react";
import { IconShape } from "./ui/icon-shape";

interface InfoCardProps {
    children?: React.ReactNode;
    className?: string;
    color?: string;
    icon?: LucideIcon;
    title?: string;
    value?: string;
    alert?: string;
    alertColor?: string | "red" | "green";
}

export function InfoCard({children, className, color, icon: Icon, title = 'title', value = 'value'}: InfoCardProps) {
    return (
        <div className={`bg-white-primary p-7 rounded-primary flex flex-col gap-4 ${className}`}>
            {Icon && <IconShape color={color} icon={Icon} />}
            <div className="flex flex-col gap-2">
                <InfoCardTitle>{title}</InfoCardTitle>
                <InfoCardValue>{value}</InfoCardValue>
            </div>
        </div>
    )
}

export function InfoCardSmall({children, className, color, icon: Icon, title = 'title', value = 'value', alert = 'alert', alertColor}: InfoCardProps) {
    return (
        <div className={`bg-white-primary p-7 rounded-primary flex gap-4 items-center ${className}`}>
            {Icon && <IconShape iconSize={32} color={color} icon={Icon} circle className="h-20 w-20"/>}
            <div className="flex flex-col gap-1">
                <InfoCardTitle>{title}</InfoCardTitle>
                <InfoCardValue>{value}</InfoCardValue>
                <InfoCardAlert color={alertColor}>{alert}</InfoCardAlert>
            </div>
        </div>
    )
}

interface InfoCardTitle {
    children: React.ReactNode;
}

export function InfoCardTitle({children}: InfoCardTitle) {
    return (
        <h3 className="text-black-secondary font-semibold ">{children}</h3>
    )
}

interface InfoCardValue {
    children: React.ReactNode;
}

function InfoCardValue({children}: InfoCardValue) {
    return (
        <p className="text-black-primary font-bold text-3xl capitalize">{children}</p>
    )
}

interface InfoCardAlert {
    children: React.ReactNode;
    color?: string;
}

function addColor(color?:string): string {
    switch (color) {
        case "red": 
            return "text-red-primary"
        case "green":
            return "text-green-primary"
        default:
            return "text-black-secondary"
    }
}

function InfoCardAlert({children, color}: InfoCardAlert) {
    return (
        <p className={`font-semibold ${addColor(color)}`} >{children}</p>
    )
}