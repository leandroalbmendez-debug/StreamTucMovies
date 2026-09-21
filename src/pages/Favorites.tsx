import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigate } from "react-router";
import { Card } from "../components/catalog/Card";
import { notifyFavoriteChange, queueFavoriteUpdate } from "../data/favoriteQueue";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Movie } from "../types/database";
import type { User } from "../types/User";
import { useStyle } from "../context/styles";
import { MOVIE_GENRES, readCustomMovies, readFeaturedMovies, saveFeaturedMovies, type CustomMovie } from "../data/customMovies";
import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

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
	const [featuredMovies, setFeaturedMovies] = useState<Movie[]>(readFeaturedMovies);
	const genres = [{ label: "Todos", id: null }, ...MOVIE_GENRES];
	const filteredMovies = movies.filter((movie) => {
		const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase().trim());
		const matchesGenre = selectedGenre === null || (movie.genre_ids ?? []).includes(selectedGenre);
		return matchesSearch && matchesGenre;
	});
	const [isRemovingAll, setIsRemovingAll] = useState(false);
	const [isFeaturingAll, setIsFeaturingAll] = useState(false);
	const allFilteredMoviesAreFavorite = Boolean(
		loggedUser &&
		filteredMovies.length > 0 &&
		filteredMovies.every((movie) => loggedUser.favorites?.includes(movie.id)),
	);
	const allFilteredMoviesAreFeatured = Boolean(
		filteredMovies.length > 0 &&
		filteredMovies.every((movie) => featuredMovies.some((featuredMovie) => featuredMovie.id === movie.id)),
	);

	const toggleFilteredFavorites = async () => {
		if (!loggedUser || filteredMovies.length === 0 || isRemovingAll) return;

		setIsRemovingAll(true);
		const favoriteState = !allFilteredMoviesAreFavorite;
		let latestUser: User | null = loggedUser;
		try {
			for (const movie of filteredMovies) {
				const updatedUser = await queueFavoriteUpdate(movie.id, favoriteState);
				if (updatedUser) latestUser = updatedUser;
			}
			if (latestUser) {
				setLoggedUser(latestUser);
				notifyFavoriteChange(latestUser);
			}
		} finally {
			setIsRemovingAll(false);
		}
	};

	const toggleFilteredFeatures = () => {
		if (filteredMovies.length === 0 || isFeaturingAll) return;

		setIsFeaturingAll(true);
		const nextFeaturedMovies = allFilteredMoviesAreFeatured
			? featuredMovies.filter((featuredMovie) => !filteredMovies.some((movie) => movie.id === featuredMovie.id))
			: [
					...featuredMovies.filter((featuredMovie) => !filteredMovies.some((movie) => movie.id === featuredMovie.id)),
					...filteredMovies,
			];
		setFeaturedMovies(nextFeaturedMovies);
		saveFeaturedMovies(nextFeaturedMovies);
		setIsFeaturingAll(false);
	};

	useEffect(() => {
		const refreshFeaturedMovies = () => {
			setFeaturedMovies(readFeaturedMovies());
		};
		window.addEventListener("streamtuc-featured-change", refreshFeaturedMovies);
		return () => window.removeEventListener("streamtuc-featured-change", refreshFeaturedMovies);
	}, [setFeaturedMovies]);

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
			setMovies([]);
			setError(false);
			setLoading(false);
			return;
		}

		const favoriteIds = loggedUser.favorites;
		const controller = new AbortController();
		const apiKey = import.meta.env.VITE_API_KEY;

		async function fetchFavorites() {
			setLoading(true);
			setError(false);

			try {
				const customMovies = readCustomMovies();
				const customFavorites = favoriteIds
					.map((movieId) => customMovies.find((movie) => movie.id === movieId))
					.filter((movie): movie is CustomMovie => Boolean(movie));
				const tmdbFavoriteIds = favoriteIds.filter(
					(movieId) => !customFavorites.some((movie) => movie.id === movieId),
				);
				const tmdbResults = await Promise.allSettled(
					tmdbFavoriteIds.map(async (movieId) => {
						const response = await fetch(
							`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`,
							{ signal: controller.signal },
						);
						if (!response.ok) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						const movie = await response.json() as Movie & {
							genres?: Array<{ id: number }>;
						};
						return {
							...movie,
							genre_ids: movie.genre_ids ?? movie.genres?.map((genre) => genre.id) ?? [],
						};
					}),
				);
				const tmdbMovies = tmdbResults
					.filter((result): result is PromiseFulfilledResult<Movie> => result.status === "fulfilled")
					.map((result) => result.value);
				setMovies([...customFavorites, ...tmdbMovies]);
				setError(tmdbMovies.length === 0 && customFavorites.length === 0 && favoriteIds.length > 0);
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
			<Link to="/catalog" className="btn btn-outline-secondary btn-sm mb-3">
				<FaArrowLeft className="me-2" />
				Volver al catálogo
			</Link>

			{loading && <p>Cargando favoritos...</p>}
			{!loading && error && (
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
						variant={allFilteredMoviesAreFavorite ? "outline-danger" : "outline-primary"}
						type="button"
						onClick={() => void toggleFilteredFavorites()}
						disabled={isRemovingAll || filteredMovies.length === 0}>
						{isRemovingAll ? "Actualizando favoritos..." : allFilteredMoviesAreFavorite ? "Quitar favoritos visibles" : "Agregar favoritos visibles"}
					</Button>
					{loggedUser.role === "admin" && (
						<Button
							className="mt-3 ms-2"
							variant="outline-warning"
							type="button"
							onClick={toggleFilteredFeatures}
							disabled={isFeaturingAll || filteredMovies.length === 0}>
							{isFeaturingAll ? "Actualizando destacadas..." : allFilteredMoviesAreFeatured ? "Quitar destacadas" : "Destacar favoritos visibles"}
						</Button>
					)}
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