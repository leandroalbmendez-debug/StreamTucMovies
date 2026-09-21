import { Container } from "react-bootstrap";
import { Link } from "react-router";

export function NotFound() {
  return (
    <Container fluid className="py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold">404</h1>

        <h2 className="mb-3">
          Página no encontrada
        </h2>

        <p className="lead mb-4">
          Parece que esta película se perdió del catálogo
          de STREAMTUC.
        </p>

        <p className="fs-5 mb-4">
          La página que estás buscando no existe o fue movida.
        </p>

        <Link
          to="/"
          className="btn btn-primary"
        >
          Volver al inicio
        </Link>
      </div>
    </Container>
  );
}