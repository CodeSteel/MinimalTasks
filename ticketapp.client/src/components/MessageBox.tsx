import {Message} from "../models/Message.ts";
import {Avatar} from "@mui/material";
import {AuthResponse} from "../hooks/useAuth.ts";
import clsx from "clsx";

export default function MessageBox(props: { authResponse: AuthResponse, message: Message, showAvatar: boolean })
{
    return (
        <div className="flex flex-col w-1/2 border border-true-gray-300/[0.7] shadow-lg w-full p-5 rounded m-5">
            <div className="flex space-x-5">
                {props.showAvatar && (
                    <span className="flex">
                        <Avatar className="">
                            {((props.message.owner?.userName[0] ?? "") + props.message.owner?.userName[props.message.owner?.userName.indexOf("_") + 1])}
                        </Avatar>
                    </span>
                )}
    
                <div>
                    {props.showAvatar && (
                    <p className="font-bold text-brand-500">{props.message.owner?.userName.replace("_", " ")}</p>
                    )}
                    <p className="my-auto whitespace-normal break-all">{props.message.body}</p>
                </div>
            </div>
            <p className={clsx("text-true-gray-400", {
                "ml-auto": props.showAvatar,
                "mr-auto mt-1": !props.showAvatar
            })}>{new Date(props.message.createdAt).toLocaleTimeString()} {new Date(props.message.createdAt).toLocaleDateString()}</p>
        </div>
    )
}