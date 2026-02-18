// import { Avatar } from "./ui/avatar";

// interface UserInfoProps {
//     name?: string;
//     userName?: string;
//     role?: string;
// }


// export function UserInfo({userName = "userName", role = "role", name = "name"}: UserInfoProps) {
//     return (
//         <div className="flex items-center gap-5">
//             <div>
//                 <h4 className="font-semibold text-black-primary text-right">{userName}</h4>
//                 <p className="text-black-secondary text-sm font-medium text-right">{role}</p>
//             </div>
//             <Avatar name={name}/>
//         </div>
//     )
// }




import { Avatar } from "./ui/avatar";

interface UserInfoProps {
    fullName: string;
    username: string;
    role: string;
    align?: "left" | "right";
}

export function UserInfo({
    fullName,
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
                <p className="text-black-secondary text-sm font-medium">
                    {role}
                </p>
            </div>

            <Avatar name={fullName} />
        </div>
    );
}