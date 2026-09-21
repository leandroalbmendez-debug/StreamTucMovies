import squareLightPlaceholder from "../../assets/square light.png";
import squareDarkPlaceholder from "../../assets/square dark.png";
import { useEffect, useRef, useState } from "react";
import { Button, Card as BootstrapCard, Spinner } from "react-bootstrap";
import { FaEdit, FaHeart, FaRegHeart, FaStar, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { round } from "../../data/math";
import { customMovieImageUrl, movieImageUrl } from "../../data/movieImages";
import {
	notifyFavoriteChange,
	queueFavoriteUpdate,
} from "../../data/favoriteQueue";
import { initialUsers } from "../../data/initialUsers";
import { useLocalStorage } from "@uidotdev/usehooks";
import type { User } from "../../types/User";
import { CustomMovieModal } from "../CustomMovieModal";
import {
	CUSTOM_MOVIE_BIN_KEY,
	CUSTOM_MOVIES_KEY,
	FEATURED_MOVIES_KEY,
	notifyCustomMoviesChange,
	isCustomMovie,
	readFeaturedMovies,
	saveFeaturedMovies,
	type CustomMovie,
} from "../../data/customMovies";
import type { Movie } from "../../types/database";

type CatalogCardProps = {
	movie: Movie;
	theme: string;
	detailState?: Movie;
	detailFrom?: string;
};

export function Card({
	movie,
	theme,
	detailState,
	detailFrom,
}: CatalogCardProps) {
	const [loggedUser, setLoggedUser] = useLocalStorage<User | null>(
		"streamtuc-logged-user",
		null,
	);
	const [, setUsers] = useLocalStorage<User[]>("streamtuc-users", initialUsers);
	const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
	const [featuredMovies, setFeaturedMovies] =
		useState<Movie[]>(readFeaturedMovies);
	const [, setCustomMovies] = useLocalStorage<CustomMovie[]>(
		CUSTOM_MOVIES_KEY,
		[],
	);
	const [, setBin] = useLocalStorage<CustomMovie[]>(CUSTOM_MOVIE_BIN_KEY, []);
	const [showEdit, setShowEdit] = useState(false);
	const isAdmin = loggedUser?.role === "admin";
	const isCustom = isCustomMovie(movie);
	const isFeatured = featuredMovies.some((item) => item.id === movie.id);
	const pendingFavoriteState = useRef<boolean | null>(null);
	const isFavorite = loggedUser?.favorites?.includes(movie.id) ?? false;

	useEffect(() => {
		if (
			pendingFavoriteState.current !== null &&
			isFavorite === pendingFavoriteState.current
		) {
			pendingFavoriteState.current = null;
			setIsUpdatingFavorite(false);
		}
	}, [isFavorite]);

	useEffect(() => {
		const handleFavoriteChange = (event: Event) => {
			const updatedUser = (event as CustomEvent<User>).detail;
			if (updatedUser) setLoggedUser(updatedUser);
		};

		window.addEventListener("streamtuc-favorites-change", handleFavoriteChange);
		return () =>
			window.removeEventListener(
				"streamtuc-favorites-change",
				handleFavoriteChange,
			);
	}, [setLoggedUser]);

	useEffect(() => {
		const handleFeaturedChange = () => {
			setFeaturedMovies(readFeaturedMovies());
		};

		window.addEventListener("streamtuc-featured-change", handleFeaturedChange);
		return () =>
			window.removeEventListener(
				"streamtuc-featured-change",
				handleFeaturedChange,
			);
	}, [setFeaturedMovies]);

	function toggleFavorite() {
		if (!loggedUser || isUpdatingFavorite) {
			return;
		}

		pendingFavoriteState.current = !isFavorite;
		setIsUpdatingFavorite(true);
		void queueFavoriteUpdate(movie.id)
			.then((updatedUser) => {
				if (!updatedUser) {
					pendingFavoriteState.current = null;
					setIsUpdatingFavorite(false);
					return;
				}
				setUsers((currentUsers) =>
					currentUsers.map((user) =>
						user.id === updatedUser.id ? updatedUser : user,
					),
				);
				setLoggedUser(updatedUser);
				notifyFavoriteChange(updatedUser);
			})
			.catch(() => {
				pendingFavoriteState.current = null;
				setIsUpdatingFavorite(false);
			});
	}

	function toggleFeatured() {
		const stored = localStorage.getItem(FEATURED_MOVIES_KEY);
		const current = stored ? (JSON.parse(stored) as Movie[]) : [];
		const nextFeaturedMovies = isFeatured
			? current.filter((item) => item.id !== movie.id)
			: [...current, movie];
		setFeaturedMovies(nextFeaturedMovies);
		saveFeaturedMovies(nextFeaturedMovies);
	}

	function moveCustomToBin() {
		if (!isCustom) return;
		setCustomMovies((current) =>
			current.filter((item) => item.id !== movie.id),
		);
		setBin((current) => [
			movie,
			...current.filter((item) => item.id !== movie.id),
		]);
		const storedFeatured = localStorage.getItem(FEATURED_MOVIES_KEY);
		const currentFeatured = storedFeatured
			? (JSON.parse(storedFeatured) as Movie[])
			: [];
		saveFeaturedMovies(currentFeatured.filter((item) => item.id !== movie.id));
		notifyCustomMoviesChange();
	}

	function saveCustomMovie(updatedMovie: CustomMovie) {
		setCustomMovies((current) =>
			current.map((item) =>
				item.id === updatedMovie.id ? updatedMovie : item,
			),
		);
		notifyCustomMoviesChange();
	}

	const imagePath =
		(isCustom
			? customMovieImageUrl(movie.poster_path)
			: movieImageUrl(movie.poster_path)) ||
		(theme === "dark" ? squareDarkPlaceholder : squareLightPlaceholder);

	return (
		<BootstrapCard className="catalog-card h-100 position-relative">
			<div className="catalog-card-image-wrapper">
				<Link
					to={`/detail/${movie.id}`}
					state={{ movie: detailState ?? movie, from: detailFrom }}
					className="catalog-card-link text-decoration-none">
					<BootstrapCard.Img
						src={imagePath}
						alt={movie.title}
						className="catalog-card-image object-fit-cover"
					/>
					<div className="catalog-card-overlay text-light">
						<span className="catalog-card-genre">Película destacada</span>
						<h3>{movie.title}</h3>
						<p>{movie.overview || "Descubrí más sobre esta película."}</p>
						<div className="catalog-card-rating">
							<FaStar />{" "}
							{movie.vote_average >= 1 ? round(movie.vote_average, 2) : "-"}
						</div>
					</div>
				</Link>
				<div className="catalog-card-image-actions">
					{!isAdmin && (
						<Button
							variant={isFavorite ? "danger" : "dark"}
							className="catalog-favorite-button"
							type="button"
							aria-label={
								isFavorite
									? `Quitar ${movie.title} de favoritos`
									: `Agregar ${movie.title} a favoritos`
							}
							aria-pressed={isFavorite}
							aria-busy={isUpdatingFavorite}
							disabled={!loggedUser || isUpdatingFavorite}
							onClick={toggleFavorite}>
							{isUpdatingFavorite ? (
								<Spinner
									animation="border"
									size="sm"
									aria-hidden="true"
								/>
							) : isFavorite ? (
								<FaHeart />
							) : (
								<FaRegHeart />
							)}
						</Button>
					)}
					{isCustom && (
						<span className="catalog-card-origin-badge">Original</span>
					)}
				</div>
			</div>
			<div className="catalog-card-details">
				<h3 title={movie.title}>{movie.title}</h3>
				<div>
					<span>{String(movie.release_date).slice(0, 4)}</span>
					<span>•</span>
					<span>Película</span>
				</div>
			</div>
			{isAdmin && (
				<div className="catalog-card-actions">
					<Button
						variant={isFavorite ? "danger" : "dark"}
						type="button"
						aria-label={
							isFavorite
								? `Quitar ${movie.title} de favoritos`
								: `Agregar ${movie.title} a favoritos`
						}
						aria-pressed={isFavorite}
						aria-busy={isUpdatingFavorite}
						disabled={isUpdatingFavorite}
						onClick={toggleFavorite}>
						{isUpdatingFavorite ? (
							<Spinner
								animation="border"
								size="sm"
								aria-hidden="true"
							/>
						) : isFavorite ? (
							<FaHeart />
						) : (
							<FaRegHeart />
						)}
					</Button>
					<Button
						variant={isFeatured ? "warning" : "dark"}
						type="button"
						aria-label={
							isFeatured
								? `Quitar ${movie.title} de destacadas`
								: `Destacar ${movie.title}`
						}
						onClick={toggleFeatured}>
						<FaStar />
					</Button>
					{isCustom && (
						<>
							<Button
								variant="secondary"
								type="button"
								aria-label={`Editar ${movie.title}`}
								onClick={() => setShowEdit(true)}>
								<FaEdit />
							</Button>
							<Button
								variant="danger"
								type="button"
								aria-label={`Enviar ${movie.title} a la papelera`}
								onClick={moveCustomToBin}>
								<FaTrash />
							</Button>
						</>
					)}
				</div>
			)}
			{isCustom && (
				<CustomMovieModal
					key={`${movie.id}-${showEdit}`}
					show={showEdit}
					movie={movie}
					onHide={() => setShowEdit(false)}
					onSave={saveCustomMovie}
				/>
			)}
		</BootstrapCard>
	);
}
