import {User} from "../models/User.ts";
import {Avatar, Menu} from "@mui/material";
import React, {useEffect, useState} from "react";
import UserIcon from "./UserIcon.tsx";
import clsx from "clsx";

function removeDups(names: string[]): string[] {
    let unique: Record<string, boolean> = {};
    names.forEach(function(i) {
        if(!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

export default function UserSelect(props: { userIds?: string[], onSelect: (user: User | null) => void })
{
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [usersData, setUsersData] = useState<User[]>([{id: "", userName: "", email: ""}]);

    useEffect(() => {
        fetch("api/User/GetUsersInfo", {
            method: "POST",
            body: JSON.stringify(removeDups(props.userIds ?? [])),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            if (resp.ok)
            {
                resp.json().then(result => {
                    setUsersData(result);
                })
            }
        })
    }, [props.userIds]);
    
    return (
        <div>
            <button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <div className="flex items-center space-x-3">
                    <Avatar sx={{
                        width: 32,
                        height: 32
                    }}>{(usersData?.[0]?.userName[0] ?? "") + (usersData?.[0] !== null ? usersData?.[0]?.userName[usersData?.[0]?.userName.indexOf("_") + 1] : "")}</Avatar>
                    <p className={clsx("rounded py-1 px-2", {
                        "bg-true-gray-300": usersData?.[0] === null,
                        "bg-brand-300": usersData?.[0] !== null
                    })}>{usersData?.[0] !== null ? usersData?.[0]?.userName.replace("_", " ") : "+ Assign"}</p>
                </div>
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    className: "flex flex-col space-y-2"
                }}
            >
                <button className="p-2" onClick={() => props.onSelect(null)}>
                    None
                </button>
                {usersData.map((user, index) => (
                    user !== null && (
                        <button className="p-2" key={index} onClick={() => props.onSelect(user)}>
                            <UserIcon userId={user.id} />
                        </button>
                    )
                ))}
            </Menu>
        </div>
    )
}