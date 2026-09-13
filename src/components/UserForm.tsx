import { useState, type FormEvent } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import type { User } from "../types/User";
interface UserFormProps {
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  userToEdit: User | null;
  onCancelEdit: () => void;
}
function UserForm({
  onAddUser,
  onUpdateUser,
  userToEdit,
  onCancelEdit,
}: UserFormProps) {
  const [username, setUsername] = useState(userToEdit?.username || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  const [password, setPassword] = useState(userToEdit?.password || "");
  const [plan, setPlan] = useState<"free" | "premium">(
    userToEdit?.plan || "free",
  );
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userToEdit) {
      const updatedUser: User = {
        ...userToEdit,
        username,
        email,
        password,
        plan,
      };
      onUpdateUser(updatedUser);
      onCancelEdit();
    } else {
      const newUser: User = {
        id: uuidv4(),
        username,
        email,
        password,
        role: "client",
        plan,
        favorites: [],
        comments: [],
      };
      onAddUser(newUser);
      setUsername("");
      setEmail("");
      setPassword("");
      setPlan("free");
    }
  };
  return (
    <Card className="mb-4">
      {" "}
      <Card.Body>
        {" "}
        <Card.Title>
          {" "}
          {userToEdit ? "Editar usuario" : "Crear usuario"}{" "}
        </Card.Title>{" "}
        <Form onSubmit={handleSubmit}>
          {" "}
          <Form.Group className="mb-3">
            {" "}
            <Form.Label>Nombre de usuario</Form.Label>{" "}
            <Form.Control
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              minLength={3}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
              required
              placeholder="Ingrese el nombre de usuario"
            />{" "}
            <Form.Text className="text-muted">
              {" "}
              El nombre debe tener mínimo 3 caracteres y solo puede contener
              letras y espacios.{" "}
            </Form.Text>{" "}
          </Form.Group>{" "}
          <Form.Group className="mb-3">
            {" "}
            <Form.Label>Email</Form.Label>{" "}
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="Ingrese el email"
            />{" "}
            <Form.Text className="text-muted">
              {" "}
              Ingrese un email válido. Ejemplo: usuario@gmail.com{" "}
            </Form.Text>{" "}
          </Form.Group>{" "}
          <Form.Group className="mb-3">
            {" "}
            <Form.Label>Contraseña</Form.Label>{" "}
            <Form.Control
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              pattern="(?=.*[A-Za-z])(?=.*[0-9]).{6,}"
              required
              placeholder="Ingrese la contraseña"
            />{" "}
            <Form.Text className="text-muted">
              {" "}
              La contraseña debe tener mínimo 6 caracteres e incluir al menos
              una letra y un número.{" "}
            </Form.Text>{" "}
          </Form.Group>{" "}
          <Form.Group className="mb-3">
            {" "}
            <Form.Label>Plan de streaming</Form.Label>{" "}
            <Form.Select
              value={plan}
              onChange={(event) =>
                setPlan(event.target.value as "free" | "premium")
              }
            >
              {" "}
              <option value="free">Gratis</option>{" "}
              <option value="premium">Premium</option>{" "}
            </Form.Select>{" "}
          </Form.Group>{" "}
          <Button type="submit" variant="primary">
            {" "}
            {userToEdit ? "Guardar cambios" : "Crear usuario"}{" "}
          </Button>{" "}
          {userToEdit && (
            <Button
              type="button"
              variant="secondary"
              className="ms-2"
              onClick={onCancelEdit}
            >
              {" "}
              Cancelar{" "}
            </Button>
          )}{" "}
        </Form>{" "}
      </Card.Body>{" "}
    </Card>
  );
}
export default UserForm;
