import { Outlet } from "react-router";
import Navbar from "../components/navbar";
import { useStyle } from "../context/styles";

export default function Layout() {
    const { theme } = useStyle();

    return (
        <div className={`app-shell ${theme}-mode`}>
            <Navbar />
            <Outlet />
        </div>
    );
}