import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { CustomMovieModal } from "./CustomMovieModal";
import {
  CUSTOM_MOVIE_BIN_KEY,
  CUSTOM_MOVIES_KEY,
  MOVIE_GENRES,
  notifyCustomMoviesChange,
  readFeaturedMovies,
  saveFeaturedMovies,
  type CustomMovie,
} from "../data/customMovies";
import { initialMovies } from "../data/initialMovies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useStyle } from "../context/styles";

const initialCustomMovies: CustomMovie[] = initialMovies.map((movie) => ({
  ...movie,
  isCustom: true,
}));

export function CustomMoviesAdmin() {
  const { theme } = useStyle();
  const [movies, setMovies] = useLocalStorage<CustomMovie[]>(CUSTOM_MOVIES_KEY, initialCustomMovies);
  const [bin, setBin] = useLocalStorage<CustomMovie[]>(CUSTOM_MOVIE_BIN_KEY, []);
  const [editing, setEditing] = useState<CustomMovie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
    const [sortBy, setSortBy] = useState<"none" | "title" | "genre">("none");
  const [featuredMovies, setFeaturedMovies] = useState<CustomMovie[]>(() => readFeaturedMovies() as CustomMovie[]);

  useEffect(() => {
    const refreshFeaturedMovies = () => {
      setFeaturedMovies(readFeaturedMovies() as CustomMovie[]);
    };

    window.addEventListener("streamtuc-featured-change", refreshFeaturedMovies);
    return () => window.removeEventListener("streamtuc-featured-change", refreshFeaturedMovies);
  }, [setFeaturedMovies]);

  const saveMovie = (movie: CustomMovie) => {
    setMovies((current) => {
      const exists = current.some((item) => item.id === movie.id);
      return exists ? current.map((item) => item.id === movie.id ? movie : item) : [movie, ...current];
    });
    notifyCustomMoviesChange();
  };

  const moveToBin = (movie: CustomMovie) => {
    setMovies((current) => current.filter((item) => item.id !== movie.id));
    setBin((current) => [movie, ...current.filter((item) => item.id !== movie.id)]);
    saveFeaturedMovies(featuredMovies.filter((item) => item.id !== movie.id));
    notifyCustomMoviesChange();
  };

  const clearList = () => {
    setBin((current) => [...movies, ...current.filter((item) => !movies.some((movie) => movie.id === item.id))]);
    setMovies([]);
    const movieIds = new Set(movies.map((movie) => movie.id));
    saveFeaturedMovies(featuredMovies.filter((movie) => !movieIds.has(movie.id)));
    setConfirmClear(false);
    notifyCustomMoviesChange();
  };

  const restore = (movie: CustomMovie) => {
    setBin((current) => current.filter((item) => item.id !== movie.id));
    setMovies((current) => [movie, ...current.filter((item) => item.id !== movie.id)]);
    notifyCustomMoviesChange();
  };

  const permanentlyDelete = (id: number) => setBin((current) => current.filter((movie) => movie.id !== id));

  const toggleFeatured = (movie: CustomMovie) => {
    const nextFeaturedMovies = featuredMovies.some((item) => item.id === movie.id)
      ? featuredMovies.filter((item) => item.id !== movie.id)
      : [...featuredMovies, movie];
    setFeaturedMovies(nextFeaturedMovies);
    saveFeaturedMovies(nextFeaturedMovies);
  };

  const toggleVisibility = (movie: CustomMovie) => {
    const nextMovies = movies.map((item) => item.id === movie.id
      ? { ...item, isHidden: !item.isHidden }
      : item);
    setMovies(nextMovies);
    localStorage.setItem(CUSTOM_MOVIES_KEY, JSON.stringify(nextMovies));
    notifyCustomMoviesChange();
  };

  const toggleAllVisibility = () => {
    const shouldHide = movies.some((movie) => !movie.isHidden);
    const nextMovies = movies.map((movie) => ({ ...movie, isHidden: shouldHide }));
    setMovies(nextMovies);
    localStorage.setItem(CUSTOM_MOVIES_KEY, JSON.stringify(nextMovies));
    notifyCustomMoviesChange();
  };

  const toggleAllFeatured = () => {
    const movieIds = new Set(movies.map((movie) => movie.id));
    const allMoviesAreFeatured = movies.length > 0 && movies.every((movie) => featuredMovies.some((item) => item.id === movie.id));
    const nextFeaturedMovies = allMoviesAreFeatured
      ? featuredMovies.filter((movie) => !movieIds.has(movie.id))
      : [
          ...featuredMovies.filter((movie) => !movieIds.has(movie.id)),
          ...movies,
        ];
    setFeaturedMovies(nextFeaturedMovies);
    saveFeaturedMovies(nextFeaturedMovies);
  };

    const getGenreLabel = (movie: CustomMovie) =>
    movie.genre_ids
      .map((id) => MOVIE_GENRES.find((genre) => genre.id === id)?.label || "")
      .join(", ");

  const sortedMovies = useMemo(() => {
    if (sortBy === "none") return movies;
    const sorted = [...movies];
    if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => getGenreLabel(a).localeCompare(getGenreLabel(b)));
    }
    return sorted;
  }, [movies, sortBy]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Películas personalizadas</h2>
                <div className="d-flex gap-2">
          <Form.Select
            size="sm"
            style={{ maxWidth: "200px" }}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as "none" | "title" | "genre")}
            aria-label="Ordenar películas"
          >
            <option value="none">Sin ordenar</option>
            <option value="title">Ordenar por título</option>
            <option value="genre">Ordenar por categoría</option>
          </Form.Select>
          <Button variant="outline-secondary" disabled={!movies.length} onClick={toggleAllVisibility}>
            {movies.length > 0 && movies.every((movie) => movie.isHidden) ? "Mostrar todas" : "Ocultar todas"}
          </Button>
          <Button variant="outline-warning" disabled={!movies.length} onClick={toggleAllFeatured}>
            {movies.length > 0 && movies.every((movie) => featuredMovies.some((item) => item.id === movie.id)) ? "Quitar destacadas" : "Destacar todas"}
          </Button>
          <Button variant="outline-danger" disabled={!movies.length} onClick={() => setConfirmClear(true)}>Limpiar lista</Button>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}>Agregar película</Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead><tr><th>Portada</th><th>Título</th><th>Géneros</th><th>Estreno</th><th>Acciones</th></tr></thead>
                <tbody>
          {sortedMovies.map((movie) => (
            <tr key={movie.id}>
              <td>
                <img
                  src={movie.poster_path}
                  alt={`Portada de ${movie.title}`}
                  width="48"
                  height="72"
                  className="rounded object-fit-cover"
                />
              </td>
              <td>{movie.title}</td>
              <td>{movie.genre_ids.map((id) => MOVIE_GENRES.find((genre) => genre.id === id)?.label || id).join(", ") || "Sin género"}</td>
              <td>{String(movie.release_date) || "-"}</td>
              <td>
                <Button size="sm" variant={featuredMovies.some((item) => item.id === movie.id) ? "warning" : "outline-warning"} className="me-2" onClick={() => toggleFeatured(movie)} aria-label={`Destacar ${movie.title}`}><span aria-hidden="true">★</span></Button>
                <Button size="sm" variant={movie.isHidden ? "outline-secondary" : "secondary"} className="me-2" onClick={() => toggleVisibility(movie)} aria-label={movie.isHidden ? `Mostrar ${movie.title} en el catálogo` : `Ocultar ${movie.title} del catálogo`}>
                  {movie.isHidden ? "Mostrar" : "Ocultar"}
                </Button>
                <Button size="sm" variant="warning" className="me-2" onClick={() => { setEditing(movie); setShowModal(true); }}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => moveToBin(movie)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!movies.length && <p className="text-muted">No hay películas personalizadas cargadas.</p>}

      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <h3 className="mb-0">Papelera</h3>
        <Button variant="outline-danger" size="sm" disabled={!bin.length} onClick={() => setBin([])}>Vaciar papelera</Button>
      </div>
      <Table striped bordered responsive>
        <tbody>
          {bin.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td className="text-end">
                <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => restore(movie)}>Restaurar</Button>
                <Button size="sm" variant="outline-danger" aria-label={`Eliminar ${movie.title} definitivamente`} onClick={() => permanentlyDelete(movie.id)}>X</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!bin.length && <p className="text-muted">La papelera está vacía.</p>}

      <CustomMovieModal key={`${editing?.id || "new"}-${showModal}`} show={showModal} movie={editing} onHide={() => setShowModal(false)} onSave={saveMovie} />
            <Modal show={confirmClear} onHide={() => setConfirmClear(false)} centered dialogClassName={`${theme}-mode`}>
        <Modal.Header closeButton closeVariant={theme === "dark" ? "white" : undefined}><Modal.Title>¿Limpiar películas?</Modal.Title></Modal.Header>
        <Modal.Body>Las películas se moverán a la papelera y podrán restaurarse.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>Cancelar</Button>
          <Button variant="danger" onClick={clearList}>Mover a papelera</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
