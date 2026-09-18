import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router";

export function NotFound() {
  const location = useLocation();

  const isPasswordRecovery =
    location.pathname === "/recuperar-contrasena";

  return (
    <Container fluid className="py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold">404</h1>

        {isPasswordRecovery ? (
          <>
            <h2 className="mb-3">
              Recuperación de contraseña
            </h2>

            <p className="lead mb-4">
              La recuperación de contraseña todavía no está
              disponible en STREAMTUC.
            </p>

            <p className="fs-5 mb-4">
              Estamos trabajando para que puedas recuperar tu
              contraseña próximamente.
            </p>
          </>
        ) : (
          <>
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
          </>
        )}

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