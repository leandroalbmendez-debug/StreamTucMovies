import { useData } from "../context/database";
import { Button, Card, Container, Row } from "react-bootstrap";

export function Catalog() {
	const { loading, list, refetch } = useData();

	return (
		<Container fluid>
			<Row>
				<p>DESTACADOS</p>
                <Button
					disabled={loading}
					onClick={() => refetch(-1)}>
					Prev Page
				</Button>
				<Button
					disabled={loading}
					onClick={() => refetch(1)}>
					Next Page
				</Button>
			</Row>
			<Row className="row-cols-5">
				{loading ? (
					<>Loading</>
				) : (
					list.map((movie) => (
						<Card>
							<h2>{movie.title}</h2>
							<img
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
							/>
						</Card>
					))
				)}
			</Row>
		</Container>
	);
}
