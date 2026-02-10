interface AvatarProps {
    name?: string;
}

function getFirstLetter(text: string): string {
  return text.trim().charAt(0);
}

export function Avatar({name = "user"}: AvatarProps) {
    return (
        <div className="size-13 rounded-full bg-blue-secondary grid place-content-center">
            <p className="text-2xl text-blue-primary font-semibold uppercase">{getFirstLetter(name)}</p>
        </div>
    )
}