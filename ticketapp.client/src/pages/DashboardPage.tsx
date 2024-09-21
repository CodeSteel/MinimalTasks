import useAuth from "../hooks/useAuth.ts";
import LoadSpinner from "../components/LoadSpinner.tsx";
import SideNavbar from "../components/SideNavbar.tsx";
import TopNavbar from "../components/TopNavbar.tsx";
import {MdPeopleAlt} from "react-icons/md";
import CardComponent from "../components/CardComponent.tsx";
import {useEffect, useState} from "react";
import {AppStat, AppStatType, GetAppStatOfType} from "../models/AppStat.ts";
import {RiMessage3Fill} from "react-icons/ri";
import {FaTicket} from "react-icons/fa6";

export default function DashboardPage()
{
    const {authResponse, isLoading: isAuthLoading} = useAuth();
    const [appStats, setAppStats] = useState<AppStat[]>();
    const [isLoadingApp, setIsLoadingApp] = useState<boolean>(true);
    const [dashboardStats, setDashboardStats] = useState<{
        totalTickets: number,
        ticketsUnassigned: number,
        ticketsOpen: number,
        myTickets: number,
        userChats: number,
        adminChats: number
    }>();
    const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);
    
    useEffect(() => {
        fetch("/api/Stats/GetAppStats", {
            method: "GET"
        }).then(resp => {
            if (resp.ok)
            {
                resp.json().then((res) => {
                    setAppStats(res)
                    setIsLoadingApp(false);
                });
            }
        });

        fetch("/api/Stats/GetDashboardStats", {
            method: "GET"
        }).then(resp => {
            if (resp.ok)
            {
                resp.json().then((res) => {
                    setDashboardStats(res)
                    setIsLoadingDashboard(false);
                });
            }
        });
    }, []);
    
    if (isAuthLoading || isLoadingApp || isLoadingDashboard)
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

    if (authResponse.role !== "Admin")
    {
        window.location.href = "/tickets";
        return;
    }

    return (
        <main className="flex w-full min-h-screen">
            <SideNavbar auth={authResponse}/>
            <div className="w-full h-full ml-[15rem]">
                <TopNavbar auth={authResponse} page="Dashboard" breadCrumbs={[]} />
                <div className="flex flex-col mt-5 justify-evenly h-[85%]">
                    <div className="flex flex-row gap-5 px-5 w-full">
                        <div className="flex w-full flex-row justify-center space-x-10">
                            <div className="border border-true-gray-300 shadow-xl rounded py-2 flex">
                                <span className="m-auto px-10 py-2 text-center min-w-[250px]">
                                    <p className="text-lg"># of Tickets</p>
                                    <p className="text-4xl text-brand-600 font-bold">{dashboardStats?.totalTickets}</p>
                                </span>
                            </div>
                            <div className="border border-true-gray-300 shadow-xl rounded py-2 flex">
                                <span className="m-auto px-10 py-2 text-center min-w-[250px]">
                                    <p className="text-lg">Tickets Unassigned</p>
                                    <p className="text-4xl text-brand-600 font-bold">{dashboardStats?.ticketsUnassigned}</p>
                                </span>
                            </div>
                            <div className="border border-true-gray-300 shadow-xl rounded py-2 flex">
                                <span className="m-auto px-10 py-2 text-center min-w-[250px]">
                                    <p className="text-lg">Tickets Open</p>
                                    <p className="text-4xl text-brand-600 font-bold">{dashboardStats?.ticketsOpen}</p>
                                </span>
                            </div>
                            <div className="border border-true-gray-300 shadow-xl rounded py-2 flex">
                                <span className="m-auto px-10 py-2 text-center min-w-[250px]">
                                    <p className="text-lg">My Tickets</p>
                                    <p className="text-4xl text-brand-600 font-bold">{dashboardStats?.myTickets}</p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 flex gap-5">
                        <CardComponent title={""} stats={
                            [{value: GetAppStatOfType(AppStatType.TicketsOpened, appStats)?.value ?? 0, name: "Tickets Opened", icon: <FaTicket className="text-green-600 text-2xl"/>},
                                {value: (GetAppStatOfType(AppStatType.TicketsClosed, appStats)?.value ?? 0) + (GetAppStatOfType(AppStatType.TicketsClosedLate, appStats)?.value ?? 0), name: "Tickets Closed", icon: <FaTicket className="text-red-600 text-2xl"/>},
                                {value: GetAppStatOfType(AppStatType.ChatsSent, appStats)?.value ?? 0, name: "Chats Sent", icon: <RiMessage3Fill className="text-cyan-600 text-2xl"/>},
                                {value: GetAppStatOfType(AppStatType.UsersRegistered, appStats)?.value ?? 0, name: "Users Registered", icon: <MdPeopleAlt className="text-orange-600 text-2xl"/>},
                            ]} pies={[[
                                {id: 0, value: dashboardStats?.userChats ?? 0, label: 'Chat by User', color: 'orange'},
                                {id: 1, value: dashboardStats?.adminChats ?? 0, label: 'Chat by Admin', color: 'red'},],
                            [
                                {id: 0, value: GetAppStatOfType(AppStatType.TicketsClosed, appStats)?.value ?? 0, label: 'Tickets Closed'},
                                {id: 1, value: GetAppStatOfType(AppStatType.TicketsClosedLate, appStats)?.value ?? 0, label: 'Tickets Closed Late'},]
                            ]}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}