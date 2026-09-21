import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import type { Comment } from '../../types/comment';

interface Props {
  comment: Comment;
  canEdit: boolean;
  canDelete: boolean;
  onUpdate: (id: string, text: string, rating?: number) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, canEdit, canDelete, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [rating, setRating] = useState<number>(comment.rating ?? 0);

  const handleSave = () => {
    if (!text.trim()) return;
    onUpdate(comment.id, text.trim(), rating || undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(comment.text);
    setRating(comment.rating ?? 0);
    setIsEditing(false);
  };

  // Si un admin lo ocultó, no mostramos el contenido real ni permitimos editar/borrar
  if (comment.hidden) {
    return (
      <Card className="comment-card comment-card-hidden mb-3">
        <Card.Body>
          <Card.Subtitle className="mb-1 text-body-secondary">
            {comment.author}
          </Card.Subtitle>
          <Card.Text className="mt-2 mb-1 fst-italic text-muted">
            Comentario oculto por un administrador
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="comment-card mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="comment-card-author">
            <span className="comment-avatar" aria-hidden="true">
              {comment.author.charAt(0).toUpperCase()}
            </span>
            <div>
              <Card.Subtitle className="mb-0">{comment.author}</Card.Subtitle>
              {!isEditing && comment.rating ? (
                <span className="comment-rating-badge">{comment.rating}/10 ⭐</span>
              ) : null}
            </div>
          </div>
          {!isEditing && (
            <div className="d-flex gap-2">
              {canEdit && (
                <Button size="sm" variant="outline-secondary" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
              {canDelete && (
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(comment.id)}>
                  Eliminar
                </Button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={0}>Sin calificación</option>
                {Array.from({ length: 10 }, (_, index) => index + 1).map((n) => (
                  <option key={n} value={n}>{n} ⭐</option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button size="sm" variant="primary" onClick={handleSave}>
                Guardar
              </Button>
              <Button size="sm" variant="outline-secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Card.Text className="mt-2 mb-1">{comment.text}</Card.Text>
            <small className="text-muted">
              {new Date(comment.createdAt).toLocaleString()}
              {comment.updatedAt ? ' (editado)' : ''}
            </small>
          </>
        )}
      </Card.Body>
    </Card>
  );
}