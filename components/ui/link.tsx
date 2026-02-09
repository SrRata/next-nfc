import Link from "next/link";


interface LinkProps {
    children: React.ReactNode;
    href: string;
    className?: string;
}


export function InternalLink({children, href, className}: LinkProps) {
    return(
        <Link className={`text-[1.1rem] font-bold text-blue-primary flex items-center gap-2 cursor-pointer ${className ?? ""}`} href={href}>
            {children}
        </Link>
    )
}


export function ExternalLink({children, href}: LinkProps) {
    return(
        <></>
    )
}
