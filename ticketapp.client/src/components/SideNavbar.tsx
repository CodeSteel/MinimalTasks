import { useLocation } from 'react-router-dom'
import clsx from "clsx";
import {TbClipboardText} from "react-icons/tb";
import {MdDashboard} from "react-icons/md";

export default function SideNavbar()
{
    const {pathname: locationUrl} = useLocation();
    
    return (
        <div className="sticky flex flex-col h-full w-[250px] bg-brand-500 py-4">
            <span className="mx-auto mt-2">
                <h1 className="font-black text-2xl">Ticket Support</h1>
            </span>

            <div className="w-full flex flex-col mt-10 space-y-2">
                <a href="/" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                    "bg-brand-700": locationUrl == "/"
                })}>
                    <MdDashboard width={28} height={28}/>
                    <p className="font-bold">Dashboard</p>
                </a>
                
                <a href="/tickets" className={clsx("flex w-full space-x-4 items-center py-4 px-5", {
                    "bg-brand-700": locationUrl == "/tickets"
                })}>
                    <TbClipboardText width={32} height={32}/>
                    <p className="font-bold">Tickets</p>
                </a>
            </div>
        </div>
    )
}