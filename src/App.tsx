import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router";
import { RouterProvider } from "react-router/dom";
import { Button, Container } from "react-bootstrap";

import "./css/App.css";

import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Admin from "./pages/Admin";
import { Catalog } from "./components/catalog";
import { NotFound } from "./pages/404";

import Navbar from "./components/Navbar/Navbar";

import { useLocalStorage } from "./hooks/useLocalStorage";
import type { User } from "./types/User";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function ProtectedAdmin() {
  const [loggedUser] = useLocalStorage<User | null>(
    "streamtuc-logged-user",
    null,
  );

  const navigate = useNavigate();

  if (!loggedUser) {
    return <Navigate to="/login" replace />;
  }

  if (loggedUser.role !== "admin") {
    const handleBackToLogin = () => {
      navigate("/login");
    };

    return (
      <Container className="py-5 text-center">
        <h1>No tenés permisos</h1>

        <p className="mb-4">
          Esta sección es exclusiva para administradores de STREAMTUC.
        </p>

        <Button variant="primary" onClick={handleBackToLogin}>
          Volver al inicio de sesión
        </Button>
      </Container>
    );
  }

  return <Admin />;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/admin",
        element: <ProtectedAdmin />,
      },
      {
        path: "/catalog",
        element: <Catalog />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;