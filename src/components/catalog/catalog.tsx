import { useData } from "../../context/database";
import { Container, Row } from "react-bootstrap";
import { Paginator } from "../paginator";
import { useStyle } from "../../context/styles";
import { Card } from "./Card";
import { FaChevronDown, FaPlay, FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { useState } from "react";
import { isCustomMovie } from "../../data/customMovies";
import { movieImageUrl } from "../../data/movieImages";

type SortOption = "popularity" | "vote_average";

export function Catalog() {
	const {
		loading,
		list,
		nudge,
		jumpTo,
		currentIndex,
		selectedGenre,
		selectGenre,
		maxPage,
	} = useData();
	const { theme, isMobile, isTablet } = useStyle();
	const [sortOption, setSortOption] = useState<SortOption>("popularity");
	const sortedTmdbMovies = list.filter((movie) => !isCustomMovie(movie)).sort((firstMovie, secondMovie) =>
		sortOption === "popularity"
			? secondMovie.popularity - firstMovie.popularity
			: secondMovie.vote_average - firstMovie.vote_average,
	);
	const sortedMovies = [...list.filter(isCustomMovie), ...sortedTmdbMovies];
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
	function sizeQuery() {
		if (isMobile) {
			return 5;
		}
		if (isTablet) {
			return 20;
		}
		return 30;
	}
	return (
		<Container
			fluid
			className={`${theme}-mode catalog-page`}>
			{!loading && sortedMovies[0] && (
				<section
					className="catalog-hero"
					style={{
						backgroundImage: `url(${movieImageUrl(sortedMovies[0].backdrop_path, "original")})`,
					}}>
					<div className="catalog-hero-content">
						<span className="catalog-eyebrow">Cine sin límites</span>
						<h1>{sortedMovies[0].title}</h1>
						<div className="catalog-hero-meta">
							<span><FaStar /> {sortedMovies[0].vote_average.toFixed(1)} IMDb</span>
							<span>{String(sortedMovies[0].release_date).slice(0, 4)}</span>
							<span>4K HDR10</span>
						</div>
						<p>{sortedMovies[0].overview || "Una nueva historia para descubrir en StreamTUC."}</p>
						<Link className="catalog-hero-button" to={`/detail/${sortedMovies[0].id}`}>
							<FaPlay /> Ver detalles
						</Link>
					</div>
				</section>
			)}

			<section className="catalog-explorer">
				<div className="catalog-section-heading">
					<div>
						<span className="catalog-eyebrow">Tu próxima película favorita</span>
						<h2>Explorar películas</h2>
					</div>
					<div className="catalog-controls">
						<label>
							<span className="visually-hidden">Ordenar películas</span>
							<select
								aria-label="Ordenar películas"
								value={sortOption}
								onChange={(event) => setSortOption(event.target.value as SortOption)}>
								<option value="popularity">Más populares</option>
								<option value="vote_average">Mejor valoradas</option>
							</select>
							<FaChevronDown />
						</label>
					</div>
				</div>
				<div className="catalog-genres" aria-label="Géneros">
					{genres.map((genre) => (
						<button
							className={selectedGenre === genre.id ? "active" : ""}
							key={genre.label}
							type="button"
							onClick={() => void selectGenre(genre.id)}
							disabled={loading}>
							{genre.label}
						</button>
					))}
				</div>
				<Row className="catalog-grid">
					{loading ? (
						<p className="catalog-loading">Cargando películas...</p>
					) : (
						sortedMovies.map((movie) => (
							<div key={movie.id}>
								<Card movie={movie} theme={theme} />
							</div>
						))
					)}
				</Row>
				<div className="catalog-pagination">
					<Paginator
						step={sizeQuery()}
						tracker={currentIndex}
						min={1}
						max={maxPage}
						bump={nudge}
						jump={jumpTo}
					/>
				</div>
			</section>
		</Container>
	);
}
