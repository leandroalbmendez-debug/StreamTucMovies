import { useMemo, useState } from "react";
import { Alert, Container, Row, Col, Form, Nav } from "react-bootstrap";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { CommentsAdminTable } from "../components/comments/CommentsAdminTable";
import { useLocalStorage } from "@uidotdev/usehooks";
import { initialUsers } from "../data/initialUsers";
import { useData } from "../context/database";
import type { User } from "../types/User";
import type { Comment } from "../types/comment";
import { CustomMoviesAdmin } from "../components/CustomMoviesAdmin";

function Admin() {
  const [users, setUsers] = useLocalStorage<User[]>(
    "streamtuc-users",
    initialUsers,
  );

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const addUser = (newUser: User) => {
    setUsers((currentUsers) => [...currentUsers, newUser]);

    setSuccessMessage(
      `El usuario ${newUser.username} se creó exitosamente.`,
    );

    setFormKey((currentKey) => currentKey + 1);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );

    setSuccessMessage(
      `El usuario ${updatedUser.username} se actualizó exitosamente.`,
    );
  };

  const deleteUser = (id: string) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
  };

  const editUser = (user: User) => {
    setSuccessMessage("");
    setUserToEdit(user);
  };

  const cancelEdit = () => {
    setUserToEdit(null);
  };

  const [allComments, setAllComments] = useLocalStorage<Comment[]>(
    "comments",
    [],
  );

  const { list: movies } = useData();

  const [movieFilter, setMovieFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const getMovie = (movieId: string) => movies.find((m) => String(m.id) === movieId);

  const getMovieTitle = (movieId: string) => {
    const movie = getMovie(movieId);
    return movie ? movie.title : `Película #${movieId}`;
  };

  const uniqueMovieIds = useMemo(
    () => Array.from(new Set(allComments.map((c) => c.movieId))),
    [allComments],
  );

  const uniqueAuthors = useMemo(
    () => Array.from(new Set(allComments.map((c) => c.author))).sort(),
    [allComments],
  );

  const filteredComments = useMemo(() => {
    return allComments
      .filter((c) => (movieFilter ? c.movieId === movieFilter : true))
      .filter((c) => (authorFilter ? c.author === authorFilter : true))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [allComments, movieFilter, authorFilter]);

  const toggleHidden = (id: string) => {
    setAllComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),
    );
  };

  const deleteComment = (id: string) => {
    setAllComments((prev) => prev.filter((c) => c.id !== id));
  };

    const commentCountByAuthor = useMemo(() => {
    const counts: Record<string, number> = {};
    allComments.forEach((comment) => {
      const key = comment.authorId ?? comment.author;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [allComments]);

  return (
    <Container fluid className="catalog-page">
      <div className="catalog-explorer">
        <div className="catalog-section-heading">
          <div>
            <span className="catalog-eyebrow">Gestión de STREAMTUC</span>
            <h1>Panel de Administración</h1>
          </div>
        </div>

        <p>Gestión de usuarios de STREAMTUC</p>

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key || "users")}
        className="mb-4"
      >
        <Nav.Item>
          <Nav.Link eventKey="users">
            Usuarios y comentarios
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="movies">
            Películas personalizadas
          </Nav.Link>
        </Nav.Item>
      </Nav>

        {activeTab === "movies" ? (
        <CustomMoviesAdmin />
      ) : (
        <>
          {successMessage && (
            <Alert variant="success">
              {successMessage}
            </Alert>
          )}

          <UserForm
            key={`${userToEdit?.id ?? "nuevo"}-${formKey}`}
            users={users}
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
            commentCounts={commentCountByAuthor}
          />

          <h2 className="mt-5 mb-3">Comentarios</h2>

          <Row className="mb-3 g-2">
            <Col md={4}>
              <Form.Select
                value={movieFilter}
                onChange={(e) => setMovieFilter(e.target.value)}
              >
                <option value="">Todas las películas</option>

                {uniqueMovieIds.map((movieId) => (
                  <option
                    key={movieId}
                    value={movieId}
                  >
                    {getMovieTitle(movieId)}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              >
                <option value="">Todos los usuarios</option>

                {uniqueAuthors.map((author) => (
                  <option
                    key={author}
                    value={author}
                  >
                    {author}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <CommentsAdminTable
            comments={filteredComments}
            getMovieTitle={getMovieTitle}
            getMovie={getMovie}
            onToggleHidden={toggleHidden}
            onDelete={deleteComment}
          />
        </>
        )}
      </div>
    </Container>
  );
}

export default Admin;