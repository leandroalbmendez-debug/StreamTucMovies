import { useState } from "react";

import { Alert, Button, Card, Form } from "react-bootstrap";

import { useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import type { User } from "../types/User";

interface UserFormData {
  username: string;
  email: string;
  password: string;
  plan: "free" | "premium";
}

interface UserFormProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  userToEdit: User | null;
  onCancelEdit: () => void;
}

function UserForm({
  users,
  onAddUser,
  onUpdateUser,
  userToEdit,
  onCancelEdit,
}: UserFormProps) {
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      username: userToEdit?.username || "",
      email: userToEdit?.email || "",
      password: userToEdit?.password || "",
      plan: userToEdit?.plan || "free",
    },
  });

  const onSubmit = (data: UserFormData) => {
    setFormError("");

    if (userToEdit) {
      const emailExists = users.some(
        (user) =>
          user.id !== userToEdit.id &&
          user.email.toLowerCase() === data.email.toLowerCase(),
      );

      const usernameExists = users.some(
        (user) =>
          user.id !== userToEdit.id &&
          user.username.toLowerCase() === data.username.toLowerCase(),
      );

      if (emailExists) {
        setFormError("Ya existe un usuario registrado con ese email.");
        return;
      }

      if (usernameExists) {
        setFormError("Ya existe un usuario registrado con ese nombre.");
        return;
      }

      const updatedUser: User = {
        ...userToEdit,
        username: data.username,
        email: data.email,
        password: data.password,
        plan: data.plan,
      };

      onUpdateUser(updatedUser);

      reset({
        username: "",
        email: "",
        password: "",
        plan: "free",
      });

      onCancelEdit();

      return;
    }

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === data.email.toLowerCase(),
    );

    const usernameExists = users.some(
      (user) =>
        user.username.toLowerCase() === data.username.toLowerCase(),
    );

    if (emailExists) {
      setFormError("Ya existe un usuario registrado con ese email.");
      return;
    }

    if (usernameExists) {
      setFormError("Ya existe un usuario registrado con ese nombre.");
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      password: data.password,
      role: "client",
      plan: data.plan,
      favorites: [],
      comments: [],
    };

    onAddUser(newUser);

    reset({
      username: "",
      email: "",
      password: "",
      plan: "free",
    });

    setFormError("");
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title className="mb-4">
          {userToEdit ? "Editar usuario" : "Crear usuario"}
        </Card.Title>

        {formError && <Alert variant="danger">{formError}</Alert>}

        <Form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Form.Group className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>

            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de usuario"
              autoComplete="off"
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
              placeholder="Ingrese el email"
              autoComplete="off"
              {...register("email", {
                required: {
                  value: true,
                  message: "El email es obligatorio.",
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message:
                    "Ingrese un email válido. Ejemplo: usuario@gmail.com",
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
              placeholder="Ingrese la contraseña"
              autoComplete="new-password"
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
            <Form.Label>Plan de streaming</Form.Label>

            <Form.Select {...register("plan")}>
              <option value="free">Gratis</option>
              <option value="premium">Premium</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            {userToEdit ? "Guardar cambios" : "Crear usuario"}
          </Button>

          {userToEdit && (
            <Button
              type="button"
              variant="secondary"
              className="ms-2"
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UserForm;