import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { FaPlay, FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { useData } from "../context/database";
import { useEffect, useState } from "react";
import { FEATURED_MOVIES_KEY } from "../data/customMovies";
import type { Movie } from "../types/database";

export function Index() {
  const { list, loading } = useData();
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

  const featuredMovie = list[0];
  const catalogMovies = list.slice(0, 16);

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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
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

      <Container fluid className="py-5">
        <section className="mb-5">
          <h2 className="mb-4">Películas destacadas</h2>
          <Carousel interval={5000}>
            {(featuredMovies.length ? featuredMovies : list.slice(0, 5)).map((movie) => (
              <Carousel.Item key={movie.id}>
                <img
                  className="d-block w-100"
                  src={movie.backdrop_path ? (movie.backdrop_path.startsWith("http") ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`) : (movie.poster_path.startsWith("http") ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)}
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
          <h2 className="mb-4">Películas destacadas</h2>

          <Row>
            {catalogMovies.map((movie) => (
              <Col
                key={movie.id}
                md={6}
                lg={3}
                className="mb-4"
              >
                <Card className="h-100">
                  {movie.backdrop_path && (
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.title}
                      style={{
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{movie.title}</Card.Title>

                    <Card.Text>
                      <FaStar className="me-1" />
                      {movie.vote_average.toFixed(1)}
                    </Card.Text>

                    <Link
                      to={`/detail/${movie.id}`}
                      className="btn btn-primary mt-auto"
                    >
                      Ver detalles
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section className="mb-5">
          <h2 className="text-center mb-4">
            Elegí tu plan de STREAMTUC
          </h2>

          <Row className="justify-content-center">
            <Col md={5} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-3">
                    Plan Gratis
                  </Card.Title>

                  <Card.Text>
                    Disfrutá de nuestro catálogo de películas
                    y comenzá tu experiencia en STREAMTUC.
                  </Card.Text>

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
                </Card.Body>
              </Card>
            </Col>

            <Col md={5} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-3">
                    Plan Premium
                  </Card.Title>

                  <Card.Text>
                    Disfrutá de una experiencia completa
                    con STREAMTUC.
                  </Card.Text>

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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
}