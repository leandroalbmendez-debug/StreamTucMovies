import { useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useStyle } from "../context/styles";
import { Card } from "../components/catalog/Card";
import { notifyFavoriteChange, queueFavoriteUpdate } from "../data/favoriteQueue";
import type { Movie } from "../types/database";
import type { User } from "../types/User";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function Search() {
  const { theme } = useStyle();
  const [search, setSearch] = useLocalStorage("streamtuc-search-query", "");
  const [movies, setMovies] = useLocalStorage<Movie[]>("streamtuc-search-results", []);
  const [searched, setSearched] = useLocalStorage("streamtuc-search-completed", false);
  const [loggedUser] = useLocalStorage<User | null>("streamtuc-logged-user", null);
  const [loading, setLoading] = useState(false);
  const [isAddingAll, setIsAddingAll] = useState(false);

  const addAllSearchResults = async () => {
    if (!loggedUser || movies.length === 0 || isAddingAll) return;

    setIsAddingAll(true);
    try {
      for (const movie of movies) {
        const updatedUser = await queueFavoriteUpdate(movie.id, true);
        if (updatedUser) notifyFavoriteChange(updatedUser);
      }
    } finally {
      setIsAddingAll(false);
    }
  };

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
    <Container fluid className={`${theme}-mode catalog-page`}>
      <section className="catalog-explorer search-page">
        <div className="catalog-section-heading">
          <div>
            <span className="catalog-eyebrow">Encontrá tu próxima película</span>
            <h1>Buscar películas</h1>
          </div>
        </div>

      <Form onSubmit={handleSubmit} className="catalog-search-form mb-5">
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
          <div className="catalog-section-heading search-results-heading">
            <h2>Resultados para: <strong>{search}</strong></h2>
            <Button type="button" variant="primary" onClick={() => void addAllSearchResults()} disabled={!loggedUser || movies.length === 0 || isAddingAll}>
              {isAddingAll ? <Spinner animation="border" size="sm" aria-hidden="true" /> : "Agregar todos a favoritos"}
            </Button>
          </div>

          {movies.length === 0 ? (
            <p>No se encontraron películas con ese nombre.</p>
          ) : (
            <Row className="catalog-grid">
              {movies.map((movie) => (
                <div key={movie.id}>
                  <Card movie={movie} theme={theme} detailState={movie} detailFrom="/search" />
                </div>
              ))}
            </Row>
          )}
        </>
      )}
      </section>
    </Container>
  );
}