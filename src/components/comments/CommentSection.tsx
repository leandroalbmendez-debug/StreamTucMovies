import { useComments } from './useComments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { useLocalStorage } from '@uidotdev/usehooks';
import type { User } from '../../types/User';
import { useStyle } from '../../context/styles';

interface Props {
  movieId: string;
}

export function CommentSection({ movieId }: Props) {
  const { theme } = useStyle();
  const [loggedUser] = useLocalStorage<User | null>('streamtuc-logged-user', null);
  const { comments, addComment, canEdit, canDelete, updateComment, deleteComment } = useComments(movieId, loggedUser);

  return (
    <section className={`comments-section ${theme}-mode mt-4`}>
      <h4>Comentarios ({comments.length})</h4>
      {loggedUser ? (
        <CommentForm
          loggedInAuthor={loggedUser.username}
          onSubmit={addComment}
        />
      ) : (
        <p className="text-muted">Iniciá sesión para publicar un comentario.</p>
      )}
      <CommentList
        comments={comments}
        canEdit={canEdit}
        canDelete={canDelete}
        onUpdate={updateComment}
        onDelete={deleteComment}
      />
    </section>
  );
}