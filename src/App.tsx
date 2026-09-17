import { createBrowserRouter, Navigate, useNavigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Button, Container } from "react-bootstrap";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Admin from "./pages/Admin";
import { Catalog } from "./components/catalog/catalog";
import { Detail } from "./components/catalog/detail";
import { Favorites } from "./pages/Favorites";
import { NotFound } from "./pages/404";
import type { User } from "./types/User";
import { useLocalStorage } from "@uidotdev/usehooks";
import "./css/App.css";
import Layout from "./pages/Layout";
import { Search } from "./pages/Search";

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
        path: "/search",
        element: <Search />,
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
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/detail",
        element: <Detail />,
      },
      {
        path: "/detail/:movieId",
        element: <Detail />,
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
