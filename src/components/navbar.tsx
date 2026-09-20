import {
  Button,
  Container,
  Modal,
  Nav,
  Navbar as BootstrapNavbar,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { useStyle } from "../context/styles";
import logo from "../assets/Logo.png";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, switchTheme } = useStyle();

  const [loggedUser, setLoggedUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("streamtuc-logged-user");

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  // Cierra el menú mobile si el usuario scrollea con el menú abierto,
  // en vez de dejarlo pegado en pantalla sin cerrarse solo.
  useEffect(() => {
    if (!expanded) return;

    const handleScroll = () => setExpanded(false);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [expanded]);

  const closeMenu = () => setExpanded(false);

  const handleLogout = () => {
    localStorage.removeItem("streamtuc-logged-user");

    setLoggedUser(null);

    window.dispatchEvent(new Event("streamtuc-auth-change"));

    setShowLogoutModal(false);
    closeMenu();

    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <BootstrapNavbar
        className={`${theme}-mode catalog-navbar`}
        variant="dark"
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
      >
        <Container fluid>
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="catalog-brand"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="StreamTUC"
              className="catalog-brand-logo"
            />
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="navbar-streamtuc" />

          <BootstrapNavbar.Collapse id="navbar-streamtuc">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" onClick={closeMenu}>
                Inicio
              </Nav.Link>

              <Nav.Link as={Link} to="/catalog" onClick={closeMenu}>
                Catálogo
              </Nav.Link>

              <Nav.Link as={Link} to="/search" onClick={closeMenu}>
                <FaSearch className="me-1" />
                Buscar
              </Nav.Link>

              {!isAuthPage && !loggedUser && (
                <Nav.Link as={Link} to="/login" onClick={closeMenu}>
                  Login
                </Nav.Link>
              )}
            </Nav>

            <Nav className="align-items-lg-center">
              <Button
                variant="link"
                className="catalog-theme-button"
                type="button"
                aria-label={
                  theme === "dark"
                    ? "Cambiar a tema claro"
                    : "Cambiar a tema oscuro"
                }
                title={
                  theme === "dark"
                    ? "Tema claro"
                    : "Tema oscuro"
                }
                onClick={switchTheme}
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </Button>

              {loggedUser && !isAuthPage ? (
                <>
                  <Nav.Link disabled>
                    Hola, {loggedUser.username}
                  </Nav.Link>

                  <Nav.Link as={Link} to="/favorites" onClick={closeMenu}>
                    Favoritos
                  </Nav.Link>

                  {loggedUser.role === "admin" && (
                    <Nav.Link as={Link} to="/admin" onClick={closeMenu}>
                      Administrar
                    </Nav.Link>
                  )}

                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setShowLogoutModal(true)}
                    className="catalog-logout-button ms-lg-2"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  {!isAuthPage && (
                    <Nav.Link as={Link} to="/login" onClick={closeMenu}>
                      Iniciar sesión
                    </Nav.Link>
                  )}
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>¿Cerrar sesión?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Estás seguro de que querés cerrar tu sesión de STREAMTUC?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleLogout}
          >
            Sí, cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Navbar;