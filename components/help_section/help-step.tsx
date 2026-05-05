import { LucideIcon } from "lucide-react";

interface HelpPageProps {
    title: string;
    icon?: LucideIcon;
    iconColor: string;
    description?: string;
    imageUrl?: string;
}



export function HelpStep(
    { title,
      icon: LucideIcon,
      iconColor,
      description,
      imageUrl,
    }: HelpPageProps
) {
  return (
    <>
        <div className="col-span-full bg-white-primary px-15 rounded-primary flex flex-col"> 
          <div className="flex items-center justify-center gap-10">
             {LucideIcon && <LucideIcon size={48} color={iconColor} />}
            <h3>{title}</h3>
          </div>
          <div>
            <p className="font-medium text-lg">{description}</p>
            {imageUrl && <img src={imageUrl} alt={title} />}
          </div>
        </div>
    </>
  )
}