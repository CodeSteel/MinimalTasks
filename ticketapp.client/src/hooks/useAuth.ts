import {useEffect, useState} from "react";

export interface AuthResponse
{
    id: string,
    email: string,
    username: string,
    hasAuth: boolean,
    role: string
}

export default function useAuth()
{
    const [authResponse, setAuthResponse] = useState<AuthResponse>({
        id: "",
        email: "",
        username: "",
        hasAuth: false,
        role: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        fetch("api/ping", {
            method: "POST"
        })
            .then(resp => {
                if (resp.ok)
                {
                    resp.json().then(result => {
                        setAuthResponse(result);
                        setIsLoading(false);
                    })
                }
            })
    }, [])
    
    const logout = async () => {
        await fetch("api/logout",
        {
            method: "POST"        
        })
    }
    
    return { authResponse, logout, isLoading };
}