import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import type { User } from "../types/User";
import type { Movie } from "../types/database";
import { getMoviePosterUrl } from "../data/customMovies";
import { useStyle } from "../context/styles";

interface UserTableProps {
  users: User[];
  onDeleteUser: (id: string) => void;
  onEditUser: (user: User) => void;
  commentCounts: Record<string, number>;
  getMovie: (movieId: string) => Movie | undefined;
}

function UserTable({
  users,
  onDeleteUser,
  onEditUser,
  commentCounts,
  getMovie,
}: UserTableProps) {
  const { theme } = useStyle();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToViewFavorites, setUserToViewFavorites] = useState<User | null>(null);

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
              <td>
                <span className={`admin-pill admin-pill-${user.role === "admin" ? "accent" : "neutral"}`}>
                  {user.role === "admin" ? "Admin" : "Cliente"}
                </span>
              </td>
              <td>
                <span className={`admin-pill admin-pill-${user.plan === "premium" ? "accent" : "neutral"}`}>
                  {user.plan === "premium" ? "Premium" : "Gratis"}
                </span>
              </td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  disabled={user.favorites.length === 0}
                  onClick={() => setUserToViewFavorites(user)}
                  aria-label={`Ver favoritos de ${user.username}`}
                >
                  {user.favorites.length}
                </Button>
              </td>
              <td>{(commentCounts[user.id] ?? 0) + (commentCounts[user.username] ?? 0)}</td>

              <td>
                {user.role !== "admin" && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => onEditUser(user)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                    >
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
        dialogClassName={`${theme}-mode`}
      >
        <Modal.Header closeButton closeVariant={theme === "dark" ? "white" : undefined}>
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

      <Modal
        show={userToViewFavorites !== null}
        onHide={() => setUserToViewFavorites(null)}
        centered
        dialogClassName={`${theme}-mode`}
      >
        <Modal.Header closeButton closeVariant={theme === "dark" ? "white" : undefined}>
          <Modal.Title>Favoritos de {userToViewFavorites?.username}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {userToViewFavorites?.favorites.length === 0 ? (
            <p className="text-muted mb-0">Este usuario todavía no tiene favoritos.</p>
          ) : (
            <ul className="list-unstyled mb-0">
              {userToViewFavorites?.favorites.map((movieId) => {
                const movie = getMovie(String(movieId));
                const posterUrl = getMoviePosterUrl(movie);

                return (
                  <li key={movieId} className="d-flex align-items-center gap-3 mb-2">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie ? `Portada de ${movie.title}` : "Portada no disponible"}
                        className="comments-admin-poster"
                      />
                    ) : (
                      <span className="comments-admin-poster d-flex align-items-center justify-content-center text-muted bg-body-secondary">—</span>
                    )}
                    <span>{movie?.title ?? "Película no disponible"}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserTable;