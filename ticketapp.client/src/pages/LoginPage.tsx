import LoginRegisterForm from "../components/LoginRegisterForm.tsx";

export default function LoginPage()
{
    return (
        <main className="flex m-auto flex-col space-y-5 w-full">
            <h1 className="text-3xl font-black bg-gradient-to-t from-brand-500/[25%] mx-auto mb-12">Ticket Support</h1>
            <LoginRegisterForm startOnLogin={true}/>
        </main>
    )
}