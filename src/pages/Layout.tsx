import { Outlet } from "react-router";
import Navbar from "../components/navbar";
import { Footer } from "../components/footer";
import { useStyle } from "../context/styles";

export default function Layout() {
    const { theme } = useStyle();

    return (
        <div className={`app-shell ${theme}-mode d-flex flex-column min-vh-100`}>
            <Navbar />
            <div className="flex-grow-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}