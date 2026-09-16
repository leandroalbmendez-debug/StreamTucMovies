import type { Comment } from '../../types/comment';
import { CommentItem } from './CommentItem';

interface Props {
  comments: Comment[];
  canEdit: (comment: Comment) => boolean;
  canDelete: (comment: Comment) => boolean;
  onUpdate: (id: string, text: string, rating?: number) => void;
  onDelete: (id: string) => void;
}

export function CommentList({ comments, canEdit, canDelete, onUpdate, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="text-muted">Aún no hay comentarios. ¡Sé el primero!</p>;
  }

  return (
    <div>
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          canEdit={canEdit(c)}
          canDelete={canDelete(c)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}