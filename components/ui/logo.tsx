import { Nfc } from "lucide-react";
import { IconShape } from "./icon-shape";

interface LogoProps {
    className?: string;
    title?: string;
}


export function Logo({title}: LogoProps) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="size-11 rounded-primary grid place-content-center bg-blue-primary text-white-primary">
                <Nfc/>
            </span>
            <div className="h-full">
                <h2 className="text-blue-primary font-bold text-2xl leading-tertiary">siaeNFC</h2>
                <p className="text-black-secondary font-medium text-sm">Portal {title ?? ""}</p>
            </div>
        </div>
    )  
}