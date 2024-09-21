import { useLocation } from 'react-router-dom'
import clsx from "clsx";
import {TbClipboardText} from "react-icons/tb";
import {MdPeopleAlt, MdSpaceDashboard} from "react-icons/md";
import {AuthResponse} from "../hooks/useAuth.ts";
import {IoIosCreate} from "react-icons/io";
import {FaTicket} from "react-icons/fa6";

export default function SideNavbar(props: { auth: AuthResponse })
{
    const {pathname: locationUrl} = useLocation();

    const ticketId = new URLSearchParams(useLocation().search).get('ticketId');
    
    return (
        <div className="fixed left-0 top-0 flex flex-col h-full w-[250px] bg-brand-800 py-4 text-white">
            <span className="mx-auto mt-2 flex items-center space-x-3">
                <FaTicket size={24} className="drop-shadow-2xl" />
                <h1 className="font-black text-xl drop-shadow-2xl text-nowrap">Tickets App</h1>
            </span>

                {props.auth.role === "Admin" ? (
                    <div className="w-full flex flex-col mt-10 space-y-2">
                        <a href="/" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                            "bg-brand-700": locationUrl == "/"
                        })}>
                            <MdSpaceDashboard size={24} />
                            <p className="font-bold">Dashboard</p>
                        </a>

                        <a href="/tickets" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                            "bg-brand-700": locationUrl == "/tickets"
                        })}>
                            <FaTicket size={24} />
                            <p className="font-bold">Tickets</p>
                        </a>

                        {ticketId !== null && (
                            <a href={"/ticket?ticketId=" + ticketId}
                               className={clsx("flex w-full space-x-4 items-center py-4 px-5 pl-10", {
                                   "bg-brand-700": locationUrl == "/ticket"
                               })}>
                                <TbClipboardText size={24} />
                                <p className="">Ticket #{ticketId}</p>
                            </a>
                        )}

                        <a href="/create-ticket" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                            "bg-brand-700": locationUrl == "/create-ticket"
                        })}>
                            <IoIosCreate size={24} />
                            <p className="font-bold">Create Ticket</p>
                        </a>

                        <a href="/users" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                            "bg-brand-700": locationUrl == "/users"
                        })}>
                            <MdPeopleAlt size={24} />
                            <p className="font-bold">Users</p>
                        </a>
                    </div>
                ) : (
                    <div className="w-full flex flex-col mt-10 space-y-2">
                        <a href="/tickets" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                            "bg-brand-700": locationUrl == "/tickets"
                        })}>
                            <FaTicket size={24} />
                            <p className="font-bold">My Tickets</p>
                        </a>

                        {ticketId !== null && (
                            <a href={"/ticket?ticketId="+ticketId} className={clsx("flex w-full space-x-4 items-center py-4 px-5 pl-10", {
                                "bg-brand-700": locationUrl == "/ticket"
                            })}>
                                <TbClipboardText size={24} />
                                <p className="">Ticket #{ticketId}</p>
                            </a>
                        )}

                        <a href="/create-ticket" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                            "bg-brand-700": locationUrl == "/create-ticket"
                        })}>
                            <IoIosCreate size={24} />
                            <p className="font-bold">Create Ticket</p>
                        </a>
                    </div>
                )}
        </div>
    )
}