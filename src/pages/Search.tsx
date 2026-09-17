import { useState } from "react";
import { Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaSearch, FaStar } from "react-icons/fa";
import { Link } from "react-router";

interface Movie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function Search() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchMovies = async () => {
    if (search.trim() === "") {
      setMovies([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(search)}`,
      );

      if (!response.ok) {
        throw new Error("Error al buscar películas");
      }

      const data: SearchResponse = await response.json();

      setMovies(data.results);
    } catch (error) {
      console.error(error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchMovies();
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Buscar películas</h1>

      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group>
          <Form.Label>Buscar por nombre</Form.Label>

          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Ejemplo: Batman"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary"
            >
              <FaSearch className="me-2" />
              Buscar
            </button>
          </div>
        </Form.Group>
      </Form>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Buscando películas...</p>
        </div>
      )}

      {!loading && searched && (
        <>
          <h2 className="mb-4">
            Resultados para: <strong>{search}</strong>
          </h2>

          {movies.length === 0 ? (
            <p>No se encontraron películas con ese nombre.</p>
          ) : (
            <Row>
              {movies.map((movie) => (
                <Col
                  key={movie.id}
                  md={6}
                  lg={3}
                  className="mb-4"
                >
                  <Card className="h-100">
                    {movie.poster_path ? (
                      <Card.Img
                        variant="top"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        style={{
                          height: "350px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-secondary text-white d-flex align-items-center justify-content-center"
                        style={{ height: "350px" }}
                      >
                        Sin imagen
                      </div>
                    )}

                    <Card.Body className="d-flex flex-column">
                      <Card.Title>
                        {movie.title}
                      </Card.Title>

                      <Card.Text>
                        <FaStar className="me-1" />
                        {movie.vote_average.toFixed(1)}
                      </Card.Text>

                      <Card.Text>
                        {movie.release_date
                          ? movie.release_date.slice(0, 4)
                          : "Sin fecha"}
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
          )}
        </>
      )}
    </Container>
  );
}