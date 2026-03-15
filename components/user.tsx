import { role } from "@/lib/constants/data-type";
import { Avatar } from "./ui/avatar";

interface UserInfoProps {
    name: string;
    username: string;
    role: role;
    align?: "left" | "right";
}

export function UserInfo({
    name,
    username,
    role,
    align = "right",
}: UserInfoProps) {

    const textAlign = align === "right" ? "text-right" : "text-left";

    return (
        <div className="flex items-center gap-4">
            <div className={textAlign}>
                <p className="font-semibold text-black-primary">
                    {username}
                </p>
                <p className="text-black-secondary text-sm font-medium capitalize">
                    {role}
                </p>
            </div>

            <Avatar name={name} />
        </div>
    );
}
