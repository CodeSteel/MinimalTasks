import useAuth from "../hooks/useAuth.ts";
import LoadSpinner from "../components/LoadSpinner.tsx";
import SideNavbar from "../components/SideNavbar.tsx";
import TopNavbar, {Breadcrumb} from "../components/TopNavbar.tsx";
import {useEffect, useState} from "react";
import {User} from "../models/User.ts";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import DataTable from "../components/DataTable.tsx";
import UserIcon from "../components/UserIcon.tsx";
import UserRoleComp from "../components/UserRoleComp.tsx";

export default function UsersPage()
{
    const {authResponse, isLoading: isAuthLoading} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData] = useState<User[]>([]);
    
    useEffect(() => {
        fetch("api/User/GetAllUsers", {
            method: "GET"
        }).then((res) => {
            res.json().then((users) => {
                setUsersData(users);
                setIsLoading(false);
            });
        })
    }, [])

    const createColumn = createColumnHelper<User>();
    const columns: ColumnDef<User, any>[] = [
        createColumn.accessor("id", {
            header: () => (
                <div className="text-left text-true-gray-600">ID</div>
            ),
            cell: props => <p>{props.row.original.id}</p>
        }),
        createColumn.accessor('userName', {
            header: () => (
                <div className="text-left text-true-gray-600">User</div>
            ),
            cell: props => <UserIcon userId={props.row.original.id} />,
            filterFn: (row, _1, filterValue, _2) => {
                return row.original?.userName.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
            }
        }),
        createColumn.accessor('email', {
            header: () => (
                <div className="text-left text-true-gray-600">Email</div>
            ),
        }),
        createColumn.accessor('role', {
            header: () => (
                <div className="text-left text-true-gray-600">Role</div>
            ),
            cell: props => <UserRoleComp role={props.getValue()} />,
            meta:
            {
                filterVariant: 'role'
            },
            filterFn: (row, _, val) => {
                return row.original.role === val || val === "User" && row.original.role === null || val === "None";
            }
        })
    ];
    
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

    if (authResponse.role !== "Admin")
    {
        window.location.href = "/tickets";
        return;
    }

    const breadcrumbs: Breadcrumb[] = [
        { name: "Dashboard", href: "/" },
        { name: "Users", href: "/users" },
    ];

    return (
        <main className="flex w-full min-h-screen">
            <SideNavbar auth={authResponse}/>
            <div className="w-full ml-[15rem]">
                <TopNavbar auth={authResponse} page="Users" breadCrumbs={breadcrumbs}/>
                <div className="p-5">
                    <div className="p-8">
                        <DataTable data={usersData} columns={columns} showPagination={true} isLoading={isLoading}/>
                    </div>
                </div>
            </div>
        </main>
    )
}