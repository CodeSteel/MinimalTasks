import {Ticket, TicketPriority, TicketStatus} from "../models/Ticket.ts";
import UserIcon from "./UserIcon.tsx";
import TicketStatusComp from "./TicketStatusComp.tsx";
import TicketPriorityComp from "./TicketPriorityComp.tsx";
import {useEffect, useState} from "react";
import {User} from "../models/User.ts";
import UserSelect from "./UserSelect.tsx";
import {AuthResponse} from "../hooks/useAuth.ts";

export default function TicketEditBar(props: { ticket?: Ticket, authResponse: AuthResponse })
{
    const [allAgents, setAllAgents] = useState<User[]>();

    useEffect(() => {
        fetch("api/User/GetAllAgents",
            {
                method: "GET"
            }).then((resp) => {
                resp.json().then(result => {
                    setAllAgents(result);
                })
        })
    }, [])
    
    const updateStatus = (status: TicketStatus) => {
        fetch("api/Ticket/UpdateTicket", {
            method: "POST",
            body: JSON.stringify({id: props.ticket?.id!, status: TicketStatus[status]}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                window.location.reload();
            }
        })
    }

    const updateTicketAssignee = (user: User | null) =>
    {
        if (props.ticket === undefined) return;
        fetch("api/Ticket/UpdateTicket", {
            method: "POST",
            body: JSON.stringify({id: props.ticket.id, assignee: user !== null ? {id: user!.id, userName: user!.userName, email: user!.email} : null}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                window.location.reload();
            }
        })
    }

    const updatePriority = (priority: TicketPriority) => {
        fetch("api/Ticket/UpdateTicket", {
            method: "POST",
            body: JSON.stringify({id: props.ticket?.id!, priority: TicketPriority[priority]}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                window.location.reload();
            }
        })
    }
    
    return (
        <div className="w-[245px] fixed top-5 right-5 border border-true-gray-400/[0.5] p-5 shadow-2xl h-[95vh] rounded-lg flex flex-col">
            <div>
                <UserIcon userId={props.ticket?.owner?.id ?? ""}/>
                <h1 className="text-lg font-bold text-true-gray-800 mt-1">{props.ticket?.subject}</h1>
                <div className="w-full h-[1px] bg-true-gray-300 mt-3 mb-5"></div>

                <div className="flex flex-col space-y-3">
                    {props.authResponse.role === "Admin" && (
                        <div className="flex justify-between items-center">
                            <label className="text-true-gray-400">Status</label>
                            <TicketStatusComp includeNone={false} status={props.ticket?.status ?? TicketStatus.Closed}
                                              updateTicketStatus={updateStatus}/>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <label className="text-true-gray-400">Priority</label>
                        <TicketPriorityComp includeNone={false} priority={props.ticket?.priority ?? TicketPriority.Low}
                                            updateTicketPriority={updatePriority}/>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-true-gray-300 mt-3 mb-5"></div>
                {props.authResponse.role === "Admin" && (
                    <div>
                        <UserSelect userIds={[props.ticket?.assignee?.id ?? "", ...allAgents?.map(x => x.id) ?? []]}
                            onSelect={(user: User | null) => {
                                updateTicketAssignee(user)
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}