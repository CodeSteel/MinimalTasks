import {TicketStatus} from "../models/Ticket";
import clsx from "clsx";
import React from "react";
import {Menu, MenuItem} from "@mui/material";

export default function TicketStatusComp(props: {status: TicketStatus, updateTicketStatus: (status: TicketStatus) => void, includeNone: boolean, selectable: boolean})
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
            {props.selectable ? (
                <button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <p className={clsx("px-4 py-1 rounded-3xl my-auto w-fit transition-all duration-300 hover:scale-105 font-normal", {
                        "bg-true-gray-200": props.status === TicketStatus.None,
                        "bg-green-400": props.status === TicketStatus.Open,
                        "bg-red-400": props.status === TicketStatus.Closed
                    })}>{TicketStatus[props.status]}</p>
                </button>
            ) : (
                <p className={clsx("px-4 py-1 rounded-3xl my-auto w-fit transition-all duration-300 hover:scale-105 font-normal", {
                    "bg-true-gray-200": props.status === TicketStatus.None,
                    "bg-green-400": props.status === TicketStatus.Open,
                    "bg-red-400": props.status === TicketStatus.Closed
                })}>{TicketStatus[props.status]}</p>
            )}
            {props.selectable && (
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {Object.values(TicketStatus).filter(key => isNaN(Number(key)) && (!props.includeNone ? key !== TicketStatus[TicketStatus.None] : true)).map((t) => {
                    return (
                        <MenuItem key={t} onClick={() => {handleClose(); props.updateTicketStatus(t as TicketStatus)}}>{t}</MenuItem>
                    )
                })}
            </Menu>
            )}
        </div>
)
}