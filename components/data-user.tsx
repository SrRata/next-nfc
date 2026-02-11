import { Avatar } from "./ui/avatar";

interface DataUserProps {
    name?: string;
    id?: string;
} 

export function DataUser({name, id}: DataUserProps) {
    return (
        <div className="flex gap-5 items-center">
            <Avatar name={name}/>
            <div>
                <p className="capitalize font-bold">{name}</p>
                
                {id ? <span className="font-medium text-black-secondary text-sm">ID: {id}</span> : null }                
            </div>
        </div>
    )
}