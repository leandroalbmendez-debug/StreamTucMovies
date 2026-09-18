import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialUsers } from "../data/initialUsers";
import type { User } from "../types/User";

interface LoginData {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();

  const [users] = useLocalStorage<User[]>(
    "streamtuc-users",
    initialUsers,
  );

  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    setLoginError("");

    const userFound = users.find(
      (user) =>
        user.email === data.email &&
        user.password === data.password,
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
    <Container fluid className="py-5">
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

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                placeholder="Ingresá tu email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "El email es obligatorio.",
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message:
                      "Ingresá un email válido. Ejemplo: nombre@gmail.com",
                  },
                })}
              />

              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                placeholder="Ingresá tu contraseña"
                {...register("password", {
                  required: {
                    value: true,
                    message: "La contraseña es obligatoria.",
                  },
                })}
              />

              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
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