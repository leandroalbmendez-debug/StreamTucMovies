import { Navigate, useParams } from "react-router";
import { Alert, Badge, Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import { useData } from "../../context/database";
import { CommentSection } from "../comments/CommentSection";
import type { Movie } from "../../types/database";

function formatReleaseDate(releaseDate: Movie["release_date"]): string {
	return releaseDate instanceof Date
		? releaseDate.toLocaleDateString()
		: releaseDate || "Sin fecha de estreno";
}

export function Detail() {
	const { movieId } = useParams();
	const { list, loading } = useData();
	const movie = list.find((item) => item.id === Number(movieId));

	if (loading) {
		return <Container className="py-5">Cargando película...</Container>;
	}

	if (!movie) {
		return (
			<Container className="py-5">
				<Alert variant="warning">
					No se encontró la película solicitada. Volvé al catálogo para elegir otra.
				</Alert>
				{movieId === undefined && <Navigate to="/catalog" replace />}
			</Container>
		);
	}

	return (
		<Container className="py-4">
			<Row className="g-4">
				<Col md={4} lg={3}>
					<Image
						fluid
						rounded
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						alt={movie.title}
					/>
				</Col>
				<Col md={8} lg={9}>
					<h1>{movie.title}</h1>
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
							{movie.genre_ids.length ? movie.genre_ids.map((genreId) => <Badge key={genreId} bg="secondary" className="me-1">{genreId}</Badge>) : "Sin géneros"}
						</ListGroup.Item>
					</ListGroup>
				</Col>
			</Row>
			{movie.backdrop_path && (
				<Row className="mt-4">
					<Col>
						<Image
							fluid
							src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
							alt={`Fondo de ${movie.title}`}
						/>
					</Col>
				</Row>
			)}
			<CommentSection movieId={String(movie.id)} />
		</Container>
	);
}
