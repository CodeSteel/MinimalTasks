import CreateTicket from "../components/CreateTicket.tsx";
import SideNavbar from "../components/SideNavbar.tsx";
import useAuth from "../hooks/useAuth.ts";
import TopNavbar, {Breadcrumb} from "../components/TopNavbar.tsx";

export default function CreateTicketPage()
{
    const {authResponse} = useAuth();
    
    const breadcrumbs: Breadcrumb[] = [
        { name: "Dashboard", href: "/" },
        { name: "Create Ticket", href: "/create-ticket" }
    ];
    
    return (
        <main className="w-full min-h-screen flex">
            <SideNavbar auth={authResponse}/>
            <div className="w-full h-full flex flex-col">
                <TopNavbar auth={authResponse} page="Create Ticket" breadCrumbs={breadcrumbs} />
                <div className="my-auto">
                    <CreateTicket/>
                </div>
            </div>
        </main>
)
}