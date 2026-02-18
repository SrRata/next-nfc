import { Avatar } from "./ui/avatar";

interface DataUserProps {
  name: string;
  id?: string;
}

export function DataUser({ name, id }: DataUserProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar name={name} />

      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">
          {name}
        </span>

        {id && (
          <span className="text-xs text-black-secondary truncate">
            ID: {id}
          </span>
        )}
      </div>
    </div>
  );
}

//posible version final