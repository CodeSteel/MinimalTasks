import {AuthResponse} from "../hooks/useAuth.ts";
import {Breadcrumbs, Link} from "@mui/material";

export interface Breadcrumb
{
    name: string,
    href: string
}

export default function TopNavbar(props: {auth: AuthResponse, page: string, breadCrumbs: Breadcrumb[]})
{
    return (
        <div className="w-full h-[60px] bg-transparent flex px-8">
            <div className="my-auto mt-4">
                <p className="font-bold text-xl">{props.page}</p>
    
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {props.breadCrumbs.map((m, index) => (
                        <Link key={index} underline="hover" sx={{ color: index === props.breadCrumbs.length - 1 ? 'text.primary' : 'inherit' }} href={m.href}>
                            {m.name}
                        </Link>
                    ))}
                </Breadcrumbs>
            </div>
            
            <div className="my-auto ml-auto flex shadow-2xl">
                <h3 className="mr-3">{props.auth.username} </h3>
                <p className="mr-5 text-true-gray-400">|</p>

                {props.auth.role === "Admin" ? (
                    <button onClick={async () => {
                        await fetch("api/set-to-user",
                            {
                                method: "POST"
                            });
                        window.location.href = "/tickets";
                    }}>Admin</button>
                ) : (
                    <button onClick={async () => {
                        await fetch("api/set-to-admin",
                            {
                                method: "POST"
                            });
                        window.location.href = "/tickets";
                    }}>User</button>
                )}

                <button className="ml-5 border px-3 p border-brand-50/[0.4] rounded" onClick={async () => {
                    await fetch("api/logout",
                        {
                            method: "POST"
                        });
                    window.location.href = "/";
                }}>Logout
                </button>
            </div>
        </div>
    )
}