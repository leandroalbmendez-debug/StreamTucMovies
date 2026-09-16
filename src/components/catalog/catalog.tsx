import { useData } from "../../context/database";
import { Card, Container, Row } from "react-bootstrap";
import { Paginator } from "../paginator";
import { round } from "../../data/math";
import { Link } from "react-router";

export function Catalog() {
	const { loading, list, nudge, jumpTo, currentIndex } = useData();
	return (
		<Container fluid>
			<p>DESTACADOS</p>
			<Row className="row-cols-2">
				<Paginator
					step={10}
					tracker={currentIndex}
					min={1}
					max={500}
					bump={nudge}
					jump={jumpTo}></Paginator>
			</Row>
			<Row className="row-cols-5">
				{loading ? (
					<>Loading</>
				) : (
					list.map((movie, index) => (
						<Container>
							<Card
								key={movie.id ?? index}
								as={Link}
								to={`/detail/${movie.id}`}
								className="text-decoration-none">
								<Card.Img
									src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
									alt={movie.title}
									variant="top"
									className="object-fit-contain"
								/>
								<Card.ImgOverlay className="d-flex flex-column justify-content-evenly text-light">
									<h4 className="text-end">
										{movie.vote_average >= 1
											? round(movie.vote_average, 2)
											: "No rating"}{" "}
										/10 ⭐
									</h4>
									<h1 className="text-break">{movie.original_title}</h1>
								</Card.ImgOverlay>
							</Card>
						</Container>
					))
				)}
			</Row>
		</Container>
	);
}
