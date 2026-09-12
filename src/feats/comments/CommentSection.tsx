import { useComments } from './useComments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

interface Props {
  movieId: string;
}

export function CommentSection({ movieId }: Props) {
  const { comments, addComment, deleteComment } = useComments(movieId);

  return (
    <section className="mt-4">
      <h4>Comentarios ({comments.length})</h4>
      <CommentForm onSubmit={addComment} />
      <CommentList comments={comments} onDelete={deleteComment} />
    </section>
  );
}