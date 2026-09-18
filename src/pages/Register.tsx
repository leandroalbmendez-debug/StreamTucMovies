import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialUsers } from "../data/initialUsers";
import type { User } from "../types/User";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  plan: "free" | "premium";
}

export function Register() {
  const navigate = useNavigate();

  const [users, setUsers] = useLocalStorage<User[]>(
    "streamtuc-users",
    initialUsers,
  );

  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterData>({
    defaultValues: {
      plan: "free",
    },
  });

  const onSubmit = (data: RegisterData) => {
    setRegisterError("");
    setSuccessMessage("");

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (emailExists) {
      setRegisterError(
        "Ya existe una cuenta registrada con este email.",
      );
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      username: data.username,
      role: "client",
      plan: data.plan,
      favorites: [],
      comments: [],
    };

    setUsers((currentUsers) => [...currentUsers, newUser]);

    setSuccessMessage(
      "¡Cuenta creada correctamente! Ahora podés iniciar sesión.",
    );

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <Container fluid className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Crear una cuenta
          </Card.Title>

          {registerError && (
            <Alert variant="danger">
              {registerError}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success">
              {successMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>

              <Form.Control
                type="text"
                placeholder="Ingresá tu nombre de usuario"
                {...register("username", {
                  required: {
                    value: true,
                    message: "El nombre de usuario es obligatorio.",
                  },
                  minLength: {
                    value: 3,
                    message:
                      "El nombre de usuario debe tener mínimo 3 caracteres.",
                  },
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
                    message:
                      "El nombre de usuario solo puede contener letras y espacios.",
                  },
                })}
              />

              {errors.username && (
                <Form.Text className="text-danger">
                  {errors.username.message}
                </Form.Text>
              )}
            </Form.Group>

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
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
                  },
                })}
              />

              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repetir contraseña</Form.Label>

              <Form.Control
                type="password"
                placeholder="Repetí tu contraseña"
                {...register("repeatPassword", {
                  required: {
                    value: true,
                    message: "Tenés que repetir la contraseña.",
                  },
                  validate: (value) =>
                    value === getValues("password") ||
                    "Las contraseñas no coinciden.",
                })}
              />

              {errors.repeatPassword && (
                <Form.Text className="text-danger">
                  {errors.repeatPassword.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Plan de streaming</Form.Label>

              <Form.Select {...register("plan")}>
                <option value="free">Gratis</option>
                <option value="premium">Premium</option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
            >
              Crear cuenta
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}