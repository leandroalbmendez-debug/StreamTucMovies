import { useMemo, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { CommentsAdminTable } from "../components/comments/CommentsAdminTable";
import { useLocalStorage as useLocalStorageCustom } from "../hooks/useLocalStorage";
import { useLocalStorage } from "@uidotdev/usehooks";
import { initialUsers } from "../data/initialUsers";
import { useData } from "../context/database";
import type { User } from "../types/User";

function Admin() {
  const [users, setUsers] = useLocalStorageCustom<User[]>(
    "streamtuc-users",
    initialUsers,
  );

  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const addUser = (newUser: User) => {
    setUsers((currentUsers) => [...currentUsers, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );
  };

  const deleteUser = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id),
    );
  };

  const editUser = (user: User) => {
    setUserToEdit(user);
  };

  const cancelEdit = () => {
    setUserToEdit(null);
  };

  return (
    <Container className="py-4">
      <h1>Panel de Administración</h1>

      <p>Gestión de usuarios de STREAMTUC</p>

      <UserForm
        key={userToEdit?.id ?? "nuevo"}
        onAddUser={addUser}
        onUpdateUser={updateUser}
        userToEdit={userToEdit}
        onCancelEdit={cancelEdit}
      />

      <h2 className="mb-3">Usuarios registrados</h2>

      <UserTable
        users={users}
        onDeleteUser={deleteUser}
        onEditUser={editUser}
      />
    </Container>
  );
}

export default Admin;