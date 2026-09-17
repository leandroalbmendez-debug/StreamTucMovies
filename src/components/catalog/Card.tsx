import { Button, Card as BootstrapCard } from "react-bootstrap";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { round } from "../../data/math";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initialUsers } from "../../data/initialUsers";
import type { Movie } from "../../types/database";
import type { User } from "../../types/User";

type CatalogCardProps = {
	movie: Movie;
	theme: string;
};

export function Card({ movie, theme }: CatalogCardProps) {
	const [loggedUser, setLoggedUser] = useLocalStorage<User | null>(
		"streamtuc-logged-user",
		null,
	);
	const [, setUsers] = useLocalStorage<User[]>("streamtuc-users", initialUsers);
	const isFavorite = loggedUser?.favorites.includes(movie.id) ?? false;

	function toggleFavorite() {
		if (!loggedUser) {
			return;
		}

		const favorites = isFavorite
			? loggedUser.favorites.filter((favoriteId) => favoriteId !== movie.id)
			: [...loggedUser.favorites, movie.id];
		const updatedUser = { ...loggedUser, favorites };

		setUsers((currentUsers) =>
			currentUsers.map((user) =>
				user.id === updatedUser.id ? updatedUser : user,
			),
		);
		setLoggedUser(updatedUser);
		window.dispatchEvent(new Event("streamtuc-favorites-change"));
	}

	return (
		<BootstrapCard className="catalog-card h-100 position-relative">
			<Link
				to={`/detail/${movie.id}`}
				className="catalog-card-link text-decoration-none">
				<div className="catalog-card-image-wrapper">
					<BootstrapCard.Img
						src={
							movie.poster_path != null
								? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
								: `./src/assets/square ${theme}.png`
						}
						alt={movie.title}
							className="catalog-card-image object-fit-cover"
					/>
					<div className="catalog-card-overlay text-light">
						<span className="catalog-card-genre">Película destacada</span>
						<h3>{movie.title}</h3>
						<p>{movie.overview || "Descubrí más sobre esta película."}</p>
						<div className="catalog-card-rating"><FaStar /> {movie.vote_average >= 1 ? round(movie.vote_average, 2) : "-"}</div>
					</div>
				</div>
			</Link>
			<div className="catalog-card-details">
				<h3 title={movie.title}>{movie.title}</h3>
				<div><span>{String(movie.release_date).slice(0, 4)}</span><span>•</span><span>Película</span></div>
			</div>
			<Button
				variant={isFavorite ? "danger" : "dark"}
				className="catalog-favorite-button"
				type="button"
				aria-label={isFavorite ? `Quitar ${movie.title} de favoritos` : `Agregar ${movie.title} a favoritos`}
				aria-pressed={isFavorite}
				disabled={!loggedUser}
				onClick={toggleFavorite}>
				{isFavorite ? <FaHeart /> : <FaRegHeart />}
			</Button>
		</BootstrapCard>
	);
}