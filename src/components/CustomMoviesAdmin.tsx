import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
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
import { useLocalStorage } from "../hooks/useLocalStorage";

export function CustomMoviesAdmin() {
  const [movies, setMovies] = useLocalStorage<CustomMovie[]>(CUSTOM_MOVIES_KEY, []);
  const [bin, setBin] = useLocalStorage<CustomMovie[]>(CUSTOM_MOVIE_BIN_KEY, []);
  const [editing, setEditing] = useState<CustomMovie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
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
    notifyCustomMoviesChange();
  };

  const clearList = () => {
    setBin((current) => [...movies, ...current.filter((item) => !movies.some((movie) => movie.id === item.id))]);
    setMovies([]);
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

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Películas personalizadas</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" disabled={!movies.length} onClick={() => setConfirmClear(true)}>Limpiar lista</Button>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}>Agregar película</Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead><tr><th>Título</th><th>Géneros</th><th>Estreno</th><th>Acciones</th></tr></thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.genre_ids.map((id) => MOVIE_GENRES.find((genre) => genre.id === id)?.label || id).join(", ") || "Sin género"}</td>
              <td>{String(movie.release_date) || "-"}</td>
              <td>
                <Button size="sm" variant={featuredMovies.some((item) => item.id === movie.id) ? "warning" : "outline-warning"} className="me-2" onClick={() => toggleFeatured(movie)} aria-label={`Destacar ${movie.title}`}><span aria-hidden="true">★</span></Button>
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
      <Modal show={confirmClear} onHide={() => setConfirmClear(false)} centered>
        <Modal.Header closeButton><Modal.Title>¿Limpiar películas?</Modal.Title></Modal.Header>
        <Modal.Body>Las películas se moverán a la papelera y podrán restaurarse.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>Cancelar</Button>
          <Button variant="danger" onClick={clearList}>Mover a papelera</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
