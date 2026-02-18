interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}


// export function Header({children, className}: HeaderProps) {
//     return (
//         <header className={`fixed top-0 right-0 h-height-header px-5 w-width-header bg-white-primary flex items-center justify-between ${className}`}>
//             {children}
//         </header>
//     )
// }


// interface PageTitleProps {
//     title?: string;
//     text?: string;
// }

// export function PageTitle({title = "title", text = "text"}: PageTitleProps) {
//     return (
//         <div>
//             <h3 className="text-2xl text-black-primary font-bold">{title}</h3>
//             <p className="text-sm text-black-secondary font-semibold">{text}</p>
//         </div>
//     )
// }

// export function Headerclock() {
//     return (
//         <div>
//             <div className="flex items-center gap-2.5 mb-1">
//                 <div className="bg-gray size-11 rounded-primary grid place-content-center font-bold text-xl">12</div>
//                 <span className="text-black-primary font-semibold text-2xl">:</span>
//                 <div className="bg-gray size-11 rounded-primary grid place-content-center font-bold text-xl">59</div>
//                 <span className="text-black-primary font-semibold text-2xl">:</span>
//                 <div className="bg-gray size-11 rounded-primary grid place-content-center font-bold text-xl">30</div>
//             </div>
//             <p className="text-black-secondary font-semibold text-sm text-right">Domingo, 09 de Febrero</p>
//         </div>
//     )
// }


import { cn } from "@/lib/utils"

export function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-height-header w-width-header px-5",
        "bg-white-primary flex items-center justify-between",
        className
      )}
    >
      {children}
    </header>
  )
}


interface PageTitleProps {
  title: string
  description?: string
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black-primary">
        {title}
      </h1>
      {description && (
        <p className="text-sm font-semibold text-black-secondary">
          {description}
        </p>
      )}
    </div>
  )
}


