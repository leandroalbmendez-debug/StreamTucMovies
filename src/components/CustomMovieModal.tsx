import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCustomMovie, MOVIE_GENRES, type CustomMovie } from "../data/customMovies";
import type { Movie } from "../types/database";
import { useStyle } from "../context/styles";

type Props = {
  show: boolean;
  movie?: CustomMovie | null;
  onHide: () => void;
  onSave: (movie: CustomMovie) => void;
};

export function CustomMovieModal({ show, movie, onHide, onSave }: Props) {
  const [draft, setDraft] = useState<CustomMovie>(() => movie || createCustomMovie({}));
    const { theme } = useStyle();

  const update = (field: keyof Movie, value: string | number | number[]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleGenre = (genreId: number) => {
    const genres = draft.genre_ids.includes(genreId)
      ? draft.genre_ids.filter((id) => id !== genreId)
      : [...draft.genre_ids, genreId];
    update("genre_ids", genres);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave(createCustomMovie(draft));
    onHide();
  };

  return (
        <Modal show={show} onHide={onHide} centered size="lg" dialogClassName={`${theme}-mode`}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton closeVariant={theme === "dark" ? "white" : undefined}>
          <Modal.Title>{movie ? "Editar película" : "Nueva película"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              required
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Géneros</Form.Label>
            <div className="catalog-genres favorites-genres d-flex flex-wrap gap-2">
              {MOVIE_GENRES.map((genre) => (
                <Button
                  key={genre.id}
                  type="button"
                  className={draft.genre_ids.includes(genre.id) ? "active" : ""}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.label}
                </Button>
              ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={draft.overview}
              onChange={(event) => update("overview", event.target.value)}
            />
          </Form.Group>
          <div className="row g-3">
            <Form.Group className="col-md-6">
              <Form.Label>Fecha de estreno</Form.Label>
              <Form.Control
                type="date"
                value={String(draft.release_date)}
                onChange={(event) => update("release_date", event.target.value)}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Calificación</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={draft.vote_average || ""}
                onChange={(event) => update("vote_average", Number(event.target.value))}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>URL o ruta pública del póster</Form.Label>
              <Form.Control
                value={draft.poster_path}
                onChange={(event) => update("poster_path", event.target.value)}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>URL o ruta pública del fondo</Form.Label>
              <Form.Control
                value={draft.backdrop_path}
                onChange={(event) => update("backdrop_path", event.target.value)}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={onHide}>Cancelar</Button>
          <Button variant="primary" type="submit">Guardar película</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
