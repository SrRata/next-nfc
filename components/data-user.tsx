import { Avatar } from "./ui/avatar";

interface DataUserProps {
  name: string;
  id?: string;
  section?: string;
  course?: string;
}

export function DataUser({ name, id, section, course }: DataUserProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar name={name} />

      <div className="flex flex-col min-w-0">
        <span className="font-semibold truncate">{name}</span>

        {(id || section) && (
          <span className="text-sm font-medium text-black-secondary truncate">
            {id && `ID: ${id}`}
            {id && course && " • "}
            {course}
            {course && section && " • "}
            {section}
          </span>
        )}
      </div>
    </div>
  );
}

//Componente mejorado, version final
//01-03-2026
