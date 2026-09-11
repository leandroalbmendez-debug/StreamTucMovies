import { Container } from "react-bootstrap";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialUsers } from "../data/initialUsers";
import type { User } from "../types/User";

function Admin() {
  const [users, setUsers] = useLocalStorage<User[]>(
    "streamtuc-users",
    initialUsers
  );

  const addUser = (newUser: User) => {
    setUsers((currentUsers) => [...currentUsers, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );
  };

  return (
    <Container className="py-4">
      <h1>Panel de Administración</h1>

      <p>Gestión de usuarios de STREAMTUC</p>

      <UserForm onAddUser={addUser} />

      <h2 className="mb-3">Usuarios registrados</h2>

      <UserTable
        users={users}
        onDeleteUser={deleteUser}
      />
    </Container>
  );
}

export default Admin;