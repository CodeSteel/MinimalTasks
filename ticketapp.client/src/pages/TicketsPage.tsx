import useAuth from "../hooks/useAuth.ts";
import LoadSpinner from "../components/LoadSpinner.tsx";
import SideNavbar from "../components/SideNavbar.tsx";
import TopNavbar, {Breadcrumb} from "../components/TopNavbar.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Ticket, TicketPriority, TicketStatus} from "../models/Ticket.ts";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import DataTable from "../components/DataTable.tsx";
import {faker} from "@faker-js/faker";
import {createFakeTicket} from "../utils/FakeTicketUtils.ts";
import UserIcon from "../components/UserIcon.tsx";
import TicketStatusComp from "../components/TicketStatusComp.tsx";
import TicketPriorityComp from "../components/TicketPriorityComp.tsx";
import UserSelect from "../components/UserSelect.tsx";
import {User} from "../models/User.ts";
import {FaRegTrashCan} from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function TicketsPage(props: {fakeData?: boolean})
{
    const {authResponse, isLoading: isAuthLoading} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [ticketData, setTicketData] = useState<Ticket[]>([]);
    const [allAgents, setAllAgents] = useState<User[]>();

    const updateTicketStatus = (ticketStatus: TicketStatus, index: number) =>
    {
        fetch("api/Ticket/UpdateTicket", {
            method: "POST",
            body: JSON.stringify({id: ticketData[index].id, status: TicketStatus[ticketStatus]}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                const newTicketData = [...ticketData];
                // @ts-ignore
                newTicketData[index].status = TicketStatus[ticketStatus];
                setTicketData(newTicketData);
            }
        })
    }

    const updateTicketPriority = (ticketPriority: TicketPriority, index: number) =>
    {
        fetch("api/Ticket/UpdateTicket", {
            method: "POST",
            body: JSON.stringify({id: ticketData[index].id, priority: TicketPriority[ticketPriority]}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            const newTicketData = [...ticketData];
            // @ts-ignore
            newTicketData[index].priority = TicketPriority[ticketPriority];
            setTicketData(newTicketData)
        })
    }

    const updateTicketAssignee = (index: number, user: User | null) =>
    {
        fetch("api/Ticket/UpdateTicket", {
            method: "POST",
            body: JSON.stringify({id: ticketData[index].id, assignee: user !== null ? {id: user!.id, userName: user!.userName, email: user!.email} : null}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                const newTicketData = [...ticketData];
                newTicketData[index].assignee = (user !== null ? {id: user!.id, userName: user!.userName, email: user!.email} : null);
                setTicketData(newTicketData);
            }
        })
    }
    
    const deleteTicket = (ticketId: string, index: number) => {
        fetch("api/Ticket/DeleteTicket", {
            method: "DELETE",
            body: JSON.stringify(ticketId),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok)
            {
                const newTicketData = [...ticketData];
                newTicketData.splice(index, 1);
                setTicketData(newTicketData);
            }
        })
    }

    useEffect(() => {
        if (!isAuthLoading && authResponse.role == "Admin")
        {
            if (props.fakeData)
            {
                setTicketData(faker.helpers.multiple(createFakeTicket, {
                    count: 100
                }))
                setIsLoading(false);
            } else {
                fetch("/api/Ticket/GetAllTickets").then((resp) => {
                    resp.json().then(result => {
                        setTicketData(result);
                        setIsLoading(false);
                    })
                })
            }
            
        } else if (isAuthLoading) {
            if (props.fakeData)
            {
                setTicketData(faker.helpers.multiple(createFakeTicket, {
                    count: 100
                }))
                setIsLoading(false);
            } else {
            fetch("/api/Ticket/GetMyTickets").then((resp) => {
                resp.json().then(result => {
                    setTicketData(result);
                    setIsLoading(false);
                })
            })
                }
        }

        fetch("/api/User/GetAllAgents").then((resp) => {
            resp.json().then(result => {
                setAllAgents(result);
            })
        })
    }, [isAuthLoading, authResponse, props.fakeData]);

    const rowActions = (index: number): ReactNode => {
        return (
            <div className="flex justify-center">
                <button onClick={() => deleteTicket(ticketData[index].id, index)}>
                    <FaRegTrashCan/>
                </button>
            </div>
        )
    }

    const createColumn = createColumnHelper<Ticket>();

    const columns: ColumnDef<Ticket, any>[] = [
        createColumn.accessor('id', {
            header: () => (
                <div className="text-left text-true-gray-600">ID</div>
            ),
            cell: props => <a className="duration-200 transition-colors hover:text-brand-400" href={"/ticket?ticketId=" + props.getValue()} >{props.getValue()}</a>
        }),
        createColumn.accessor('owner', {
            header: () => (
                <div className="text-left text-true-gray-600">Owner</div>
            ),
            cell: props => <UserIcon userId={props.getValue().id} />,
            filterFn: (row, columnId, filterValue, _) => {
                return (row.getValue(columnId) as User).userName.toLowerCase().includes(filterValue.toLowerCase());
            }
        }),
        createColumn.accessor('subject', {
            header: () => (
                <div className="text-left text-true-gray-600">Subject</div>
            ),
            cell: props => <a className="duration-200 transition-colors hover:text-brand-400" href={"/ticket?ticketId=" + ticketData[props.row.index].id} >{props.getValue()}</a>
        }),
        createColumn.accessor('status', {
            header: () => (
                <div className="text-left text-true-gray-600">Status</div>
            ),
            meta:
            {
                filterVariant: 'status'
            },
            cell: props => <TicketStatusComp selectable={authResponse.role === "Admin"} includeNone={false} status={props.getValue()} updateTicketStatus={(status: TicketStatus) => updateTicketStatus(status, props.row.index)} />,
            filterFn: (row, columnId, filterValue, _) => {
                return filterValue === "None" || (TicketStatus[row.getValue(columnId) as number]) === filterValue;
            }
        }),
        createColumn.accessor('priority', {
            header: () => (
                <div className="text-left text-true-gray-600">Priority</div>
            ),
            meta:
            {
                filterVariant: 'priority'
            },
            cell: props => <TicketPriorityComp includeNone={false} priority={props.getValue()} updateTicketPriority={(priority: TicketPriority) => updateTicketPriority(priority, props.row.index)} />,
            filterFn: (row, columnId, filterValue, _) => {
                return filterValue === "None" || (TicketPriority[row.getValue(columnId) as number]) === filterValue;
            }
        }),
        createColumn.accessor('messages', {
            header: () => (
                <div className="text-left text-true-gray-600">Last Message</div>
            ),
            cell: props => <UserIcon userId={props.getValue()[0]?.owner?.id} />
        }),
    ];

    if (!isAuthLoading && authResponse.role === "Admin") {
        columns.push(
            createColumn.accessor('assignee', {
                header: () => (
                    <div className="text-left text-true-gray-600">Assignee</div>
                ),
                cell: props => <UserSelect userIds={[props.getValue()?.id, ...allAgents?.map(x => x.id) ?? []]}
                   onSelect={(user: User | null) => {
                       updateTicketAssignee(props.row.index, user)
                   }}/>,
                filterFn: (row, columnId, filterValue, _) => {
                    return (row.getValue(columnId) as User | null)?.userName.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
                }
            })
        );
    }
    
    columns.push(
        createColumn.accessor('createdAt', {
            sortingFn: "datetime",
            header: () => (
                <div className="text-left text-true-gray-600">Creation Date</div>
            ),
            enableColumnFilter: false,
            cell: props => <p>{dayjs().to(dayjs(new Date(props.getValue())))}</p>
        }),
        createColumn.display({
            id: 'actions',
            header: () => (
                <div className="text-left text-true-gray-600">Actions</div>
            ),
            cell: props => rowActions(props.row.index)
        })
    )
    
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

    const breadcrumbs: Breadcrumb[] = [
        { name: "Dashboard", href: "/" },
        { name: "Tickets", href: "/tickets" }
    ];

    return (
        <main className="flex w-full">
            <SideNavbar auth={authResponse}/>
            <div className="w-full ml-[15rem]">
                <TopNavbar auth={authResponse} page="Tickets" breadCrumbs={breadcrumbs} />
                <div className="p-5">
                    <div className="p-8">
                        <DataTable data={ticketData} columns={columns} showPagination={true} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </main>
    )
}