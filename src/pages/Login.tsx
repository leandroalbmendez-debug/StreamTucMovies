import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialUsers } from "../data/initialUsers";
import type { User } from "../types/User";

export function Login() {
  const navigate = useNavigate();

  const [users] = useLocalStorage<User[]>(
    "streamtuc-users",
    initialUsers,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email.trim() === "") {
      setEmailError("El email es obligatorio.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError(
        "Ingresá un email válido. Ejemplo: nombre@gmail.com",
      );
      hasError = true;
    }

    if (password === "") {
      setPasswordError("La contraseña es obligatoria.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const userFound = users.find(
      (user) =>
        user.email === email &&
        user.password === password,
    );

    if (!userFound) {
      setLoginError(
        "El email o la contraseña no son correctos. Revisá los datos e intentá nuevamente.",
      );
      return;
    }

    localStorage.setItem(
      "streamtuc-logged-user",
      JSON.stringify(userFound),
    );

    window.dispatchEvent(new Event("streamtuc-auth-change"));

    if (userFound.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Iniciar sesión
          </Card.Title>

          {loginError && (
            <Alert variant="danger">
              {loginError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Ingresá tu email"
              />

              {emailError && (
                <Form.Text className="text-danger">
                  {emailError}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Ingresá tu contraseña"
              />

              {passwordError && (
                <Form.Text className="text-danger">
                  {passwordError}
                </Form.Text>
              )}
            </Form.Group>

            <div className="text-center mb-3">
              <Link to="/recuperar-contrasena">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary">
                Iniciar sesión
              </Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleRegister}
              >
                Crear una cuenta
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}