import {TicketPriority} from "../models/Ticket";
import clsx from "clsx";
import {Menu, MenuItem} from "@mui/material";
import React from "react";

export default function TicketPriorityComp(props: {priority: TicketPriority, updateTicketPriority: (priority: TicketPriority) => void, includeNone: boolean})
{
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
                    "bg-true-gray-200": props.priority === TicketPriority.None,
                    "bg-yellow-500": props.priority === TicketPriority.Low,
                    "bg-orange-500": props.priority === TicketPriority.Medium,
                    "bg-red-400": props.priority === TicketPriority.High
                })}>{TicketPriority[props.priority]}</p>
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
                {Object.values(TicketPriority).filter(key => isNaN(Number(key)) && (!props.includeNone ? key !== TicketPriority[TicketPriority.None] : true)).map((t) => {
                    return (
                        <MenuItem key={t} onClick={() => {handleClose(); props.updateTicketPriority(t as TicketPriority)}}>{t}</MenuItem>
                    )
                })}
            </Menu>
        </div>
    )
}