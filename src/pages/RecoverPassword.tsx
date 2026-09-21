import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

export function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailError("Ingresá un email válido. Ejemplo: nombre@gmail.com");
      return;
    }

    setEmailError("");
    setSent(true);
  };

  return (
    <div className="status-page">
      <div className="status-page-glow" aria-hidden="true" />
      <Container fluid className="status-page-container">
        <div className="status-page-panel">
          <div className="status-page-icon">
            <FaLock />
          </div>

          <h2 className="status-page-title">Recuperación de contraseña</h2>

          {sent ? (
            <p className="status-page-lead">
              Revisá tu bandeja de entrada en <strong>{email}</strong> para
              continuar con la recuperación de tu contraseña.
            </p>
          ) : (
            <>
              <p className="status-page-lead">
                Ingresá tu email y te enviamos las instrucciones para
                recuperar tu contraseña.
              </p>

              <Form onSubmit={handleSubmit} className="status-page-form">
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

          <Link to="/" className="status-page-button">
            Volver al inicio
          </Link>
        </div>
      </Container>
    </div>
  );
}
