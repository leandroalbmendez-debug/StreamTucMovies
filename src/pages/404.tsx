import { Container } from "react-bootstrap";
import { Link } from "react-router";
import { FaFilm } from "react-icons/fa";

export function NotFound() {
  return (
    <div className="status-page">
      <div className="status-page-glow" aria-hidden="true" />
      <Container fluid className="status-page-container">
        <div className="status-page-panel">
          <div className="status-page-icon">
            <FaFilm />
          </div>

          <h1 className="status-page-code">404</h1>

          <h2 className="status-page-title">Página no encontrada</h2>

          <p className="status-page-lead">
            Parece que esta película se perdió del catálogo
            de STREAMTUC.
          </p>

          <p className="status-page-text">
            La página que estás buscando no existe o fue movida.
          </p>

          <Link to="/" className="status-page-button">
            Volver al inicio
          </Link>
        </div>
      </Container>
    </div>
  );
}
