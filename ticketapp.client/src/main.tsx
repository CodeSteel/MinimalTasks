import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import TicketsPage from "./pages/TicketsPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/tickets",
        element: <TicketsPage />
    },
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
