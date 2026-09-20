import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router";

export function NotFound() {
  const location = useLocation();

  const isPasswordRecovery =
    location.pathname === "/recuperar-contrasena";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent] = useState(false);

  const handleRecoverySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailError("Ingresá un email válido. Ejemplo: nombre@gmail.com");
      return;
    }

    setEmailError("");
    setSent(true);
  };

  return (
    <Container fluid className="py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold">404</h1>

        {isPasswordRecovery ? (
          <>
            <h2 className="mb-3">
              Recuperación de contraseña
            </h2>

            {sent ? (
              <p className="lead mb-4">
                Revisá tu bandeja de entrada en <strong>{email}</strong> para
                continuar con la recuperación de tu contraseña.
              </p>
            ) : (
              <>
                <p className="lead mb-4">
                  Ingresá tu email y te enviamos las instrucciones para
                  recuperar tu contraseña.
                </p>

                <Form
                  onSubmit={handleRecoverySubmit}
                  className="mx-auto mb-4"
                  style={{ maxWidth: "400px" }}
                >
                  <Form.Group className="mb-3 text-start">
                    <Form.Control
                      type="email"
                      placeholder="Ingresá tu email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />

                    {emailError && (
                      <Form.Text className="text-danger">
                        {emailError}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100">
                    Enviar
                  </Button>
                </Form>
              </>
            )}
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