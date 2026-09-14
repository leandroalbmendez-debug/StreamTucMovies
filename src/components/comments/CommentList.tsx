import type { Comment } from './types';
import { CommentItem } from './CommentItem';

interface Props {
  comments: Comment[];
  onDelete: (id: string) => void;
}

export function CommentList({ comments, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="text-muted">Aún no hay comentarios. ¡Sé el primero!</p>;
  }

  return (
    <div>
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onDelete={onDelete} />
      ))}
    </div>
  );
}