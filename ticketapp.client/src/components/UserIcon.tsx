import {Avatar} from "@mui/material";
import {useEffect, useState} from "react";
import {User} from "../models/User.ts";

export default function UserIcon(props: { userId: string })
{
    const [userData, setUserData] = useState<User>();

    useEffect(() => {
        if (props.userId === "") return;
        fetch("api/User/GetUserInfo?userId=" + props.userId,
        {
            method: "GET"
        }).then(resp => {
            if (resp.ok)
            {
                resp.json().then(result => {
                    setUserData(result);
                })
            }
        })
    }, [props.userId]);
    
    return (
        <div className="flex space-x-2 items-center">
            <Avatar sx={{ width: 32, height: 32 }} src={props.userId}>{((userData?.userName[0] ?? "") + userData?.userName[userData?.userName.indexOf("_") + 1])}</Avatar>
            <p className="text-nowrap">{userData?.userName.replace("_", " ")}</p>
        </div>
    )
}