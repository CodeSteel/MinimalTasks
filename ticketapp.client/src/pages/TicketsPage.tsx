import useAuth from "../hooks/useAuth.ts";
import LoadSpinner from "../components/LoadSpinner.tsx";
import SideNavbar from "../components/SideNavbar.tsx";

export default function TicketsPage()
{
    const {hasAuth, isLoading: isAuthLoading} = useAuth();
    
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
            <SideNavbar />
            <h1 className="p-5 text-3xl font-bold">Tickets Page</h1>
        </main>
    )
}