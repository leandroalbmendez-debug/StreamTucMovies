import { Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import logo from "../assets/Logo.png";

const SOCIAL_LINKS = [
  { label: "Instagram", icon: FaInstagram, href: "/404", external: false },
  { label: "Twitter", icon: FaTwitter, href: "/404", external: false },
  { label: "Facebook", icon: FaFacebookF, href: "/404", external: false },
  {
    label: "YouTube",
    icon: FaYoutube,
    href: "https://www.youtube.com/watch?v=UQAKL29bv3k",
    external: true,
  },
  {
    label: "GitHub",
    icon: FaGithub,
    href: "https://github.com/leandroalbmendez-debug/StreamTucMovies",
    external: true,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <Row className="gy-4">
          <Col md={4}>
            <Link to="/" className="app-footer-brand">
              <img src={logo} alt="StreamTUC" />
            </Link>
            <p className="app-footer-tagline">
              Tu catálogo de películas y series favoritas, en un solo lugar.
              Proyecto académico desarrollado por el equipo STREAMTUC.
            </p>
          </Col>

          <Col md={4}>
            <h6 className="app-footer-heading">Navegación</h6>
            <ul className="app-footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalog">Catálogo</Link></li>
              <li><Link to="/search">Buscar</Link></li>
              <li><Link to="/favorites">Favoritos</Link></li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="app-footer-heading">Seguinos</h6>
            <div className="app-footer-socials">
              {SOCIAL_LINKS.map(({ label, icon: Icon, href, external }) =>
                external ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="app-footer-social"
                  >
                    <Icon />
                  </a>
                ) : (
                  <Link
                    key={label}
                    to={href}
                    aria-label={label}
                    className="app-footer-social"
                  >
                    <Icon />
                  </Link>
                ),
              )}
            </div>
            <p className="app-footer-legal">
              STREAMTUC es un proyecto educativo sin fines comerciales.
              Todas las películas son ficticias o de demostración.
            </p>
          </Col>
        </Row>

        <hr className="app-footer-divider" />

        <p className="app-footer-copy">
          © {year} STREAMTUC. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}