import { AboutUs } from "../components/AboutUs";
import { Badge, Card as BootstrapCard, Carousel, Col, Container, Row } from "react-bootstrap";
import { FaCrown, FaPlay, FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { useData } from "../context/database";
import { useEffect, useState } from "react";
import { FEATURED_MOVIES_KEY, isCustomMovie } from "../data/customMovies";
import type { Movie } from "../types/database";
import { Card as CatalogCard } from "../components/catalog/Card";
import { useStyle } from "../context/styles";
import { customMovieImageUrl, movieImageUrl } from "../data/movieImages";

function imageUrl(movie: Movie, size: "w500" | "original") {
  return isCustomMovie(movie)
    ? customMovieImageUrl(movie.backdrop_path || movie.poster_path)
    : movieImageUrl(movie.backdrop_path || movie.poster_path, size);
}

export function Index() {
  const { list, loading } = useData();
  const { theme } = useStyle();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>(() => {
    const stored = localStorage.getItem(FEATURED_MOVIES_KEY);
    return stored ? JSON.parse(stored) as Movie[] : [];
  });

  useEffect(() => {
    const refresh = () => {
      const stored = localStorage.getItem(FEATURED_MOVIES_KEY);
      setFeaturedMovies(stored ? JSON.parse(stored) as Movie[] : []);
    };
    window.addEventListener("streamtuc-featured-change", refresh);
    return () => window.removeEventListener("streamtuc-featured-change", refresh);
  }, []);

  const visibleCustomMovies = list.filter(isCustomMovie);
  const visibleCustomMovieIds = new Set(visibleCustomMovies.map((movie) => movie.id));
  const featuredCustomIds = new Set(
    featuredMovies.filter(isCustomMovie).map((movie) => movie.id),
  );
  const featuredCustomMovies = featuredMovies
    .filter((movie) => isCustomMovie(movie) && visibleCustomMovieIds.has(movie.id))
    .map((movie) => visibleCustomMovies.find((customMovie) => customMovie.id === movie.id) ?? movie);
  const remainingCustomMovies = visibleCustomMovies.filter((movie) => !featuredCustomIds.has(movie.id));
  const featuredTmdbMovies = featuredMovies.filter((movie) => !isCustomMovie(movie));
  const featuredIds = new Set([
    ...featuredCustomMovies.map((movie) => movie.id),
    ...remainingCustomMovies.map((movie) => movie.id),
    ...featuredTmdbMovies.map((movie) => movie.id),
  ]);
  const firstPageTmdbMovies = list.filter((movie) => !isCustomMovie(movie) && !featuredIds.has(movie.id));
  const displayedFeaturedMovies = [
    ...featuredCustomMovies,
    ...remainingCustomMovies,
    ...featuredTmdbMovies,
    ...firstPageTmdbMovies,
  ].slice(0, 17);
  const carouselMovies = displayedFeaturedMovies.slice(0, 5);
  const remainingFeaturedMovies = displayedFeaturedMovies.slice(5);
  const featuredMovie = displayedFeaturedMovies[0];

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <h1>Cargando STREAMTUC...</h1>
        <p>Estamos buscando las mejores películas para vos.</p>
      </Container>
    );
  }

  if (!featuredMovie) {
    return (
      <Container fluid className="py-5 text-center">
        <h1>No se pudieron cargar las películas</h1>
        <p>Intentá nuevamente más tarde.</p>
      </Container>
    );
  }

  return (
    <>
      <section
        className="text-white"
        style={{
          minHeight: "500px",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.8)), url(${imageUrl(featuredMovie, "original")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container
          fluid
          className="d-flex align-items-center py-5"
          style={{ minHeight: "500px" }}
        >
          <div style={{ maxWidth: "650px" }}>
            <p className="fw-bold text-uppercase mb-2">
              Película destacada
            </p>

            <h1 className="display-3 fw-bold">
              {featuredMovie.title}
            </h1>

            <div className="d-flex gap-3 mb-3">
              <span>
                <FaStar className="me-1" />
                {featuredMovie.vote_average.toFixed(1)}
              </span>

              <span>
                {String(featuredMovie.release_date).slice(0, 4)}
              </span>
            </div>

            <p className="lead">
              {featuredMovie.overview ||
                "Una nueva película para descubrir en STREAMTUC."}
            </p>

            <Link
              to={`/detail/${featuredMovie.id}`}
              className="btn btn-light"
            >
              <FaPlay className="me-2" />
              Ver detalles
            </Link>
          </div>
        </Container>
      </section>

      <Container fluid className={`${theme}-mode catalog-page`}>
        <section className="mb-5">
          <h2 className="mb-4">Películas destacadas</h2>
          <Carousel interval={5000}>
            {carouselMovies.map((movie) => (
              <Carousel.Item key={movie.id}>
                <img
                  className="d-block w-100"
                  src={imageUrl(movie, movie.backdrop_path ? "original" : "w500")}
                  alt={movie.title}
                  style={{ height: "360px", objectFit: "cover" }}
                />
                <Carousel.Caption>
                  <h3>{movie.title}</h3>
                  <Link to={`/detail/${movie.id}`} className="btn btn-light">Ver detalles</Link>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </section>
        <section className="mb-5">
          <h2 className="mb-4">Más películas destacadas</h2>

          <Row className="catalog-grid">
            {remainingFeaturedMovies.map((movie) => (
              <Col
                key={movie.id}
                className="p-2"
              >
                <CatalogCard movie={movie} theme={theme} />
              </Col>
            ))}
          </Row>
        </section>

        <section className="mb-5">
          <div className="catalog-section-heading">
            <h2>Elegí tu plan de STREAMTUC</h2>
          </div>

                    <Row className="justify-content-center">
            <Col md={5} className="mb-4">
              <BootstrapCard className="catalog-card subscription-card plan-free h-100 text-center">
                <BootstrapCard.Body className="d-flex flex-column">
                  <BootstrapCard.Title className="fs-3">
                    Plan Gratis
                  </BootstrapCard.Title>

                  <BootstrapCard.Text>
                    Disfrutá de nuestro catálogo de películas
                    y comenzá tu experiencia en STREAMTUC.
                  </BootstrapCard.Text>

                  <ul className="text-start">
                    <li>Acceso al catálogo</li>
                    <li>Películas destacadas</li>
                    <li>Lista de favoritos</li>
                  </ul>

                  <Link
                    to="/register"
                    className="btn btn-outline-primary mt-auto"
                  >
                    Registrarme
                  </Link>
                </BootstrapCard.Body>
              </BootstrapCard>
            </Col>

            <Col md={5} className="mb-4">
              <BootstrapCard className="catalog-card subscription-card plan-premium h-100 text-center">
                <Badge bg="warning" text="dark" className="plan-premium-badge">
                  Más elegido
                </Badge>

                <BootstrapCard.Body className="d-flex flex-column">
                  <BootstrapCard.Title className="fs-3 plan-premium-title">
                    <FaCrown />
                    Plan Premium
                  </BootstrapCard.Title>

                  <BootstrapCard.Text>
                    Disfrutá de una experiencia completa
                    con STREAMTUC.
                  </BootstrapCard.Text>

                  <ul className="text-start">
                    <li>Todo el catálogo</li>
                    <li>Contenido destacado</li>
                    <li>Lista de favoritos</li>
                    <li>Experiencia Premium</li>
                  </ul>

                  <Link
                    to="/register"
                    className="btn btn-primary mt-auto"
                  >
                    Registrarme
                  </Link>
                </BootstrapCard.Body>
              </BootstrapCard>
            </Col>
          </Row>
        </section>
      <AboutUs />
      </Container>
    </>
  );
}