import {useState} from "react";
import {TicketPriority} from "../models/Ticket.ts";

function getEnumKeys<
    T extends string,
    TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
    return Object.keys(enumVariable) as Array<T>;
}

export default function CreateTicket()
{
    const [createTicketData, setCreateTicketData] = useState({
        subject: "",
        message: "",
        priority: TicketPriority.Low
    });
    
    const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        fetch("api/Ticket/CreateTicket", {
            method: "PUT",
            body: JSON.stringify({...createTicketData, priority: createTicketData.priority.valueOf()}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                window.location.href = "/tickets";
            } else {
                console.log(resp);
            }
        })
    }
    
    return (
        <div className="m-auto w-full">
            <form onSubmit={handleCreateTicket} className="flex flex-col space-y-4 mx-auto w-[50%] max-w-[350px]">
                <div className="flex flex-col space-y-1">
                    <label className="text-true-gray-500">Subject</label>
                    <input onChange={e => setCreateTicketData({...createTicketData, subject: e.target.value})}
                           value={createTicketData?.subject} className="border rounded border-true-gray-300 bg-transparent p-2" type="text"/>
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-true-gray-500">Description</label>
                    <textarea onChange={e => setCreateTicketData({...createTicketData, message: e.target.value})}
                              value={createTicketData?.message} className="border rounded border-true-gray-300 bg-transparent p-2"/>
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-true-gray-500">Priority</label>
                    <select onChange={e => setCreateTicketData({...createTicketData, priority: TicketPriority[e.target.value as keyof typeof TicketPriority]})}
                              value={TicketPriority[createTicketData?.priority]} className="border rounded border-true-gray-300 bg-transparent p-2">
                        {getEnumKeys(TicketPriority).filter(key => isNaN(Number(key)) && key !== TicketPriority[TicketPriority.None]).map((t) => {
                            return (
                                <option key={t} value={t}>{t}</option>
                            )
                        })}
                    </select>
                </div>


                <div className="flex flex-col">
                    <input
                        className="shadow-lg rounded p-2 bg-brand-500 transition-all duration-300 mt-5 cursor-pointer border border-transparent hover:border-brand-50/[0.5]"
                        type="submit" value="Submit"/>
                </div>
            </form>
        </div>
    )
}