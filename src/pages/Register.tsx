import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialUsers } from "../data/initialUsers";
import type { User } from "../types/User";

export function Register() {
  const navigate = useNavigate();

  const [users, setUsers] = useLocalStorage<User[]>(
    "streamtuc-users",
    initialUsers,
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [plan, setPlan] = useState<"free" | "premium">("free");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
    setRegisterError("");
    setSuccessMessage("");

    let hasError = false;

    // Validación del nombre
    if (username.trim() === "") {
      setUsernameError("El nombre de usuario es obligatorio.");
      hasError = true;
    }

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

    // Verificar si el email ya existe
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailExists) {
      setEmailError("Ya existe una cuenta registrada con este email.");
      hasError = true;
    }

    // Validación de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (password === "") {
      setPasswordError("La contraseña es obligatoria.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
      );
      hasError = true;
    }

    // Validación de repetición de contraseña
    if (repeatPassword === "") {
      setRepeatPasswordError("Tenés que repetir la contraseña.");
      hasError = true;
    } else if (password !== repeatPassword) {
      setRepeatPasswordError("Las contraseñas no coinciden.");
      hasError = true;
    }

    // Si hay errores, no creamos el usuario
    if (hasError) {
      return;
    }

    // Creamos el nuevo usuario
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email,
      password: password,
      username: username,
      role: "client",
      plan: plan,
      favorites: [],
      comments: [],
    };

    // Guardamos el nuevo usuario
    setUsers((currentUsers) => [...currentUsers, newUser]);

    setSuccessMessage(
      "¡Cuenta creada correctamente! Ahora podés iniciar sesión.",
    );

    // Limpiamos el formulario
    setUsername("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setPlan("free");

    // Después de 2 segundos vamos al Login
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "550px" }}>
        <Card.Body>
          <Card.Title className="mb-4">
            Crear cuenta en STREAMTUC
          </Card.Title>

          {registerError && (
            <Alert variant="danger">{registerError}</Alert>
          )}

          {successMessage && (
            <Alert variant="success">{successMessage}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Nombre */}
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>

              <Form.Control
                type="text"
                placeholder="Ingresá tu nombre"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setUsernameError("");
                }}
                isInvalid={usernameError !== ""}
              />

              <Form.Control.Feedback type="invalid">
                {usernameError}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                placeholder="Ejemplo: nombre@gmail.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                }}
                isInvalid={emailError !== ""}
              />

              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Contraseña */}
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                isInvalid={passwordError !== ""}
              />

              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>

              <Form.Text className="text-muted">
                Debe tener 8 caracteres, una mayúscula, una minúscula y un
                número.
              </Form.Text>
            </Form.Group>

            {/* Repetir contraseña */}
            <Form.Group className="mb-3">
              <Form.Label>Repetir contraseña</Form.Label>

              <Form.Control
                type="password"
                placeholder="Repetí tu contraseña"
                value={repeatPassword}
                onChange={(event) => {
                  setRepeatPassword(event.target.value);
                  setRepeatPasswordError("");
                }}
                isInvalid={repeatPasswordError !== ""}
              />

              <Form.Control.Feedback type="invalid">
                {repeatPasswordError}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Plan */}
            <Form.Group className="mb-4">
              <Form.Label>Elegí tu plan</Form.Label>

              <Form.Check
                type="radio"
                label="Free - Plan gratuito"
                name="plan"
                value="free"
                checked={plan === "free"}
                onChange={() => setPlan("free")}
              />

              <Form.Check
                type="radio"
                label="Premium - Plan Premium"
                name="plan"
                value="premium"
                checked={plan === "premium"}
                onChange={() => setPlan("premium")}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Crear cuenta
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
