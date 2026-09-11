import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
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

    // Validación del email
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

    // Validación de contraseña
    if (password === "") {
      setPasswordError("La contraseña es obligatoria.");
      hasError = true;
    }

    // Si hay errores, detenemos el login
    if (hasError) {
      return;
    }

    // Buscamos el usuario
    const userFound = users.find(
      (user) => user.email === email && user.password === password,
    );

    // Si no encontramos el usuario
    if (!userFound) {
      setLoginError(
        "El email o la contraseña no son correctos. Revisá los datos e intentá nuevamente.",
      );
      return;
    }

    // Guardamos el usuario que inició sesión
    localStorage.setItem(
      "streamtuc-logged-user",
      JSON.stringify(userFound),
    );

    // Avisamos al Navbar
    window.dispatchEvent(new Event("streamtuc-auth-change"));

    // Según el rol, enviamos a una página diferente
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
          <Card.Title className="mb-4">
            Iniciar sesión en STREAMTUC
          </Card.Title>

          {loginError && (
            <Alert variant="danger">
              <strong>No pudimos iniciar sesión.</strong>
              <br />
              {loginError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                placeholder="Ejemplo: lucas@gmail.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                  setLoginError("");
                }}
                isInvalid={emailError !== ""}
              />

              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            {/* CONTRASEÑA */}
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                  setLoginError("");
                }}
                isInvalid={passwordError !== ""}
              />

              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>

            {/* BOTÓN LOGIN */}
            <Button
              type="submit"
              variant="primary"
              className="w-100"
            >
              Iniciar sesión
            </Button>
          </Form>

          {/* REGISTRO */}
          <div className="text-center mt-4">
            <p className="mb-2">¿No tenés una cuenta?</p>

            <Button
              variant="outline-primary"
              onClick={handleRegister}
            >
              Registrate
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
























