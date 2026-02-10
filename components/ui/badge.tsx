interface BadgeProps {
    children: React.ReactNode;
    color?: "red" | "green" | "yellow" | "blue" | "purple" | "orange" | string;
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
            return "bg-gray text-black-secondary"
    }
};


export function Badge({children, color}: BadgeProps) {
    return (
        <span className={`py-1 px-4 rounded-full font-semibold w-fit flex items-center gap-2.5 capitalize ${addColor(color)}`}>
            {children}
        </span>
    )
}

interface BadgeCircleProps {
    pulse?: boolean;
}

export function BadgeCircle({pulse}: BadgeCircleProps) {
    return (
        <span className={`size-2.5 rounded-full bg-current ${pulse ? "animate-pulse" : ""}`}></span>
    )
}