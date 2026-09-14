import { useData } from "../context/database";
import { Card, Container, Row } from "react-bootstrap";
import { Paginator } from "./paginator";

export function Catalog() {
	const { loading, list, nudge, jumpTo, currentIndex } = useData();
	return (
		<Container fluid>
			<p>DESTACADOS</p>
			<Row className="row-cols-2">
				<Paginator step={10} tracker={currentIndex} min={1} max={500} bump={nudge} jump={jumpTo}></Paginator>
			</Row>
			<Row className="row-cols-5">
				{ loading ? (
					<>Loading</>
				) : (
					list.map((movie, index) => (
						<Card key={index}>
							<Card.Img
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
							/>
							<Card.ImgOverlay >

							</Card.ImgOverlay>
						</Card>
					))
				)}
			</Row>
		</Container>
	);
}
