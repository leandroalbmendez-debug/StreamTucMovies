import { Navigate, useLocation, useParams, Link } from "react-router";
import { Alert, Badge, Button, Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import { useData } from "../../context/database";
import { CommentSection } from "../comments/CommentSection";
import type { Movie } from "../../types/database";
import { useStyle } from "../../context/styles";
import { isCustomMovie, MOVIE_GENRES } from "../../data/customMovies";
import { customMovieImageUrl, movieImageUrl } from "../../data/movieImages";

function formatReleaseDate(releaseDate: Movie["release_date"]): string {
	return releaseDate instanceof Date
		? releaseDate.toLocaleDateString()
		: releaseDate || "Sin fecha de estreno";
}

export function Detail() {
	const {theme} = useStyle();
	const { movieId } = useParams();
	const location = useLocation();
	const { list, loading } = useData();
	const detailState = location.state as { movie?: Movie; from?: string } | null;
	const stateMovie = detailState?.movie;
	const movie = list.find((item) => item.id === Number(movieId)) ?? stateMovie;

	if (loading && !stateMovie) {
		return <Container fluid className="py-5">Cargando película...</Container>;
	}

	if (!movie) {
		return (
			<Container fluid className="py-5">
				<Alert variant="warning">
					No se encontró la película solicitada. Volvé al catálogo para elegir otra.
				</Alert>
				{movieId === undefined && <Navigate to="/catalog" replace />}
			</Container>
		);
	}

	return (
		<main className="detail-page">
			{movie.backdrop_path && (
				<div
					className="detail-backdrop"
					style={{ backgroundImage: `url(${isCustomMovie(movie) ? customMovieImageUrl(movie.backdrop_path) : movieImageUrl(movie.backdrop_path, "original")})` }}
				/>
			)}
			<Container fluid className="detail-content py-4">
				<Link to={detailState?.from ?? "/catalog"} className="detail-back-link">
					<Button variant="outline-light" size="sm">Volver al catálogo</Button>
				</Link>
			<Row className="g-4">
				<Col md={4} lg={3}>
					<Image
						fluid
						rounded
						src={(isCustomMovie(movie) ? customMovieImageUrl(movie.poster_path) : movieImageUrl(movie.poster_path, "original")) || `../src/assets/${theme}.png`}
						alt={movie.title}
					/>
				</Col>
				<Col md={8} lg={9}>
					<h1 className="detail-title">{movie.title}</h1>
					<p className="lead">{movie.original_title}</p>
					<p>{movie.overview || "No hay sinopsis disponible."}</p>
					<ListGroup>
						<ListGroup.Item><strong>ID:</strong> {movie.id}</ListGroup.Item>
						<ListGroup.Item><strong>Fecha de estreno:</strong> {formatReleaseDate(movie.release_date)}</ListGroup.Item>
						<ListGroup.Item><strong>Idioma original:</strong> {movie.original_language}</ListGroup.Item>
						<ListGroup.Item><strong>Popularidad:</strong> {movie.popularity}</ListGroup.Item>
						<ListGroup.Item><strong>Votos:</strong> {movie.vote_count}</ListGroup.Item>
						<ListGroup.Item><strong>Promedio:</strong> {movie.vote_average}/10</ListGroup.Item>
						<ListGroup.Item><strong>Contenido adulto:</strong> {movie.adult ? "Sí" : "No"}</ListGroup.Item>
						<ListGroup.Item><strong>Video:</strong> {movie.video ? "Sí" : "No"}</ListGroup.Item>
						<ListGroup.Item>
							<strong>Géneros:</strong>{" "}
							{movie.genre_ids.length ? movie.genre_ids.map((genreId) => (
								<Badge key={genreId} bg="secondary" className="me-1">
									{MOVIE_GENRES.find((genre) => genre.id === genreId)?.label ?? `Género ${genreId}`}
								</Badge>
							)) : "Sin géneros"}
						</ListGroup.Item>
					</ListGroup>
				</Col>
			</Row>
			<CommentSection movieId={String(movie.id)} />
			</Container>
		</main>
	);
}
