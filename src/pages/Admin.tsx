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
import type { Comment } from "../types/comment";

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
		setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
	};
	const editUser = (user: User) => {
		setUserToEdit(user);
	};
	const cancelEdit = () => {
		setUserToEdit(null);
	};

	// --- Panel de comentarios ---
	const [allComments, setAllComments] = useLocalStorage<Comment[]>(
		"comments",
		[],
	);
	const { list: movies } = useData();
	const [movieFilter, setMovieFilter] = useState("");
	const [authorFilter, setAuthorFilter] = useState("");

	const getMovieTitle = (movieId: string) => {
		const movie = movies.find((m) => String(m.id) === movieId);
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
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

	return (
		<Container className="py-4">
			<h1>Panel de Administración</h1>
			<p>Gestión de usuarios de STREAMTUC</p>
			<UserForm
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

			<h2 className="mt-5 mb-3">Comentarios</h2>
			<Row className="mb-3 g-2">
				<Col md={4}>
					<Form.Select
						value={movieFilter}
						onChange={(e) => setMovieFilter(e.target.value)}>
						<option value="">Todas las películas</option>
						{uniqueMovieIds.map((movieId) => (
							<option
								key={movieId}
								value={movieId}>
								{getMovieTitle(movieId)}
							</option>
						))}
					</Form.Select>
				</Col>
				<Col md={4}>
					<Form.Select
						value={authorFilter}
						onChange={(e) => setAuthorFilter(e.target.value)}>
						<option value="">Todos los usuarios</option>
						{uniqueAuthors.map((author) => (
							<option
								key={author}
								value={author}>
								{author}
							</option>
						))}
					</Form.Select>
				</Col>
			</Row>
			<CommentsAdminTable
				comments={filteredComments}
				getMovieTitle={getMovieTitle}
				onToggleHidden={toggleHidden}
				onDelete={deleteComment}
			/>
		</Container>
	);
}
export default Admin;
