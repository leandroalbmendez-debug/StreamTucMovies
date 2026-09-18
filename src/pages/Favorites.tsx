import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigate } from "react-router";
import { Card } from "../components/catalog/Card";
import { notifyFavoriteChange, queueFavoriteUpdate } from "../data/favoriteQueue";
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
	const [search, setSearch] = useState("");
	const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
	const genres = [
		{ label: "Todos", id: null },
		{ label: "Acción", id: 28 },
		{ label: "Ciencia ficción", id: 878 },
		{ label: "Drama", id: 18 },
		{ label: "Thriller", id: 53 },
		{ label: "Terror", id: 27 },
		{ label: "Comedia", id: 35 },
		{ label: "Animación", id: 16 },
	];
	const filteredMovies = movies.filter((movie) => {
		const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase().trim());
		const matchesGenre = selectedGenre === null || movie.genre_ids.includes(selectedGenre);
		return matchesSearch && matchesGenre;
	});
	const [isRemovingAll, setIsRemovingAll] = useState(false);

	const removeFilteredFavorites = async () => {
		if (!loggedUser || filteredMovies.length === 0 || isRemovingAll) return;

		setIsRemovingAll(true);
		try {
			for (const movie of filteredMovies) {
				const updatedUser = await queueFavoriteUpdate(movie.id, false);
				if (updatedUser) notifyFavoriteChange(updatedUser);
			}
		} finally {
			setIsRemovingAll(false);
		}
	};

	useEffect(() => {
		const updateLoggedUser = (event: Event) => {
			const updatedUser = (event as CustomEvent<User>).detail;
			setLoggedUser(updatedUser);
			setMovies((currentMovies) =>
				currentMovies.filter((movie) => updatedUser.favorites.includes(movie.id)),
			);
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
			{movies.length > 0 && (
				<Container fluid className="favorites-controls px-0" aria-label="Filtrar favoritos">
					<Form.Control
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Buscar en mis favoritos"
						aria-label="Buscar en mis favoritos"
					/>
					<Row className="catalog-genres favorites-genres row-cols-lg-auto row-cols-md-6 row-cols-3" aria-label="Categorías">
						{genres.map((genre) => (
							<Button
								className={selectedGenre === genre.id ? "active" : ""}
								key={genre.label}
								type="button"
								onClick={() => setSelectedGenre(genre.id)}>
								{genre.label}
							</Button>
						))}
					</Row>
					<Button
						className="mt-3"
						variant="outline-danger"
						type="button"
						onClick={() => void removeFilteredFavorites()}
						disabled={isRemovingAll || filteredMovies.length === 0}>
						{isRemovingAll ? "Quitando favoritos..." : "Quitar favoritos visibles"}
					</Button>
				</Container>
			)}
			{movies.length > 0 && filteredMovies.length === 0 && (
				<p className="favorites-empty-filter">No hay favoritos que coincidan con esos filtros.</p>
			)}
			<Row className="row-cols-lg-6 row-cols-sm-3 row-cols-auto g-0">
				{filteredMovies.map((movie) => (
					<Col className="p-2" key={movie.id}>
						<Card movie={movie} theme={theme} />
					</Col>
				))}
			</Row>
		</Container>
	);
}