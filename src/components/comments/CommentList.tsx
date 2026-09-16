import type { Comment } from '../../types/comment';
import { CommentItem } from './CommentItem';

interface Props {
  comments: Comment[];
  canDelete: (comment: Comment) => boolean;
  onDelete: (id: string) => void;
}

export function CommentList({ comments, canDelete, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="text-muted">Aún no hay comentarios. ¡Sé el primero!</p>;
  }

  return (
    <div>
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          canDelete={canDelete(c)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}