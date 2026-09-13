import {
  Button,
  Container,
  Nav,
  Navbar as BootstrapNavbar,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { User } from "../../types/User";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedUser, setLoggedUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("streamtuc-logged-user");

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  useEffect(() => {
    const updateLoggedUser = () => {
      const storedUser = localStorage.getItem("streamtuc-logged-user");

      if (storedUser) {
        setLoggedUser(JSON.parse(storedUser));
      } else {
        setLoggedUser(null);
      }
    };

    window.addEventListener("streamtuc-auth-change", updateLoggedUser);

    return () => {
      window.removeEventListener(
        "streamtuc-auth-change",
        updateLoggedUser,
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("streamtuc-logged-user");

    setLoggedUser(null);

    window.dispatchEvent(new Event("streamtuc-auth-change"));

    navigate("/login");
  };

  // En Login y Register no mostramos los datos del usuario logueado
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          STREAMTUC
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-streamtuc" />

        <BootstrapNavbar.Collapse id="navbar-streamtuc">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            {!isAuthPage && !loggedUser && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center">
            {loggedUser && !isAuthPage ? (
              <>
                <Nav.Link disabled>
                  Hola, {loggedUser.username}
                </Nav.Link>

                {loggedUser.role === "admin" && (
                  <Nav.Link as={Link} to="/admin">
                    Administrar
                  </Nav.Link>
                )}

                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-lg-2"
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                {!isAuthPage && (
                  <Nav.Link as={Link} to="/login">
                    Iniciar sesión
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
