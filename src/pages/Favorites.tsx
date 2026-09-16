import { useEffect, useState } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router";
import { Card } from "../components/catalog/Card";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Movie } from "../types/database";
import type { User } from "../types/User";
import { useStyle } from "../context/styles";

export function Favorites() {
	const { theme } = useStyle();
	const [loggedUser, setLoggedUser] = useLocalStorage<User | null>(
		"streamtuc-logged-user",
		null,
	);
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const updateLoggedUser = () => {
			const storedUser = localStorage.getItem("streamtuc-logged-user");
			setLoggedUser(storedUser ? JSON.parse(storedUser) : null);
		};

		window.addEventListener("streamtuc-favorites-change", updateLoggedUser);
		return () =>
			window.removeEventListener("streamtuc-favorites-change", updateLoggedUser);
	}, [setLoggedUser]);

	useEffect(() => {
		if (!loggedUser || loggedUser.favorites.length === 0) {
			return;
		}

		const favoriteIds = loggedUser.favorites;
		const controller = new AbortController();
		const apiKey = import.meta.env.VITE_API_KEY;

		async function fetchFavorites() {
			setLoading(true);
			setError(false);

			try {
				const favoriteMovies = await Promise.all(
					favoriteIds.map(async (movieId) => {
						const response = await fetch(
							`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`,
							{ signal: controller.signal },
						);
						if (!response.ok) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						return response.json() as Promise<Movie>;
					}),
				);
				setMovies(favoriteMovies);
			} catch (fetchError) {
				if (!controller.signal.aborted) {
					console.error(fetchError);
					setError(true);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		void fetchFavorites();
		return () => controller.abort();
	}, [loggedUser]);

	if (!loggedUser) {
		return <Navigate to="/login" replace />;
	}

	return (
		<Container fluid className={`${theme}-mode py-4`}>
			<h1 className="mb-4">Mis favoritos</h1>
			{loading && <p>Cargando favoritos...</p>}
			{error && (
				<Alert variant="danger">
					No se pudieron cargar tus películas favoritas.
				</Alert>
			)}
			{!loading && !error && movies.length === 0 && (
				<Alert variant="info">
					Todavía no agregaste películas a favoritos.
				</Alert>
			)}
			<Row className="row-cols-lg-5 row-cols-sm-3 row-cols-2 g-0">
				{movies.map((movie) => (
					<Container className="p-2" key={movie.id}>
						<Card movie={movie} theme={theme} />
					</Container>
				))}
			</Row>
		</Container>
	);
}