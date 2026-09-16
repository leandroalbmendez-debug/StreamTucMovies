import { Badge, Button, Table } from 'react-bootstrap';
import type { Comment } from '../../types/comment';

interface Props {
  comments: Comment[];
  getMovieTitle: (movieId: string) => string;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CommentsAdminTable({ comments, getMovieTitle, onToggleHidden, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="text-muted">No hay comentarios que coincidan con el filtro.</p>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Película</th>
          <th>Comentario</th>
          <th>Calificación</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td>{comment.author}</td>
            <td>{getMovieTitle(comment.movieId)}</td>
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
        ))}
      </tbody>
    </Table>
  );
}