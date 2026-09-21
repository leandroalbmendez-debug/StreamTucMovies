import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { FaPen, FaTrash } from "react-icons/fa";
import type { User } from "../types/User";

interface UserTableProps {
  users: User[];
  onDeleteUser: (id: string) => void;
  onEditUser: (user: User) => void;
  commentCounts: Record<string, number>;
}

function UserTable({
  users,
  onDeleteUser,
  onEditUser,
  commentCounts,
}: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDelete = () => {
    if (!userToDelete) {
      return;
    }

    onDeleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  return (
    <>
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
              <td>
                {(commentCounts[user.id] ?? 0) +
                  (commentCounts[user.username] ?? 0)}
              </td>
              <td>
                {user.role !== "admin" && (
                  <>
                    <Button
                      className="admin-edit-button me-2"
                      size="sm"
                      onClick={() => onEditUser(user)}
                    >
                      <FaPen />
                      Editar
                    </Button>

                    <Button
                      className="admin-delete-button"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                    >
                      <FaTrash />
                      Eliminar
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={userToDelete !== null}
        onHide={() => setUserToDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Estás seguro de que querés eliminar al usuario{" "}
          <strong>{userToDelete?.username}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setUserToDelete(null)}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserTable;