import { Badge, Button, Table } from 'react-bootstrap';
import type { Comment } from '../../types/comment';
import type { Movie } from '../../types/database';
import { isCustomMovie, MOVIE_GENRES } from '../../data/customMovies';
import { customMovieImageUrl, movieImageUrl } from '../../data/movieImages';

interface Props {
  comments: Comment[];
  getMovieTitle: (movieId: string) => string;
  getMovie: (movieId: string) => Movie | undefined;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
}

function getMovieGenreLabels(movie: Movie | undefined) {
  if (!movie) return '—';
  const labels = movie.genre_ids
    .map((id) => MOVIE_GENRES.find((genre) => genre.id === id)?.label)
    .filter((label): label is string => Boolean(label));
  return labels.length ? labels.join(', ') : 'Sin género';
}

function getMoviePosterUrl(movie: Movie | undefined) {
  if (!movie) return '';
  return isCustomMovie(movie)
    ? customMovieImageUrl(movie.poster_path)
    : movieImageUrl(movie.poster_path);
}

export function CommentsAdminTable({ comments, getMovieTitle, getMovie, onToggleHidden, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="text-muted">No hay comentarios que coincidan con el filtro.</p>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Portada</th>
          <th>Película</th>
          <th>Género</th>
          <th>Comentario</th>
          <th>Calificación</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => {
          const movie = getMovie(comment.movieId);
          const posterUrl = getMoviePosterUrl(movie);

          return (
            <tr key={comment.id}>
              <td>{comment.author}</td>
              <td>
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={`Portada de ${getMovieTitle(comment.movieId)}`}
                    className="comments-admin-poster"
                  />
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td>{getMovieTitle(comment.movieId)}</td>
              <td>{getMovieGenreLabels(movie)}</td>
              <td style={{ maxWidth: 300 }}>
                {comment.hidden ? (
                  <span className="fst-italic text-muted">Comentario oculto por un administrador</span>
                ) : (
                  comment.text
                )}
              </td>
              <td>{comment.rating ? `${comment.rating}/10` : '—'}</td>
              <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
              <td>
                {comment.hidden ? (
                  <Badge bg="secondary">Oculto</Badge>
                ) : (
                  <Badge bg="success">Visible</Badge>
                )}
              </td>
              <td>
                <Button
                  variant={comment.hidden ? 'outline-secondary' : 'warning'}
                  size="sm"
                  className="me-2"
                  onClick={() => onToggleHidden(comment.id)}
                >
                  {comment.hidden ? 'Mostrar' : 'Ocultar'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(comment.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
