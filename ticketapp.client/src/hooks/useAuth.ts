import {useEffect, useState} from "react";

export default function useAuth()
{
    const [authResponse, setAuthResponse] = useState({
        email: "",
        username: "",
        hasAuth: false
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
    
    return { ...authResponse, logout, isLoading };
}