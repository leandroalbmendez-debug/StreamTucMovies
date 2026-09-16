import { useData } from "../../context/database";
import { Card, Container, Row } from "react-bootstrap";
import { Paginator } from "../paginator";
import { round } from "../../data/math";
import { Link } from "react-router";
import { useStyle } from "../../context/styles";

export function Catalog() {
	const { loading, list, nudge, jumpTo, currentIndex } = useData();
	const { theme, isMobile, isTablet } = useStyle();
	function sizeQuery(){
		if (isMobile) {
			return 5;
		}
		if (isTablet) {
			return 15;
		}
		return 20;
	}
	return (
		<Container fluid className={`${theme}-mode`}>
			<Row className="row-cols-2">
				<Paginator
					step={sizeQuery()}
					tracker={currentIndex}
					min={1}
					max={500}
					bump={nudge}
					jump={jumpTo}></Paginator>
			</Row>
			<Row className="row-cols-lg-5 row-cols-row-cols-sm-3 row-cols-2">
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
									src={movie.poster_path != null ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `./src/assets/square ${theme}.png`}
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
