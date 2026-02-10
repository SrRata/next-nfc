interface AvatarProps {
    name?: string;
}

function getInitials(text: string): string {
  return text
    .trim()
    .split(/\s+/)       
    .slice(0, 2)         
    .map(word => word.charAt(0)) 
    .join("")
    .toUpperCase();
}

export function Avatar({name = "user"}: AvatarProps) {
    return (
        <div className="size-13 rounded-full bg-blue-secondary grid place-content-center">
            <p className="text-xl text-blue-primary font-semibold uppercase">{getInitials(name)}</p>
        </div>
    )
}