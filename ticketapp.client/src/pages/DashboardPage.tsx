import useAuth from "../hooks/useAuth.ts";
import LoadSpinner from "../components/LoadSpinner.tsx";
import SideNavbar from "../components/SideNavbar.tsx";

export default function DashboardPage()
{
    const {hasAuth, isLoading: isAuthLoading, username} = useAuth();
    
    if (isAuthLoading)
    {
        return (
            <main className="w-full flex min-h-screen">
                <LoadSpinner />
            </main>
        )
    }

    if (!hasAuth)
    {
        window.location.href = "/login";
        return;
    }
    
    return (
        <main className="flex">
            <SideNavbar/>
            <div className="p-5">
                <h1 className="text-3xl font-bold">Dashboard Page</h1>
                <p className="">Hello, {username}</p>
            </div>
        </main>
    )
}