import { Button, Table } from "react-bootstrap";
import type { User } from "../types/User";

interface UserTableProps {
  users: User[];
  onDeleteUser: (id: string) => void;
}

function UserTable({ users, onDeleteUser }: UserTableProps) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Plan</th>
          <th>Favoritos</th>
          <th>Comentarios</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.plan}</td>
            <td>{user.favorites.length}</td>
            <td>{user.comments.length}</td>

            <td>
              {user.role !== "admin" && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                >
                  Eliminar
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserTable;