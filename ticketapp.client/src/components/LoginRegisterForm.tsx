import {ReactNode, useState} from "react";
import clsx from "clsx";
import {IsEmailValid} from "../utils/EmailUtils.ts";

interface LoginForm
{
    email: string,
    password: string
}

interface RegisterForm
{
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
}

export default function LoginRegisterForm(props: {startOnLogin: boolean})
{
    const [viewingLoginForm, setViewingLoginForm] = useState(props.startOnLogin);
    const [loginForm, setLoginForm] = useState<LoginForm>({
        password: "",
        email: ""
    });
    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });
    const [getError, setError] = useState<string[]>([]);
    
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError([]);
        let shouldHandleLogin: boolean = true;

        if (loginForm.email === "")
        {
            setError((err) => [...err, "* No email provided."]);
            shouldHandleLogin = false;
        } else {
            // if (!IsEmailValid(loginForm.email))
            // {
            //     setError((err) => [...err, "* Email not valid."]);
            //     shouldHandleLogin = false;
            // }
        }
        
        if (loginForm.password === "")
        {
            setError((err) => [...err, "* No password provided."]);
            shouldHandleLogin = false;
        }
        
        if (shouldHandleLogin)
        {
            fetch("api/login?useCookies=true", {
                method: "POST",
                body: JSON.stringify(loginForm),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.ok)
                {
                    window.location.href = "/";
                }
                else
                {
                    setLoginForm({
                        email: "",
                        password: ""
                    });
                    setError((err) => [...err, "* Email/Password combination failed to authenticate."]);
                }
            })
        }
    }

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError([]);
        let shouldHandleRegister: boolean = true;

        if (registerForm.email === "")
        {
            setError((err) => [...err, "* No email provided."]);
            shouldHandleRegister = false;
        } else {
            if (!IsEmailValid(registerForm.email))
            {
                setError((err) => [...err, "* Email not valid."]);
                shouldHandleRegister = false;
            }
        }

        if (registerForm.password === "")
        {
            setError((err) => [...err, "* No password provided."]);
            shouldHandleRegister = false;
        } else {
            if (registerForm.password.length < 6)
            {
                setError((err) => [...err, "* Password must be 6 or more characters."]);
                shouldHandleRegister = false;
            } else if (registerForm.confirmPassword === "")
            {
                setError((err) => [...err, "* No confirm password provided."]);
                shouldHandleRegister = false;
            } else {
                if (registerForm.confirmPassword !== registerForm.password)
                {
                    setError((err) => [...err, "* Passwords do not match."]);
                    shouldHandleRegister = false;
                }
            }
        }
        
        if (registerForm.firstName === "")
        {
            setError((err) => [...err, "* No first name provided."]);
            shouldHandleRegister = false;
        } else {
            if (registerForm.firstName.length < 3)
            {
                setError((err) => [...err, "* First name must be 3 or more characters."]);
                shouldHandleRegister = false;
            }
        }

        if (registerForm.lastName === "")
        {
            setError((err) => [...err, "* No last name provided."]);
            shouldHandleRegister = false;
        } else {
            if (registerForm.lastName.length < 3)
            {
                setError((err) => [...err, "* Last name must be 3 or more characters."]);
                shouldHandleRegister = false;
            }
        }

        if (shouldHandleRegister)
        {
            fetch("api/register", {
                method: "POST",
                body: JSON.stringify(registerForm),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.ok)
                {
                    window.location.href = "/login";
                } else {
                    setRegisterForm({
                        email: "",
                        password: "",
                        confirmPassword: "",
                        firstName: "",
                        lastName: ""
                    });
                    setError((err) => [...err, "* Uh oh, something went wrong."]);
                }
            })
        }
    }

    const navButtonGroup = (): ReactNode => {
        return (
            <div className="mx-auto max-w-[350px] flex mb-10">
                <div className="mx-auto flex w-full">
                    <button className={clsx("p-3 w-full", {
                        "bg-brand-500": viewingLoginForm
                    })} onClick={() => {setViewingLoginForm(true); setError([])}}>Login</button>
                    <button className={clsx("p-3 w-full", {
                        "bg-brand-500": !viewingLoginForm
                    })} onClick={() => {setViewingLoginForm(false); setError([])}}>Register</button>
                </div>
            </div>
        )
    }

    if (viewingLoginForm)
    {
        return (
            <div>
                {navButtonGroup()}

                <form onSubmit={handleLogin} className="flex flex-col space-y-4 mx-auto w-[50%] max-w-[350px]">
                    {getError.map((x) => {
                        return <p className="text-red-500 h-full flex flex-col">{x}</p>
                    })}
                    
                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">Email/Username</label>
                        <input onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                               value={loginForm?.email} className="border rounded bg-transparent p-2" type="text"/>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">Password</label>
                        <input onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                               value={loginForm?.password} className="border rounded bg-transparent p-2" type="password"/>
                    </div>

                    <div className="flex flex-col">
                        <input
                            className="shadow-lg rounded p-2 bg-brand-500 transition-all duration-300 mt-5 cursor-pointer border border-transparent hover:border-brand-50/[0.5]"
                            type="submit" value="Login"/>
                    </div>
                </form>
            </div>
        );
    } else {
        return (
            <div>
                {navButtonGroup()}

                <form onSubmit={handleRegister} className="flex flex-col space-y-4 mx-auto w-[50%] max-w-[350px]">
                    {getError.map((x) => {
                        return <p className="text-red-500 h-full flex flex-col">{x}</p>
                    })}

                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">Email</label>
                        <input onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                               value={registerForm?.email} className="border rounded bg-transparent p-2" type="email"/>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">First Name</label>
                        <input onChange={e => setRegisterForm({...registerForm, firstName: e.target.value})}
                               value={registerForm?.firstName} className="border rounded bg-transparent p-2"
                               type="text"/>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">Last Name</label>
                        <input onChange={e => setRegisterForm({...registerForm, lastName: e.target.value})}
                               value={registerForm?.lastName} className="border rounded bg-transparent p-2"
                               type="text"/>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">Password</label>
                        <input onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                               value={registerForm?.password} className="border rounded bg-transparent p-2"
                               type="password"/>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-true-gray-500">Confirm Password</label>
                        <input onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                               value={registerForm?.confirmPassword} className="border rounded bg-transparent p-2"
                               type="password"/>
                    </div>

                    <div className="flex flex-col">
                        <input
                            className="shadow-lg rounded p-2 bg-brand-500 hover:bg-brand-600 transition-all duration-300 mt-5 cursor-pointer"
                            type="submit" value="Register"/>
                    </div>
                </form>
            </div>
        );
    }
}