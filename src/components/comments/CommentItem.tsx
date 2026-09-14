import { Card, Button } from 'react-bootstrap';
import type { Comment } from './types';

interface Props {
  comment: Comment;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, onDelete }: Props) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Subtitle className="mb-1 text-body-secondary">
            {comment.author}
            {comment.rating ? ` — ${'⭐'.repeat(comment.rating)}` : ''}
          </Card.Subtitle>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => onDelete(comment.id)}
          >
            Eliminar
          </Button>
        </div>
        <Card.Text className="mt-2 mb-1">{comment.text}</Card.Text>
        <small className="text-muted">
          {new Date(comment.createdAt).toLocaleString()}
        </small>
      </Card.Body>
    </Card>
  );
}