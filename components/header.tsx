import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-height-header w-width-header px-5",
        "bg-white-primary flex items-center justify-between",
        className,
      )}
    >
      {children}
    </header>
  );
}

interface PageTitleProps {
  title: string;
  description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black-primary">{title}</h1>
      {description && (
        <p className="text-sm font-semibold text-black-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

//Componente mejorado, version final
//01-03-2026
