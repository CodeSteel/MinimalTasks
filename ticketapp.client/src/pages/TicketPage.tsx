import {useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";
import LoadSpinner from "../components/LoadSpinner.tsx";
import SideNavbar from "../components/SideNavbar.tsx";
import TopNavbar, {Breadcrumb} from "../components/TopNavbar.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Ticket} from "../models/Ticket.ts";
import MessageBox from "../components/MessageBox.tsx";
import {TextField} from "@mui/material";
import UserIcon from "../components/UserIcon.tsx";
import TicketEditBar from "../components/TicketEditBar.tsx";

export default function TicketPage()
{
    const {authResponse, isLoading: isAuthLoading} = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [ticketData, setTicketData] = useState<Ticket>();
    const ticketId = new URLSearchParams(useLocation().search).get('ticketId');
    const [messageContent, setMessageContent] = useState('');

    useEffect(() => {
        fetch("/api/Ticket/GetTicketData?ticketId=" + ticketId, {
            method: "GET"
        }).then((resp) => {
            resp.json().then(result => {
                setTicketData(result);
                setIsLoading(false);
            })
        })
    }, [ticketId]);
    
    const sendMessage = () => {
        fetch("/api/Ticket/SendMessage", {
            method: "POST",
            body: JSON.stringify({ message: messageContent, ticketId }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((_) => {
            window.location.reload();
        })
    }
    
    if (isAuthLoading)
    {
        return (
            <main className="w-full flex min-h-screen">
                <LoadSpinner />
            </main>
        )
    }

    if (!authResponse.hasAuth)
    {
        window.location.href = "/login";
        return;
    }
    const ticketPage = (): ReactNode => {
        return (
            <div>
                <span className="flex items-center space-x-4">
                    <UserIcon userId={ticketData?.owner?.id!} />
                    <h1 className="text-xl font-bold text-true-gray-800">{ticketData?.subject}</h1>
                </span>
                
                {ticketData?.messages.map((x, index) => {
                    if (index === 0)
                    {
                        return (
                            <div key={index}>
                                <MessageBox authResponse={authResponse} message={x} showAvatar={false} />
                                <br />
                                <h1 className="text-xl underline underline-offset-2">Conversation</h1>
                            </div>
                        )
                    }
                    return <MessageBox key={index} authResponse={authResponse} message={x} showAvatar />
                })}

                <div className="flex flex-col w-full p-5 rounded m-5">
                    <TextField
                        id="standard-multiline-static"
                        label="Message"
                        placeholder="Type message..."
                        className="rounded"
                        multiline
                        rows={6}
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <button onClick={sendMessage} className="px-10 mr-auto bg-brand-500 text-white py-3 border border-true-gray-300 hover:border-transparent hover:bg-brand-600 duration-300 transition-all rounded mt-4">Send</button>
                </div>
            </div>
        )
    }

    const breadcrumbs: Breadcrumb[] = [
        { name: "Dashboard", href: "/" },
        { name: "Tickets", href: "/tickets" },
        { name: ("Ticket #" + ticketData?.id), href: ("/ticket?ticketId=" + ticketId) }
    ];

    return (
        <main className="flex w-full">
            <SideNavbar auth={authResponse}/>
            <div className="w-full mr-64 ml-[15rem]">
                <TopNavbar auth={authResponse} page={"Ticket"} breadCrumbs={breadcrumbs} />
                <div className="p-12">
                    {isLoading ? <LoadSpinner /> : ticketPage()}
                </div>
            </div>
            <TicketEditBar authResponse={authResponse} ticket={ticketData} />
        </main>
    )
}