import { Avatar } from "./ui/avatar";

interface UserInfoProps {
    name?: string;
    userName?: string;
    role?: string;
}


export function UserInfo({userName = "userName", role = "role", name = "name"}: UserInfoProps) {
    return (
        <div className="flex items-center gap-5">
            <div>
                <h4 className="font-semibold text-black-primary text-right">{userName}</h4>
                <p className="text-sm text-black-secondary font-medium text-right">{role}</p>
            </div>
            <Avatar name={name}/>
        </div>
    )
}