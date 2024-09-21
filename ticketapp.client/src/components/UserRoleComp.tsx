import clsx from "clsx";
import React from "react";
import {Menu, MenuItem} from "@mui/material";

export default function UserRoleComp(props: {role: string, updateUserRole?: (role: string) => void})
{
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (props.updateUserRole == undefined) return;
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div className="py-2">
            <button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <p className={clsx("px-4 py-1 rounded-3xl my-auto w-fit transition-all duration-300 hover:scale-105 font-normal", {
                    "bg-blue-400": props.role === "Admin",
                    "bg-true-gray-200": props.role === null || props.role === "None",
                })}>{props.role ?? "User"}</p>
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {Object.values(['None', 'User', 'Admin']).map((t) => {
                    return (
                        <MenuItem key={t} onClick={() => {
                            handleClose();
                            props.updateUserRole?.(t as string);
                        }}>{t}</MenuItem>
                    )
                })}
            </Menu>
        </div>
)
}